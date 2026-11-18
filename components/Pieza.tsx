"use client";

import { DROP, precioTexto, type Fase } from "@/lib/drop";
import type { Escena } from "./Experience";
import type { Sonido } from "./useSonido";
import Emblema from "./Emblema";
import TeeViewer from "./TeeViewer";
import Registro from "./Registro";
import Foto from "./Foto";
import Pie from "./Pie";
import { BotonSonido, IconoVolver } from "./Iconos";

const DETALLES = [
  { t: `${DROP.gramaje} g/m²`, d: "Algodón peinado y preencogido. Cae pesado." },
  { t: "Cuello grueso", d: "Doble costura. Vuelve a su forma." },
  { t: "Serigrafía", d: "Tinta blanca que aguanta las lavadas." },
  { t: "001 a 050", d: "Tu número en la etiqueta. No se reedita." },
  { t: "Un mensaje adentro", d: "Solo lo encuentra quien la usa." },
  { t: "Corte boxy", d: "Hombro caído, largo corto. También en crop." },
];

export default function Pieza({ fase, sonido, ir }: { fase: Fase; sonido: Sonido; ir: (e: Escena, ancla?: string) => void }) {
  const cta = fase === "lista" ? "Entrar a la lista" : fase === "preventa" ? "Firmar" : "Sealed";
  const [g1, g2, g3] = DROP.lookbook;

  return (
    <div className="scene">
      <section className="pieza-hero" aria-label="GENESIS">
        <div className="pieza-hero__top">
          <button type="button" className="icono-btn" onClick={() => ir("cuarto")} aria-label="Volver al cuarto">
            <IconoVolver />
          </button>
          <Emblema size={64} />
          <BotonSonido on={sonido.activo} onClick={sonido.alternar} />
        </div>
        <div className="pieza-hero__titulo">
          <h1 className="display"><span className="revela">{DROP.nombre}</span></h1>
          <p>After the darkness, the sacred pact shall rise again.</p>
        </div>
        <TeeViewer />
        <p className="pieza-hero__pie meta">{DROP.piezas} piezas numeradas</p>
      </section>

      <section className="lookbook" aria-label="GENESIS puesta">
        <div className="lookbook__grande">
          <Foto src={g1.src} alt={g1.alt} etiqueta={g1.etiqueta} ratio="3 / 4" />
        </div>
        <div className="lookbook__lado">
          <Foto src={g2.src} alt={g2.alt} etiqueta={g2.etiqueta} ratio="4 / 5" />
          <Foto src={g3.src} alt={g3.alt} etiqueta={g3.etiqueta} ratio="4 / 5" />
        </div>
      </section>

      <section className="bloque detalles" aria-labelledby="detalles">
        <h2 id="detalles" className="display detalles__titulo">Por qué esta y no otra</h2>
        <div className="detalles__fotos">
          {DROP.detallesFotos.map((f) => (
            <Foto key={f.alt} src={f.src} alt={f.alt} etiqueta={f.etiqueta} ratio="1 / 1" />
          ))}
        </div>
        <ul className="detalles__lista">
          {DETALLES.map((d) => (
            <li key={d.t}><strong>{d.t}</strong><span>{d.d}</span></li>
          ))}
        </ul>
      </section>

      <section className="bloque pruebas" aria-labelledby="pruebas">
        <h2 id="pruebas" className="display detalles__titulo">No te lo decimos. Te lo mostramos.</h2>
        <div className="pruebas__grid">
          {DROP.pruebas.map((p) => (
            <Foto key={p.titulo} src={p.video} alt={p.titulo.toLowerCase()} etiqueta={p.texto} ratio="9 / 16" video />
          ))}
        </div>
      </section>

      <Registro fase={fase} />

      <Pie />

      <div className="barra">
        <div className="barra__inner">
          <div className="barra__info">
            <strong>{DROP.nombre} <span className="num" style={{ fontWeight: 400, color: "var(--gris)" }}>{precioTexto()}</span></strong>
          </div>
          <a className="boton boton--claro" href="#registro">{cta}</a>
        </div>
      </div>
    </div>
  );
}
