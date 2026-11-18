"use client";

import { useState } from "react";
import type { Escena } from "./Experience";
import type { Sonido } from "./useSonido";
import { BotonSonido } from "./Iconos";

export default function Llamada({ sonido, ir }: { sonido: Sonido; ir: (e: Escena, ancla?: string) => void }) {
  const [colgado, setColgado] = useState(false);

  const contestar = () => ir("cuarto");
  const colgar = () => {
    sonido.timbre(false);
    setColgado(true);
  };
  const devolver = () => {
    setColgado(false);
    sonido.timbre(true);
  };

  return (
    <section className="llamada scene" aria-label="Llamada entrante">
      <div className="barra-top">
        <span className="marca">COVENANT STUDIOS</span>
        <BotonSonido on={sonido.activo} onClick={sonido.alternar} />
      </div>

      {!colgado ? (
        <>
          <div className="llamada__centro vibra">
            <div className="semaforo" aria-hidden="true" />
            <p className="llamada__quien">Unknown Caller</p>
            <h1 className="display llamada__titulo">¿Estás listo?</h1>
          </div>
          <div className="botones">
            <div className="boton-llamada">
              <button type="button" className="colgar" onClick={colgar} aria-label="Colgar">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8e8e8a" strokeWidth="1.4" aria-hidden="true">
                  <path d="M3 15c5-4 13-4 18 0l-2 3-4-1v-2c-2-.6-4-.6-6 0v2l-4 1z" />
                </svg>
              </button>
              Colgar
            </div>
            <div className="boton-llamada" style={{ color: "var(--piedra)" }}>
              <button type="button" className="contestar" onClick={contestar} aria-label="Contestar">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" aria-hidden="true">
                  <path d="M5 4l4 1 1 4-2 1c1 2.5 3.5 5 6 6l1-2 4 1 1 4c-8 1-16-7-15-15z" />
                </svg>
              </button>
              Contestar
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="llamada__centro">
            <p className="llamada__quien">Llamada terminada</p>
            <p className="display llamada__titulo" style={{ fontSize: "clamp(34px, 8vw, 88px)" }}>El pacto no espera.</p>
          </div>
          <div className="botones">
            <button type="button" className="boton boton--linea" onClick={devolver}>Devolver la llamada</button>
          </div>
        </>
      )}

      <div className="llamada__pie meta">Season 01</div>
    </section>
  );
}
