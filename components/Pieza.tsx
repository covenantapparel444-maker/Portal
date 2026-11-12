"use client";

import { DROP, precioTexto, type Fase } from "@/lib/drop";
import type { Escena } from "./Experience";
import Emblema from "./Emblema";
import Scramble from "./Scramble";
import TeeViewer from "./TeeViewer";
import Registro from "./Registro";

const SPECS = [`${DROP.gramaje} g/m²`, "Preencogida", "Cuello doble costura", "Serigrafía", "Mensaje oculto", "001 — 050", "No se reedita"];

export default function Pieza({ fase, ir }: { fase: Fase; ir: (e: Escena, ancla?: string) => void }) {
  const wa = DROP.whatsapp ? `https://wa.me/${DROP.whatsapp}` : undefined;
  const libres = DROP.piezas - DROP.foundersReservadas;
  const cta = fase === "lista" ? "[ Lista ]" : fase === "preventa" ? "[ Firmar ]" : "[ Sealed ]";

  return (
    <div className="scene">
      <section className="hero" aria-label="GENESIS">
        <div className="hero__esquinas">
          <button type="button" onClick={() => ir("cuarto")}>{DROP.parte}<br />Limited release</button>
          <span style={{ textAlign: "right" }}>{DROP.abre} — {DROP.cierra}<br />{DROP.anio}</span>
        </div>
        <div className="hero__titulo">
          <Emblema size={46} />
          <h1 className="disp"><Scramble text={DROP.nombre} /></h1>
          <p>After the darkness, the sacred pact shall rise again.</p>
        </div>
        <TeeViewer />
        <div className="hero__pie">
          <span>{String(DROP.piezas).padStart(3, "0")}<br />Piezas</span>
          <span>Numerada. No se reedita.<br />{precioTexto()}</span>
          <a href="#registro">Firmar<br />el pacto</a>
        </div>
      </section>

      <div className="cinta" aria-label="Especificaciones">
        <div className="cinta__track mono">
          {[...SPECS, ...SPECS].map((s, i) => (
            <span key={i} aria-hidden={i >= SPECS.length}>[ {s} ]</span>
          ))}
        </div>
      </div>

      <section className="seccion" aria-label="Las pruebas">
        <div className="seccion__cabeza">
          <h2 className="disp">No te lo decimos.<br />Te lo mostramos.</h2>
          <span className="mono muted">Behind the Pact 01 — 03</span>
        </div>
        <div className="pruebas">
          <div className="prueba"><span className="prueba__video">[ Video ]</span><span className="mono muted">01 // La gramera</span><strong>El peso real, sin edición.</strong></div>
          <div className="prueba"><span className="prueba__video">[ Video ]</span><span className="mono muted">02 // 10 lavadas</span><strong>Misma talla. Mismo negro.</strong></div>
          <div className="prueba"><span className="prueba__video">[ Video ]</span><span className="mono muted">03 // El cuello</span><strong>Se estira y vuelve.</strong></div>
        </div>
      </section>

      <Registro fase={fase} />

      <section style={{ background: "var(--negro)" }}>
        <div className="seccion" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="garantias">
            <div><span className="mono muted" style={{ fontSize: 11 }}>[ Si no se produce ]</span><span>Menos de {DROP.minimoParaProducir} piezas: te devolvemos el 100%.</span></div>
            <div><span className="mono muted" style={{ fontSize: 11 }}>[ Entrega ]</span><span>Antes del {DROP.entrega}, desde Cajicá.</span></div>
            <div><span className="mono muted" style={{ fontSize: 11 }}>[ Talla ]</span><span>Cambio garantizado en 5 días.</span></div>
            <div><span className="mono muted" style={{ fontSize: 11 }}>[ Quién responde ]</span><span>Mateo y Johan, por {wa ? <a href={wa} target="_blank" rel="noopener">WhatsApp</a> : "WhatsApp"}.</span></div>
          </div>
        </div>
        <div className="pie mono">
          <span className="disp" style={{ color: "var(--blanco)", letterSpacing: "0.1em" }}>WE ARE THE PROMISE</span>
          <span>Empezó en un examen de inglés — La Sabana</span>
          <a href="/portal" style={{ textDecoration: "none" }}>[ Portal ]</a>
        </div>
      </section>

      <div className="barra">
        <div className="barra__inner">
          <div className="barra__info">
            <span>{DROP.nombre} · {precioTexto()}</span>
            <span className="muted">{fase === "sellado" ? "Sealed // 0 de 50" : fase === "lista" ? `Abre el ${DROP.abre} // ${libres} líneas` : `Preventa hasta el ${DROP.cierra}`}</span>
          </div>
          <a className="btn btn--claro" href="#registro" style={{ minHeight: 46 }}>{cta}</a>
        </div>
      </div>
    </div>
  );
}
