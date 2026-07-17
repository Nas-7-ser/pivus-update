/* PIVUS — Icônes (tracés simples) */
function Icon({ name, size }) {
  const s = size || 24;
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    wave: <path d="M2 12c2.5 0 2.5-5 5-5s2.5 10 5 10 2.5-10 5-10 2.5 5 5 5" />,
    grid: <g><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></g>,
    eye: <g><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="2.6" /></g>,
    info: <g><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
    check: <path d="M20 6 9 17l-5-5" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    droplet: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
    agro: <path d="M12 21V9M12 9c0-3 2-5 5-5 0 3-2 5-5 5Zm0 3c0-3-2-5-5-5 0 3 2 5 5 5Z" />,
    chem: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 14h9" />,
    pharma: <g><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M12 12v5M9.5 14.5h5" /></g>,
    cosmo: <g><rect x="8" y="9" width="8" height="12" rx="2" /><path d="M10 9V5h4v4M9 13h6" /></g>,
    target: <g><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></g>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}
window.Icon = Icon;
