// Íconos de línea, del mismo grosor en toda la web.

export function IconoSonido({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {on ? (
        <g><path d="M15.5 9a4.2 4.2 0 0 1 0 6" /><path d="M18 6.5a8 8 0 0 1 0 11" /></g>
      ) : (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      )}
    </svg>
  );
}

export function IconoVolver() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" /><path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function BotonSonido({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" className="icono-btn" onClick={onClick} aria-pressed={on} aria-label={on ? "Silenciar" : "Activar sonido"}>
      <IconoSonido on={on} />
    </button>
  );
}

// Redes: usa los mismos íconos del portal como máscara, para que tomen el color del texto.
const REDES = [
  { nombre: "Instagram", url: "https://www.instagram.com/covenantstudios__/", icono: "/portal/instagram.svg" },
  { nombre: "TikTok", url: "https://www.tiktok.com/@covenantstudios__", icono: "/portal/tiktok.svg" },
  { nombre: "YouTube", url: "https://www.youtube.com/@covenantstudios", icono: "/portal/youtube.svg" },
  { nombre: "Kick", url: "https://kick.com/covenantstudios", icono: "/portal/kick.svg" },
];

export function Redes() {
  return (
    <ul className="redes">
      {REDES.map((r) => (
        <li key={r.nombre}>
          <a href={r.url} target="_blank" rel="noopener" aria-label={r.nombre}>
            <i style={{ ["--src" as string]: `url(${r.icono})` }} />
          </a>
        </li>
      ))}
    </ul>
  );
}
