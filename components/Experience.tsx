"use client";

import { useCallback, useEffect, useState } from "react";
import type { Fase } from "@/lib/drop";
import Llamada from "./Llamada";
import Cuarto from "./Cuarto";
import Pieza from "./Pieza";
import { useSonido } from "./useSonido";

export type Escena = "llamada" | "cuarto" | "pieza";

export default function Experience({ fase }: { fase: Fase }) {
  const [escena, setEscena] = useState<Escena>("llamada");
  const sonido = useSonido();

  // Enlaces directos: /#genesis o /#registro abren la pieza sin pasar por la llamada.
  useEffect(() => {
    const h = window.location.hash;
    if (h === "#genesis" || h === "#registro") setEscena("pieza");
  }, []);

  const ir = useCallback(
    (e: Escena, ancla?: string) => {
      setEscena(e);
      sonido.escena(e);
      if (e === "pieza" && ancla) {
        requestAnimationFrame(() => setTimeout(() => document.getElementById(ancla)?.scrollIntoView({ behavior: "smooth" }), 350));
      } else {
        window.scrollTo({ top: 0 });
      }
    },
    [sonido]
  );

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      {escena === "llamada" && <Llamada fase={fase} sonido={sonido} ir={ir} />}
      {escena === "cuarto" && <Cuarto sonido={sonido} ir={ir} />}
      {escena === "pieza" && <Pieza fase={fase} ir={ir} />}
    </main>
  );
}
