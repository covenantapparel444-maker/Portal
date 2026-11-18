"use client";

import { useRef, useState } from "react";

// La camiseta gira en 3D al arrastrarla y se acomoda en el frente o la espalda.
export default function TeeViewer() {
  const [rot, setRot] = useState(180); // empieza en la espalda: la frase del regreso
  const [drag, setDrag] = useState(false);
  const start = useRef({ x: 0, rot: 0 });

  const down = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, rot };
    setDrag(true);
  };
  const move = (e: React.PointerEvent) => {
    if (drag) setRot(start.current.rot + (e.clientX - start.current.x) * 0.6);
  };
  const up = () => {
    if (!drag) return;
    setDrag(false);
    setRot((r) => Math.round(r / 180) * 180);
  };

  const espalda = Math.abs(Math.round(rot / 180)) % 2 === 1;
  const mostrar = (atras: boolean) => setRot((r) => Math.round(r / 360) * 360 + (atras ? 180 : 0));

  return (
    <div className="tee">
      <div className="tee__escena" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="Camiseta GENESIS. Arrástrala para girarla.">
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
      <div className="tee__lados">
        <button type="button" aria-pressed={!espalda} onClick={() => mostrar(false)}>Frente</button>
        <button type="button" aria-pressed={espalda} onClick={() => mostrar(true)}>Espalda</button>
      </div>
    </div>
  );
}
