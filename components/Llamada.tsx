"use client";

import { useState } from "react";
import { DROP, type Fase } from "@/lib/drop";
import type { Escena } from "./Experience";
import type { Sonido } from "./useSonido";

export default function Llamada({ fase, sonido, ir }: { fase: Fase; sonido: Sonido; ir: (e: Escena, ancla?: string) => void }) {
  const [colgado, setColgado] = useState(false);

  const contestar = () => {
    sonido.pararTimbre();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(30);
    ir("cuarto");
  };
  const colgar = () => {
    sonido.pararTimbre();
    setColgado(true);
  };

  const estado = fase === "lista" ? `ABRE ${DROP.abre}.${DROP.anio}` : fase === "preventa" ? `ABIERTO // ${DROP.cierra}.${DROP.anio}` : "SEALED";

  return (
    <section className="llamada scene" aria-label="La llamada">
      <div className="topbar mono">
        <span>Covenant Studios</span>
        <button type="button" className="bracket mono" onClick={sonido.alternar} aria-pressed={sonido.activo}>
          [ Sonido // {sonido.activo ? "On" : "Off"} ]
        </button>
      </div>

      {!colgado ? (
        <div className="llamada__centro">
          <div className="semaforo" aria-hidden="true" />
          <span className="mono" style={{ fontSize: 13, letterSpacing: "0.3em", color: "var(--humo)" }}>
            Unknown Caller
          </span>
          <h1 className="disp llamada__titulo ring">¿Estás listo?</h1>
          <div className="botones">
            <div className="boton-llamada">
              <button type="button" className="colgar" onClick={colgar} aria-label="Colgar la llamada">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8b8b8" strokeWidth="1.6" aria-hidden="true">
                  <path d="M3 15c5-4 13-4 18 0l-2 3-4-1v-2c-2-.6-4-.6-6 0v2l-4 1z" />
                </svg>
              </button>
              <span className="mono muted" style={{ fontSize: 11 }}>Colgar</span>
            </div>
            <div className="boton-llamada">
              <button type="button" className="contestar" onClick={contestar} aria-label="Contestar la llamada y entrar">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 4l4 1 1 4-2 1c1 2.5 3.5 5 6 6l1-2 4 1 1 4c-8 1-16-7-15-15z" />
                </svg>
              </button>
              <span className="mono" style={{ fontSize: 11 }}>Contestar</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="llamada__centro">
          <span className="mono muted" style={{ fontSize: 13, letterSpacing: "0.3em" }}>Llamada terminada</span>
          <p className="disp" style={{ margin: 0, fontSize: "clamp(30px, 6vw, 60px)" }}>El pacto no espera a nadie.</p>
          <button type="button" className="btn btn--linea" onClick={contestar}>[ Devolver la llamada ]</button>
        </div>
      )}

      <div className="llamada__pie mono">
        <span>The Signal<br />Season 01</span>
        <button type="button" className="bracket mono directo" onClick={() => { sonido.pararTimbre(); ir("pieza"); }}>
          Ir directo a GENESIS →
        </button>
        <span style={{ textAlign: "right" }}>{estado}<br />{String(DROP.piezas).padStart(3, "0")} piezas</span>
      </div>
    </section>
  );
}
