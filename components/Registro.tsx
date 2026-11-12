"use client";

import { useEffect, useMemo, useState } from "react";
import { CORTES, DROP, TALLAS, pad3, precioTexto, type Fase } from "@/lib/drop";

type Estado = "idle" | "enviando" | "ok" | "error" | "demo";

export default function Registro({ fase }: { fase: Fase }) {
  const [tomadas, setTomadas] = useState<number[]>([]);
  const [num, setNum] = useState<number | null>(null);
  const [talla, setTalla] = useState<string>("M");
  const [corte, setCorte] = useState<string>("tee");
  const [nombre, setNombre] = useState("");
  const [wa, setWa] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (fase !== "preventa") return;
    fetch("/api/lineas")
      .then((r) => (r.ok ? r.json() : { tomadas: [] }))
      .then((d) => setTomadas(Array.isArray(d.tomadas) ? d.tomadas : []))
      .catch(() => {});
  }, [fase]);

  const libres = DROP.piezas - DROP.foundersReservadas - tomadas.length;
  const nombreOk = nombre.trim().length > 1;
  const waOk = wa.replace(/\D/g, "").length >= 7;
  const puedeFirmar = fase === "preventa" ? num != null && nombreOk && waOk : nombreOk && waOk;

  const lineas = useMemo(
    () =>
      Array.from({ length: DROP.piezas }, (_, i) => {
        const n = i + 1;
        const founder = n <= DROP.foundersReservadas;
        const firmada = tomadas.includes(n);
        return { n, founder, firmada, bloqueada: founder || firmada || fase !== "preventa" };
      }),
    [tomadas, fase]
  );

  const enviar = async () => {
    if (!puedeFirmar) return;
    setEstado("enviando");
    const ruta = fase === "preventa" ? "/api/reserve" : "/api/waitlist";
    const cuerpo = fase === "preventa" ? { numero: num, nombre, whatsapp: wa, talla, corte } : { nombre, whatsapp: wa, talla };
    try {
      const r = await fetch(ruta, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cuerpo) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 503) { setEstado("demo"); return; }
      if (!r.ok) {
        setEstado("error");
        setMensaje(d.error === "tomada" ? "Alguien acaba de firmar esa línea. Elige otra." : "No pudimos registrar tu firma. Intenta de nuevo o escríbenos por WhatsApp.");
        if (d.error === "tomada" && num) setTomadas((t) => [...t, num]);
        return;
      }
      setEstado("ok");
      if (fase === "preventa" && d.pagoUrl) setTimeout(() => { window.location.href = d.pagoUrl; }, 1600);
    } catch {
      setEstado("error");
      setMensaje("Sin conexión. Intenta de nuevo.");
    }
  };

  const kicker = fase === "lista" ? `Lista de espera // abre ${DROP.abre}` : fase === "preventa" ? `Preventa // hasta ${DROP.cierra}` : "Sealed";
  const intro =
    fase === "lista"
      ? `El ${DROP.abre} se abren las ${DROP.piezas - DROP.foundersReservadas} líneas libres. Quien está en la lista elige número primero.`
      : fase === "preventa"
      ? `Elige una línea libre y firma con tu nombre: la pieza con ese número es tuya. Las líneas 001 a ${pad3(DROP.foundersReservadas)} son de los Founders originales.`
      : "Las 50 líneas ya están firmadas. THE OATH es la parte II del pacto.";

  const medida = DROP.medidas[talla];

  return (
    <section className="registro" id="registro">
      <div className="seccion">
        <div className="registro__cabeza">
          <span className="mono" style={{ color: "#5a5a5a" }}>{kicker}</span>
          <h2 className="disp">El registro del pacto</h2>
          <p>{intro}</p>
          {fase === "preventa" && <span className="mono" style={{ color: "#5a5a5a" }}>{libres} líneas libres de {DROP.piezas}</span>}
        </div>

        {fase === "sellado" ? (
          <p className="disp" style={{ textAlign: "center", fontSize: 44, margin: 0 }}>SEALED</p>
        ) : (
          <>
            {fase === "preventa" && (
              <div className="libro" role="group" aria-label="Líneas del registro">
                <div className="libro__founders">
                  <span className="linea__num">001 — {pad3(DROP.foundersReservadas)}</span>
                  <span className="linea__tag">Founders originales</span>
                </div>
                {lineas.filter((l) => !l.founder).map((l) => {
                  const elegida = num === l.n;
                  const tag = elegida ? (nombre.trim() || "Tu firma") : l.firmada ? "Firmado" : "Firmar";
                  const clase = elegida || l.firmada ? "linea__tag linea__tag--firma" : l.founder ? "linea__tag linea__tag--gris" : "linea__tag";
                  return (
                    <button
                      key={l.n}
                      type="button"
                      className="linea"
                      disabled={l.bloqueada}
                      aria-pressed={elegida}
                      aria-label={l.founder ? `Línea ${pad3(l.n)}, de un Founder original` : l.firmada ? `Línea ${pad3(l.n)}, ya firmada` : `Firmar en la línea ${pad3(l.n)}`}
                      onClick={() => { setNum(l.n); setEstado("idle"); }}
                    >
                      <span className="linea__num">{pad3(l.n)}</span>
                      <span className="linea__puntos" aria-hidden="true" />
                      <span className={clase}>{tag}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="compra">
              <div className="grupo">
                <span className="mono" style={{ fontSize: 11, color: "#5a5a5a" }}>Corte y talla</span>
                <div className="pildoras">
                  {CORTES.map((c) => (
                    <button key={c.id} type="button" className="pildora" aria-pressed={corte === c.id} onClick={() => setCorte(c.id)}>{c.label}</button>
                  ))}
                </div>
                <div className="pildoras">
                  {TALLAS.map((t) => (
                    <button key={t} type="button" className="pildora" aria-pressed={talla === t} onClick={() => setTalla(t)}>{t}</button>
                  ))}
                </div>
                <p className="aviso">
                  Talla {talla}: pecho {medida?.pecho ?? "[__]"} cm · largo {medida?.largo ?? "[__]"} cm. Mateo mide 1,78 m y usa {DROP.tallaMateo}. Cambio de talla garantizado en los 5 días después de recibir.
                </p>
              </div>

              <form className="grupo" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
                {fase === "preventa" && (
                  <span className="mono" style={{ fontSize: 11, color: "#5a5a5a" }}>
                    Pieza {num ? pad3(num) : "—"}/050 — {CORTES.find((c) => c.id === corte)?.label} — {talla}
                  </span>
                )}
                <label className="campo">
                  {fase === "preventa" ? "Firma con tu nombre" : "Tu nombre"}
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={60} />
                </label>
                {nombreOk && fase === "preventa" && <span key={nombre.length > 1 ? "f" : "x"} className="firma">{nombre}</span>}
                <label className="campo">
                  WhatsApp {fase === "preventa" ? "para el seguimiento" : "para avisarte"}
                  <input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" autoComplete="tel" maxLength={20} />
                </label>

                {estado === "ok" ? (
                  <p className="disp confirmado">
                    {fase === "preventa" ? `Pacto firmado. Te llevamos al pago seguro con ${DROP.pasarelaNombre}.` : `Estás en la lista. El ${DROP.abre} te escribimos primero.`}
                  </p>
                ) : estado === "demo" ? (
                  <p className="aviso">Modo demo: la base de datos todavía no está conectada. Cuando se configure Supabase, esta firma queda guardada.</p>
                ) : (
                  <>
                    <button type="submit" className="btn btn--tinta" disabled={!puedeFirmar || estado === "enviando"}>
                      {estado === "enviando" ? "[ Firmando… ]" : fase === "preventa" ? `[ Firmar y pagar ${precioTexto()} ]` : "[ Reservar mi lugar en la lista ]"}
                    </button>
                    <p className="aviso" role="status">
                      {estado === "error" ? mensaje : puedeFirmar ? (fase === "preventa" ? "Al firmar te llevamos al pago seguro." : "Te escribimos una sola vez, el día que abra.") : fase === "preventa" ? "Elige una línea, firma con tu nombre y deja tu WhatsApp." : "Deja tu nombre y tu WhatsApp."}
                    </p>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
