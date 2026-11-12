"use client";

import { useEffect, useState } from "react";

const GLIFOS = "†‡◊§¶#%&@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Las letras se "descifran" una por una hasta formar la palabra.
export default function Scramble({ text, duration = 1100 }: { text: string; duration?: number }) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const fijas = Math.floor(k * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        s += i < fijas || text[i] === " " ? text[i] : GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
      }
      setOut(s);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return (
    <>
      <span aria-hidden="true">{out}</span>
      <span className="sr">{text}</span>
    </>
  );
}
