"use client";

import { useRef, useState } from "react";

// La camiseta gira en 3D: se arrastra con el dedo o el mouse, y al soltar
// se acomoda en el frente o la espalda.
export default function TeeViewer() {
  const [rot, setRot] = useState(180); // empieza mostrando la espalda (la frase del regreso)
  const [drag, setDrag] = useState(false);
  const start = useRef({ x: 0, rot: 0 });

  const down = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, rot };
    setDrag(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    setRot(start.current.rot + (e.clientX - start.current.x) * 0.6);
  };
  const up = () => {
    if (!drag) return;
    setDrag(false);
    setRot((r) => Math.round(r / 180) * 180);
  };

  const mostrandoEspalda = Math.round(rot / 180) % 2 !== 0;
  const a = (espalda: boolean) => {
    setRot((r) => {
      const base = Math.round(r / 360) * 360;
      return espalda ? base + 180 : base;
    });
  };

  return (
    <div className="tee">
      <div className="tee__escena" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="Camiseta GENESIS. Arrastra para girarla.">
        <div className={`tee__carta${drag ? " arrastrando" : ""}`} style={{ transform: `rotateY(${rot}deg)` }}>
          <div className="tee__cara">
            <img src="/genesis/genesis-front-cut.webp" alt="" width={1200} height={1200} draggable={false} />
          </div>
          <div className="tee__cara tee__cara--atras">
            <img src="/genesis/genesis-back-cut.webp" alt="" width={1200} height={1200} draggable={false} />
          </div>
        </div>
      </div>
      <div className="tee__sombra" aria-hidden="true" />
      <div className="tee__controles">
        <button type="button" aria-pressed={!mostrandoEspalda} onClick={() => a(false)}>[ Frente ]</button>
        <span className="mono" style={{ fontSize: 10, color: "#777" }}>← arrastra →</span>
        <button type="button" aria-pressed={mostrandoEspalda} onClick={() => a(true)}>[ Espalda ]</button>
      </div>
    </div>
  );
}
