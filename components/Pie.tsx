import { Redes } from "./Iconos";

export default function Pie() {
  return (
    <footer className="pie">
      <div className="pie__arriba">
        <p className="pie__lema">We are the promise.</p>
        <Redes />
      </div>
      <p className="pie__marca" aria-label="Covenant Studios">COVENANT STUDIOS</p>
      <div className="pie__abajo meta">
        <nav aria-label="Legal" className="pie__legal">
          <a href="/legal/privacidad">Tratamiento de datos</a>
          <a href="/legal/terminos">Términos y condiciones</a>
          <a href="/legal/cambios">Cambios y devoluciones</a>
          <a href="/portal">Portal</a>
        </nav>
        <span>© 2026 Covenant Studios. Cajicá, Colombia.</span>
      </div>
    </footer>
  );
}
