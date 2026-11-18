"use client";

import { useEffect, useRef, useState } from "react";

// La camiseta gira sola entre espalda y frente. Se puede arrastrar para girarla;
// al soltar se acomoda y, tras unos segundos quieta, vuelve a girar sola.
export default function TeeViewer() {
  const [rot, setRot] = useState(180); // empieza en la espalda: la frase del regreso
  const [drag, setDrag] = useState(false);
  const arrastre = useRef<{ x: number; rot: number; id: number } | null>(null);
  const ultimaInteraccion = useRef(0);

  // Giro automático cada 4,5 s mientras nadie la toque.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (arrastre.current || Date.now() - ultimaInteraccion.current < 6000) return;
      setRot((r) => Math.round(r / 180) * 180 + 180);
    }, 4500);
    return () => window.clearInterval(t);
  }, []);

  // El arrastre se sigue en toda la ventana: así nunca se queda "pegado" si el cursor sale de la camiseta.
  useEffect(() => {
    if (!drag) return;
    const mover = (e: PointerEvent) => {
      const a = arrastre.current;
      if (!a || e.pointerId !== a.id) return;
      setRot(a.rot + (e.clientX - a.x) * 0.6);
    };
    const soltar = () => {
      arrastre.current = null;
      ultimaInteraccion.current = Date.now();
      setDrag(false);
      setRot((r) => Math.round(r / 180) * 180);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);
    window.addEventListener("blur", soltar);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      window.removeEventListener("blur", soltar);
    };
  }, [drag]);

  const empezar = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    arrastre.current = { x: e.clientX, rot, id: e.pointerId };
    ultimaInteraccion.current = Date.now();
    setDrag(true);
  };

  const espalda = Math.abs(Math.round(rot / 180)) % 2 === 1;
  const mostrar = (atras: boolean) => {
    ultimaInteraccion.current = Date.now();
    setRot((r) => Math.round(r / 360) * 360 + (atras ? 180 : 0));
  };

  return (
    <div className="tee">
      <div className="tee__escena" onPointerDown={empezar} onDragStart={(e) => e.preventDefault()} role="img" aria-label="Camiseta GENESIS. Arrástrala para girarla.">
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
