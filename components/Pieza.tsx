"use client";

import { DROP, precioTexto, type Fase } from "@/lib/drop";
import type { Escena } from "./Experience";
import Emblema from "./Emblema";
import TeeViewer from "./TeeViewer";
import Registro from "./Registro";

const DETALLES = [
  { t: `Algodón peinado de ${DROP.gramaje} g/m²`, d: "Preencogido: no cambia de talla al lavarla. Cae pesado y no se pega al cuerpo." },
  { t: "Cuello de rib grueso", d: "Doble costura. Es lo primero que se deforma en una camiseta barata; este vuelve a su forma." },
  { t: "Serigrafía", d: "Tinta blanca de alta opacidad que se siente parte de la tela y aguanta las lavadas." },
  { t: "Numerada del 001 al 050", d: "Tu número va en la etiqueta interior. Nadie más lo tiene y no se reedita." },
  { t: "Un mensaje adentro", d: "Solo lo encuentra quien la tiene puesta." },
  { t: "Corte boxy", d: "Hombro caído y largo corto, probado en distintos cuerpos. También en crop top." },
];

export default function Pieza({ fase, ir }: { fase: Fase; ir: (e: Escena, ancla?: string) => void }) {
  const wa = DROP.whatsapp ? `https://wa.me/${DROP.whatsapp}` : undefined;
  const pruebas = DROP.pruebas.filter((p) => p.video);
  const cta = fase === "lista" ? "Entrar a la lista" : fase === "preventa" ? "Firmar" : "Sealed";
  const estado = fase === "lista" ? `Preventa desde el ${DROP.abre}` : fase === "preventa" ? `Preventa hasta el ${DROP.cierra}` : "Las 50 piezas tienen dueño";

  return (
    <div className="scene">
      <section className="pieza-hero" aria-label="GENESIS">
        <div className="barra-top meta" style={{ color: "#6a6a66" }}>
          <button type="button" className="enlace" onClick={() => ir("cuarto")}>Volver al cuarto</button>
          <span>{DROP.parte}</span>
        </div>
        <div className="pieza-hero__titulo">
          <Emblema size={38} />
          <h1 className="display"><span className="revela">{DROP.nombre}</span></h1>
          <p>After the darkness, the sacred pact shall rise again.</p>
        </div>
        <TeeViewer />
        <div className="pieza-hero__pie meta" style={{ color: "#6a6a66" }}>
          <span>{DROP.piezas} piezas numeradas</span>
          <span>{estado}</span>
        </div>
      </section>

      <section className="bloque dos-col" aria-labelledby="detalles">
        <h2 id="detalles" className="display dos-col__titulo">
          Por qué esta y no otra
          <small>Una camiseta que vale lo que cuesta se nota en la mano. Esto es lo que vas a sentir.</small>
        </h2>
        <ul className="filas">
          {DETALLES.map((d) => (
            <li key={d.t}><strong>{d.t}</strong><span>{d.d}</span></li>
          ))}
        </ul>
      </section>

      {pruebas.length > 0 && (
        <section className="bloque" aria-label="Las pruebas" style={{ paddingTop: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 20 }}>
            {pruebas.map((p) => (
              <figure key={p.titulo} style={{ margin: 0 }}>
                <video src={p.video!} muted loop playsInline autoPlay style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", background: "#0a0a0a" }} />
                <figcaption style={{ marginTop: 14 }}><strong style={{ fontWeight: 500 }}>{p.titulo}</strong><br /><span className="meta">{p.texto}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <Registro fase={fase} />

      <section className="bloque" aria-label="Garantías" style={{ paddingTop: "clamp(80px, 10vw, 128px)", paddingBottom: "clamp(80px, 10vw, 128px)" }}>
        <div className="garantias">
          <div><h3>Si no llegamos a {DROP.minimoParaProducir} piezas</h3><p>Te devolvemos el 100% de lo que pagaste.</p></div>
          <div><h3>Entrega</h3><p>Antes del {DROP.entrega}, despachada desde Cajicá.</p></div>
          <div><h3>Talla</h3><p>Si no te queda, la cambiamos dentro de los 5 días después de recibirla.</p></div>
          <div><h3>Quién responde</h3><p>Mateo y Johan, por {wa ? <a href={wa} target="_blank" rel="noopener">WhatsApp</a> : "WhatsApp"}.</p></div>
        </div>
      </section>

      <footer className="pie meta">
        <span className="marca" style={{ color: "var(--piedra)" }}>WE ARE THE PROMISE</span>
        <span>Empezó en un examen de inglés en La Sabana.</span>
        <a href="/portal" style={{ textDecoration: "none" }}>Portal</a>
      </footer>

      <div className="barra">
        <div className="barra__inner">
          <div className="barra__info">
            <strong>{DROP.nombre} <span className="num" style={{ fontWeight: 400, color: "var(--gris)" }}>{precioTexto()}</span></strong>
            <span className="meta">{estado}</span>
          </div>
          <a className="boton boton--claro" href="#registro">{cta}</a>
        </div>
      </div>
    </div>
  );
}
