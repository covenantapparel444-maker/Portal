"use client";

import { useRef, useState } from "react";
import { DROP } from "@/lib/drop";
import type { Escena } from "./Experience";
import type { Sonido } from "./useSonido";

type Panel = "manifiesto" | "caja" | "telefono" | null;

const PANELES: Record<Exclude<Panel, null>, { k: string; t: string; b: string }> = {
  manifiesto: {
    k: "El manifiesto",
    t: "Nada empieza sin un pacto.",
    b: "Antes de la luz, hubo silencio.\nEn la sombra no nos escondimos: construimos.\nHicimos una promesa cuando nadie miraba.\nNo vestimos para ser vistos. Vestimos lo que juramos ser.\nWE ARE THE PROMISE.",
  },
  caja: {
    k: "La caja",
    t: "Así llega tu pieza.",
    b: "Bolsa negra sellada con el emblema.\nLa camiseta envuelta, con tu número.\nUna carta con el manifiesto y tu código de Founder.\nActívalo en el portal y entra al círculo.",
  },
  telefono: {
    k: "El teléfono",
    t: "Contesta una persona, no un bot.",
    b: `Pagos: solo por ${DROP.pasarelaNombre}, nunca a una cuenta personal.\nEnvíos: a toda Colombia desde Cajicá, se pagan aparte.\nEntrega: antes del ${DROP.entrega}.\nEscríbenos por WhatsApp y te responde Mateo o Johan.`,
  },
};

export default function Cuarto({ sonido, ir }: { sonido: Sonido; ir: (e: Escena, ancla?: string) => void }) {
  const mesa = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<Panel>(null);

  // La luz sigue el cursor o el dedo; los objetos se mueven un poco al revés (parallax).
  const mover = (e: React.PointerEvent) => {
    const el = mesa.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--lx", `${x * 100}%`);
    el.style.setProperty("--ly", `${y * 100}%`);
    el.style.setProperty("--px", `${(0.5 - x).toFixed(3)}`);
    el.style.setProperty("--py", `${(0.5 - y).toFixed(3)}`);
  };

  const p = panel ? PANELES[panel] : null;
  const wa = DROP.whatsapp ? `https://wa.me/${DROP.whatsapp}` : undefined;

  return (
    <section className="cuarto scene" aria-label="El cuarto del pacto">
      <div className="topbar mono">
        <span>Chapter 01 — The Call</span>
        <button type="button" className="bracket mono" onClick={sonido.alternar} aria-pressed={sonido.activo}>
          [ Sonido // {sonido.activo ? "On" : "Off"} ]
        </button>
      </div>
      <p className="mono cuarto__hint">Acerca la luz. Toca lo que hay sobre la mesa.</p>

      <div className="mesa" ref={mesa} onPointerMove={mover}>
        <span className="vela" style={{ left: "47%", top: "8%", width: "3%" }} />
        <span className="vela" style={{ left: "50%", top: "86%", width: "3%" }} />
        <span className="vela" style={{ left: "90%", top: "87%", width: "2.4%" }} />

        <button type="button" className="obj" style={{ left: "33%", top: "28%", width: "33%", height: "42%", ["--r" as string]: "-3deg", ["--d" as string]: 10 }} onClick={() => setPanel("manifiesto")} aria-label="Leer el manifiesto">
          <span className="manifiesto"><b>THE PACT</b><i /><i /><i style={{ width: "80%" }} /><i /><i style={{ width: "60%" }} /><i className="sello" /></span>
        </button>
        <span className="obj-label" style={{ left: "33%", top: "72%", ["--d" as string]: 10 }}>[ El manifiesto ]</span>

        <button type="button" className="obj ofrenda" style={{ left: "66%", top: "48%", width: "30%", height: "30%", ["--r" as string]: "7deg", ["--d" as string]: 16 }} onClick={() => ir("pieza")} aria-label="La ofrenda: ver la camiseta GENESIS">
          <img src="/genesis/genesis-back-cut.webp" alt="" width={600} height={600} />
        </button>
        <span className="obj-label" style={{ left: "70%", top: "80%", ["--d" as string]: 16 }}>[ La ofrenda ]</span>

        <button type="button" className="obj" style={{ left: "10%", top: "64%", width: "30%", height: "2.6%", ["--r" as string]: "-24deg", ["--d" as string]: 22 }} onClick={() => ir("pieza", "registro")} aria-label="Tomar la pluma y firmar">
          <span className="pluma" />
        </button>
        <span className="obj-label" style={{ left: "10%", top: "77%", ["--d" as string]: 22 }}>[ La pluma ]</span>

        <button type="button" className="obj" style={{ left: "7%", top: "11%", width: "20%", height: "20%", ["--r" as string]: "-8deg", ["--d" as string]: 8 }} onClick={() => setPanel("caja")} aria-label="Abrir la caja">
          <span className="caja"><img src="/genesis/emblem.webp" alt="" width={120} height={120} /></span>
        </button>
        <span className="obj-label" style={{ left: "7%", top: "34%", ["--d" as string]: 8 }}>[ La caja ]</span>

        <button type="button" className="obj" style={{ left: "74%", top: "9%", width: "12%", height: "24%", ["--r" as string]: "12deg", ["--d" as string]: 12 }} onClick={() => setPanel("telefono")} aria-label="El teléfono: contacto y preguntas">
          <span className="telefono"><span /></span>
        </button>
        <span className="obj-label" style={{ left: "69%", top: "36%", ["--d" as string]: 12 }}>[ El teléfono ]</span>

        <div className="luz" aria-hidden="true" />

        {p && (
          <div className="panel" role="dialog" aria-label={p.k}>
            <div className="panel__inner">
              <span className="mono muted">{p.k}</span>
              <p className="disp panel__titulo">{p.t}</p>
              <p className="panel__texto">{p.b}</p>
              <div className="fila-botones">
                <button type="button" className="btn btn--linea" onClick={() => setPanel(null)}>[ Volver a la mesa ]</button>
                {panel === "telefono" && wa ? (
                  <a className="btn btn--claro" href={wa} target="_blank" rel="noopener">[ Escribir por WhatsApp ]</a>
                ) : (
                  <button type="button" className="btn btn--claro" onClick={() => ir("pieza")}>[ Ver GENESIS ]</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", padding: "0 24px" }}>
        <button type="button" className="btn btn--claro" onClick={() => ir("pieza")}>[ Salir a la luz ]</button>
      </div>
    </section>
  );
}
