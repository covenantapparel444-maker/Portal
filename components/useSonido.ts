"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Sonido de la experiencia:
// - La llamada: un timbre sintetizado con Web Audio (no pesa nada).
// - El cuarto y la pieza: el tema de Covenant (/portal/theme.mp3), que solo
//   se descarga si la persona activa el sonido.
export function useSonido() {
  const [activo, setActivo] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const timbre = useRef<number | null>(null);
  const tema = useRef<HTMLAudioElement | null>(null);
  const escenaActual = useRef<string>("llamada");

  const pararTimbre = useCallback(() => {
    if (timbre.current) window.clearInterval(timbre.current);
    timbre.current = null;
  }, []);

  const sonarTimbre = useCallback(() => {
    if (!ctx.current) ctx.current = new AudioContext();
    const ac = ctx.current;
    const tono = () => {
      const t0 = ac.currentTime;
      [0, 0.45].forEach((off) => {
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t0 + off);
        g.gain.linearRampToValueAtTime(0.08, t0 + off + 0.03);
        g.gain.setValueAtTime(0.08, t0 + off + 0.32);
        g.gain.linearRampToValueAtTime(0, t0 + off + 0.38);
        g.connect(ac.destination);
        [440, 480].forEach((f) => {
          const o = ac.createOscillator();
          o.frequency.value = f;
          o.connect(g);
          o.start(t0 + off);
          o.stop(t0 + off + 0.4);
        });
      });
    };
    pararTimbre();
    tono();
    timbre.current = window.setInterval(tono, 2600);
  }, [pararTimbre]);

  const fadeTema = useCallback((to: number) => {
    const a = tema.current;
    if (!a) return;
    const from = a.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else if (to === 0) a.pause();
    };
    if (to > 0) a.play().catch(() => {});
    requestAnimationFrame(step);
  }, []);

  const aplicar = useCallback(
    (on: boolean, escena: string) => {
      if (escena === "llamada") {
        fadeTema(0);
        if (on) sonarTimbre();
        else pararTimbre();
      } else {
        pararTimbre();
        if (on) {
          if (!tema.current) {
            tema.current = new Audio("/portal/theme.mp3");
            tema.current.loop = true;
            tema.current.volume = 0;
          }
          fadeTema(0.6);
        } else fadeTema(0);
      }
    },
    [fadeTema, pararTimbre, sonarTimbre]
  );

  const alternar = useCallback(() => {
    setActivo((v) => {
      aplicar(!v, escenaActual.current);
      return !v;
    });
  }, [aplicar]);

  const escena = useCallback(
    (e: string) => {
      escenaActual.current = e;
      aplicar(activo, e);
    },
    [activo, aplicar]
  );

  useEffect(() => () => { pararTimbre(); tema.current?.pause(); }, [pararTimbre]);

  return useMemo(() => ({ activo, alternar, escena, pararTimbre }), [activo, alternar, escena, pararTimbre]);
}

export type Sonido = ReturnType<typeof useSonido>;
