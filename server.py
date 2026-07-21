#!/usr/bin/env python3
"""PIVUS local dev server (optional).

Production deploy uses Netlify static hosting + Netlify Functions + Blobs.
Run locally with:  netlify dev
Or this script:    python3 server.py

  GET  /                 -> PIVUS.html (also /admin, /cgu, /cgv, /equipe,
                            /cas-usage and /cas-usage/<n> via SPA fallback)
  GET  /api/content      -> saved editable content (JSON, {} if none yet)
  POST /api/login        -> { password } -> { token }
  POST /api/content      -> (auth) persist editable content to content.json
  POST /api/contact      -> contact form -> emails team@pivus-systems.com

Configuration via environment variables (all optional):
  PIVUS_ADMIN_PASSWORD   admin password           (default: pivus2026)
  PIVUS_PORT             port to listen on        (default: 8000)
  PIVUS_CONTACT_TO       form recipient           (default: team@pivus-systems.com)
  PIVUS_SMTP_HOST        SMTP host (enables real email sending)
  PIVUS_SMTP_PORT        SMTP port                (default: 587)
  PIVUS_SMTP_USER        SMTP username
  PIVUS_SMTP_PASS        SMTP password
  PIVUS_SMTP_FROM        From address             (default: SMTP_USER or CONTACT_TO)
  PIVUS_SMTP_TLS         "1" to use STARTTLS      (default: 1)
"""

import json
import os
import secrets
import smtplib
import ssl
from datetime import datetime
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT_FILE = os.path.join(ROOT, "content.json")
SUBMISSIONS_DIR = os.path.join(ROOT, "submissions")

ADMIN_PASSWORD = os.environ.get("PIVUS_ADMIN_PASSWORD", "pivus2026")
CONTACT_TO = os.environ.get("PIVUS_CONTACT_TO", "team@pivus-systems.com")
PORT = int(os.environ.get("PIVUS_PORT", "8000"))

# In-memory set of valid session tokens (reset on restart).
TOKENS = set()

# Client-side routes that should fall back to the SPA shell.
SPA_ROUTES = {
    "/", "/admin", "/cgu", "/cgv", "/equipe", "/team",
    "/cas-usage", "/use-cases", "/index.html", "/PIVUS.html",
}
# Client-side route prefixes (e.g. /cas-usage/3 for a single use case).
SPA_PREFIXES = ("/cas-usage/", "/use-cases/")


def is_spa_route(path):
    return path in SPA_ROUTES or path.startswith(SPA_PREFIXES)


def smtp_configured():
    return bool(os.environ.get("PIVUS_SMTP_HOST"))


def load_content():
    """Read the saved editable content (content.json); {} if none/invalid."""
    if not os.path.exists(CONTENT_FILE):
        return {}
    try:
        with open(CONTENT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (ValueError, OSError):
        return {}


def current_recipient():
    """The address the contact form is delivered to.

    Source of truth is the admin-editable site.email in content.json; falls back
    to PIVUS_CONTACT_TO (env) / the built-in default when unset or invalid.

    Content is bilingual ({"fr": {...}, "en": {...}}); site.email is shared and
    mirrored across languages, so we read it from fr first, then legacy flat.
    """
    data = load_content()
    site = (data.get("fr") or {}).get("site") or data.get("site") or {}
    email = (site.get("email") or "").strip()
    return email if ("@" in email) else CONTACT_TO


def _send_email(subject, body, to, reply_to=None):
    """Send an email if SMTP is configured; otherwise return False (caller stores)."""
    host = os.environ.get("PIVUS_SMTP_HOST")
    if not host:
        return False
    port = int(os.environ.get("PIVUS_SMTP_PORT", "587"))
    user = os.environ.get("PIVUS_SMTP_USER")
    password = os.environ.get("PIVUS_SMTP_PASS")
    sender = os.environ.get("PIVUS_SMTP_FROM") or user or to
    use_tls = os.environ.get("PIVUS_SMTP_TLS", "1") == "1"

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body)

    with smtplib.SMTP(host, port, timeout=20) as smtp:
        if use_tls:
            smtp.starttls(context=ssl.create_default_context())
        if user and password:
            smtp.login(user, password)
        smtp.send_message(msg)
    return True


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # Quieter, single-line logging.
    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args))

    # ---- helpers -----------------------------------------------------------
    def _json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            return {}

    def _authed(self):
        auth = self.headers.get("Authorization", "")
        token = auth[7:].strip() if auth.startswith("Bearer ") else ""
        return bool(token) and token in TOKENS

    # ---- GET ----------------------------------------------------------------
    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/content":
            data = {}
            if os.path.exists(CONTENT_FILE):
                try:
                    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
                        data = json.load(f)
                except (ValueError, OSError):
                    data = {}
            self._json(200, data)
            return

        if path == "/api/health":
            self._json(200, {"ok": True})
            return

        if path == "/api/email-status":
            if not self._authed():
                self._json(401, {"error": "Non autorisé"})
                return
            self._json(200, {
                "smtp_configured": smtp_configured(),
                "recipient": current_recipient(),
            })
            return

        # SPA fallback: serve the app shell for client-side routes.
        if is_spa_route(path):
            self.path = "/PIVUS.html"
            return SimpleHTTPRequestHandler.do_GET(self)

        # Everything else: real static files (js, css, assets, uploads...).
        return SimpleHTTPRequestHandler.do_GET(self)

    # ---- POST ---------------------------------------------------------------
    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/api/login":
            data = self._read_json()
            if str(data.get("password", "")) == ADMIN_PASSWORD:
                token = secrets.token_urlsafe(32)
                TOKENS.add(token)
                self._json(200, {"token": token})
            else:
                self._json(401, {"error": "Mot de passe incorrect"})
            return

        if path == "/api/logout":
            auth = self.headers.get("Authorization", "")
            token = auth[7:].strip() if auth.startswith("Bearer ") else ""
            TOKENS.discard(token)
            self._json(200, {"ok": True})
            return

        if path == "/api/content":
            if not self._authed():
                self._json(401, {"error": "Non autorisé"})
                return
            data = self._read_json()
            content = data.get("content", data)
            try:
                with open(CONTENT_FILE, "w", encoding="utf-8") as f:
                    json.dump(content, f, ensure_ascii=False, indent=2)
                self._json(200, {"ok": True})
            except OSError as exc:
                self._json(500, {"error": "Échec de l'enregistrement: %s" % exc})
            return

        if path == "/api/test-email":
            if not self._authed():
                self._json(401, {"error": "Non autorisé"})
                return
            self._handle_test_email()
            return

        if path == "/api/contact":
            data = self._read_json()
            self._handle_contact(data)
            return

        self._json(404, {"error": "Not found"})

    def _handle_test_email(self):
        recipient = current_recipient()
        if not smtp_configured():
            self._json(200, {
                "ok": True, "emailed": False, "recipient": recipient,
                "message": ("SMTP non configuré — aucun email réel n'est envoyé. "
                            "Les messages du formulaire sont enregistrés dans ./submissions. "
                            "Configurez PIVUS_SMTP_HOST (et user/pass) pour activer l'envoi."),
            })
            return
        body = (
            "Ceci est un email de test envoyé depuis l'administration du site PIVUS.\n"
            "Si vous recevez ce message, l'envoi d'emails fonctionne correctement.\n\n"
            "Envoyé le : %s" % datetime.now().isoformat(timespec="seconds")
        )
        try:
            _send_email("PIVUS — Test d'envoi d'email", body, to=recipient)
            self._json(200, {
                "ok": True, "emailed": True, "recipient": recipient,
                "message": "Email de test envoyé à %s. Vérifiez la boîte de réception." % recipient,
            })
        except Exception as exc:  # noqa: BLE001
            self._json(200, {
                "ok": False, "emailed": False, "recipient": recipient,
                "message": "Échec de l'envoi : %s" % exc,
            })

    def _handle_contact(self, data):
        nom = str(data.get("nom", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()
        if not nom or "@" not in email or len(message) < 10:
            self._json(400, {"error": "Champs requis manquants ou invalides"})
            return

        lines = [
            "Nouveau message depuis le site PIVUS",
            "=" * 40,
            "Nom        : %s" % nom,
            "Email      : %s" % email,
            "Société    : %s" % data.get("societe", ""),
            "Secteur    : %s" % data.get("secteur", ""),
            "Liquide    : %s" % data.get("liquide", ""),
            "Stade      : %s" % data.get("stade", ""),
            "Reçu le    : %s" % datetime.now().isoformat(timespec="seconds"),
            "",
            "Message:",
            message,
        ]
        body = "\n".join(lines)
        subject = "Nouveau cas PIVUS — %s" % (data.get("societe") or nom)
        recipient = current_recipient()

        sent = False
        try:
            sent = _send_email(subject, body, to=recipient, reply_to=email)
        except Exception as exc:  # noqa: BLE001 — never crash the request
            print("[contact] email send failed: %s" % exc)
            sent = False

        # Always persist a copy so nothing is lost when SMTP is not configured.
        try:
            os.makedirs(SUBMISSIONS_DIR, exist_ok=True)
            stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
            with open(os.path.join(SUBMISSIONS_DIR, "%s.txt" % stamp), "w", encoding="utf-8") as f:
                f.write(body)
        except OSError as exc:
            print("[contact] could not store submission: %s" % exc)

        self._json(200, {"ok": True, "emailed": sent, "to": recipient})


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("PIVUS server running at http://127.0.0.1:%d" % PORT)
    print("  admin:    http://127.0.0.1:%d/admin  (password: %s)" % (PORT, ADMIN_PASSWORD))
    print("  contact recipient: %s" % current_recipient())
    smtp = "configured" if smtp_configured() else "NOT configured (submissions saved to ./submissions)"
    print("  SMTP: %s" % smtp)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nshutting down")
        server.shutdown()


if __name__ == "__main__":
    main()
