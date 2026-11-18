"use client";

import { useEffect, useRef, useState } from "react";
import { DROP } from "@/lib/drop";
import type { Escena } from "./Experience";
import type { Sonido } from "./useSonido";
import { BotonSonido } from "./Iconos";

type Hoja = "manifiesto" | "caja" | null;

const HOJAS: Record<Exclude<Hoja, null>, { titulo: string; texto: string }> = {
  manifiesto: {
    titulo: "Nada empieza sin un pacto.",
    texto:
      "Antes de la luz, hubo silencio.\nEn la sombra no nos escondimos: construimos.\nHicimos una promesa cuando nadie miraba.\nNo vestimos para ser vistos. Vestimos lo que juramos ser.\n\nWe are the promise.",
  },
  caja: {
    titulo: "Así llega tu pieza.",
    texto:
      "Una bolsa negra sellada con el emblema.\nLa camiseta envuelta, con tu número.\nUna carta con el manifiesto y tu código de Founder, para activarlo en el portal.",
  },
};

export default function Cuarto({ sonido, ir }: { sonido: Sonido; ir: (e: Escena, ancla?: string) => void }) {
  const cuarto = useRef<HTMLElement>(null);
  const indice = useRef<HTMLDivElement>(null);
  const [hoja, setHoja] = useState<Hoja>(null);

  // En pantallas táctiles la luz recorre la mesa sola hasta que la persona la toca.
  useEffect(() => {
    const el = cuarto.current;
    const ix = indice.current;
    if (!el || !ix || window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ix.style.setProperty("--radio", "62vw");
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const k = ((t - t0) / 7000) % 1;
      const x = `${30 + Math.sin(k * Math.PI * 2) * 22}%`, y = `${45 + Math.cos(k * Math.PI * 2) * 30}%`;
      ix.style.setProperty("--lx", x);
      ix.style.setProperty("--ly", y);
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mover = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // en celular la luz se mueve sola
    const el = cuarto.current;
    const ix = indice.current;
    if (!el || !ix) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    const ri = ix.getBoundingClientRect();
    ix.style.setProperty("--lx", `${e.clientX - ri.left}px`);
    ix.style.setProperty("--ly", `${e.clientY - ri.top}px`);
  };

  const objetos = [
    { nombre: "El manifiesto", que: "Lo que firmamos y por qué.", accion: () => setHoja("manifiesto") },
    { nombre: "La ofrenda", que: "GENESIS, la primera pieza del pacto.", accion: () => ir("pieza") },
    { nombre: "La caja", que: "Lo que llega a tu puerta.", accion: () => setHoja("caja") },
    { nombre: "La pluma", que: "Elige tu número y firma.", accion: () => ir("pieza", "registro") },
  ];

  const lista = (luz: boolean) => (
    <ul className={`indice__capa ${luz ? "indice__capa--luz" : "indice__capa--tenue"}`} aria-hidden={!luz}>
      {objetos.map((o) => (
        <li key={o.nombre}>
          {luz ? (
            <button type="button" className="objeto" onClick={o.accion}>
              <span className="objeto__nombre">{o.nombre}</span>
              <span className="objeto__que">{o.que}</span>
            </button>
          ) : (
            <div className="objeto">
              <span className="objeto__nombre">{o.nombre}</span>
              <span className="objeto__que">{o.que}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const h = hoja ? HOJAS[hoja] : null;

  return (
    <section className="cuarto scene" ref={cuarto} onPointerMove={mover} aria-label="El cuarto del pacto">
      {DROP.fotoMesa && <div className="cuarto__foto" style={{ backgroundImage: `url(${DROP.fotoMesa})` }} aria-hidden="true" />}
      <div className="vela-luz" aria-hidden="true" />

      <div className="barra-top">
        <span className="meta">Capítulo 1: The Call</span>
        <BotonSonido on={sonido.activo} onClick={sonido.alternar} />
      </div>

      <div className="cuarto__mesa">
        <div className="indice" ref={indice}>
          {lista(false)}
          {lista(true)}
        </div>
      </div>

      <div className="cuarto__pie">
        <button type="button" className="boton boton--claro" onClick={() => ir("pieza")}>Salir a la luz</button>
      </div>

      {h && (
        <div className="hoja" role="dialog" aria-label={h.titulo}>
          <div className="hoja__inner">
            <h2 className="display hoja__titulo">{h.titulo}</h2>
            <p className="hoja__texto">{h.texto}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <button type="button" className="boton boton--claro" onClick={() => ir("pieza")}>Ver GENESIS</button>
              <button type="button" className="boton boton--linea" onClick={() => setHoja(null)}>Volver a la mesa</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
