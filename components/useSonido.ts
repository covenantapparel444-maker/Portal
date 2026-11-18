"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Sonido de la experiencia.
// - La llamada: un timbre sintetizado (Web Audio), con vibración corta en Android.
// - El cuarto y la pieza: el tema de Covenant (/portal/theme.mp3).
// Suena desde que se abre la página. Los navegadores bloquean el audio hasta que la
// persona toca la pantalla por primera vez: en ese caso empieza con el primer toque.
// Se pausa al salir de la pestaña y vuelve al regresar.
const CLAVE = "cvnt-sound";

export function useSonido() {
  const [activo, setActivo] = useState(true);
  const activoRef = useRef(true);
  const escenaRef = useRef<string>("llamada");
  const timbreOn = useRef(false); // la llamada está sonando (no colgada)
  const ctx = useRef<AudioContext | null>(null);
  const intervalo = useRef<number | null>(null);
  const tema = useRef<HTMLAudioElement | null>(null);
  const oculto = useRef(false);

  const tono = useCallback(() => {
    const ac = ctx.current;
    if (!ac || ac.state !== "running") return;
    const t0 = ac.currentTime;
    [0, 0.45].forEach((off) => {
      const g = ac.createGain();
      g.gain.setValueAtTime(0, t0 + off);
      g.gain.linearRampToValueAtTime(0.07, t0 + off + 0.03);
      g.gain.setValueAtTime(0.07, t0 + off + 0.32);
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
    try { navigator.vibrate?.([90, 70, 90]); } catch {}
  }, []);

  const pararTimbreAudio = useCallback(() => {
    if (intervalo.current) window.clearInterval(intervalo.current);
    intervalo.current = null;
  }, []);

  const fadeTema = useCallback((to: number) => {
    const a = tema.current;
    if (!a) return;
    const from = a.volume, t0 = performance.now();
    if (to > 0) a.play().catch(() => {});
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1200);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else if (to === 0) a.pause();
    };
    requestAnimationFrame(step);
  }, []);

  // Aplica el estado actual: qué debe sonar según la escena, si el sonido está activo y si la pestaña está visible.
  const aplicar = useCallback(() => {
    const on = activoRef.current && !oculto.current;
    if (escenaRef.current === "llamada") {
      fadeTema(0);
      if (on && timbreOn.current) {
        if (!ctx.current) ctx.current = new AudioContext();
        ctx.current.resume().catch(() => {});
        if (!intervalo.current) {
          tono();
          intervalo.current = window.setInterval(tono, 2600);
        }
      } else pararTimbreAudio();
    } else {
      pararTimbreAudio();
      if (on) {
        if (!tema.current) {
          tema.current = new Audio("/portal/theme.mp3");
          tema.current.loop = true;
          tema.current.volume = 0;
        }
        fadeTema(0.6);
      } else fadeTema(0);
    }
  }, [fadeTema, pararTimbreAudio, tono]);

  // Preferencia guardada, primer toque para desbloquear el audio, y pausa al salir de la pestaña.
  useEffect(() => {
    try {
      const v = localStorage.getItem(CLAVE);
      if (v === "off") { activoRef.current = false; setActivo(false); }
    } catch {}
    timbreOn.current = true;
    aplicar();

    const desbloquear = () => {
      if (!ctx.current) ctx.current = new AudioContext();
      ctx.current.resume().then(() => {
        pararTimbreAudio();
        aplicar();
      }).catch(() => {});
      if (escenaRef.current !== "llamada") aplicar();
    };
    const evs = ["pointerdown", "keydown", "touchstart"];
    evs.forEach((ev) => window.addEventListener(ev, desbloquear, { once: true, passive: true }));

    const visibilidad = () => {
      oculto.current = document.hidden;
      if (document.hidden) {
        pararTimbreAudio();
        tema.current?.pause();
      } else aplicar();
    };
    const salir = () => { pararTimbreAudio(); tema.current?.pause(); };
    document.addEventListener("visibilitychange", visibilidad);
    window.addEventListener("pagehide", salir);
    return () => {
      evs.forEach((ev) => window.removeEventListener(ev, desbloquear));
      document.removeEventListener("visibilitychange", visibilidad);
      window.removeEventListener("pagehide", salir);
      salir();
    };
  }, [aplicar, pararTimbreAudio]);

  const alternar = useCallback(() => {
    const v = !activoRef.current;
    activoRef.current = v;
    setActivo(v);
    try { localStorage.setItem(CLAVE, v ? "on" : "off"); } catch {}
    aplicar();
  }, [aplicar]);

  const escena = useCallback((e: string) => {
    escenaRef.current = e;
    aplicar();
  }, [aplicar]);

  // Colgar detiene el timbre; devolver la llamada lo vuelve a encender.
  const timbre = useCallback((on: boolean) => {
    timbreOn.current = on;
    pararTimbreAudio();
    aplicar();
  }, [aplicar, pararTimbreAudio]);

  return useMemo(() => ({ activo, alternar, escena, timbre }), [activo, alternar, escena, timbre]);
}

export type Sonido = ReturnType<typeof useSonido>;
