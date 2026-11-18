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
  const preventa = fase === "preventa";
  const puedeFirmar = preventa ? num != null && nombreOk && waOk : nombreOk && waOk;

  const lineas = useMemo(
    () =>
      Array.from({ length: DROP.piezas - DROP.foundersReservadas }, (_, i) => {
        const n = DROP.foundersReservadas + i + 1;
        return { n, firmada: tomadas.includes(n) };
      }),
    [tomadas]
  );

  const enviar = async () => {
    if (!puedeFirmar) return;
    setEstado("enviando");
    const ruta = preventa ? "/api/reserve" : "/api/waitlist";
    const cuerpo = preventa ? { numero: num, nombre, whatsapp: wa, talla, corte } : { nombre, whatsapp: wa, talla };
    try {
      const r = await fetch(ruta, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cuerpo) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 503) { setEstado("demo"); return; }
      if (!r.ok) {
        setEstado("error");
        if (d.error === "tomada" && num) {
          setTomadas((t) => [...t, num]);
          setNum(null);
          setMensaje("Alguien acaba de firmar esa línea. Elige otra.");
        } else setMensaje("No pudimos guardar tu firma. Intenta de nuevo o escríbenos por WhatsApp.");
        return;
      }
      setEstado("ok");
      if (preventa && d.pagoUrl) setTimeout(() => { window.location.href = d.pagoUrl; }, 1800);
    } catch {
      setEstado("error");
      setMensaje("Sin conexión. Revisa tu internet e intenta de nuevo.");
    }
  };

  const titulo = fase === "sellado" ? "Sealed" : preventa ? "El registro del pacto" : "La lista";
  const intro =
    fase === "lista"
      ? `El ${DROP.abre} se abren ${DROP.piezas - DROP.foundersReservadas} números. Quien está en la lista elige primero.`
      : preventa
      ? "Elige un número libre y firma con tu nombre. La pieza con ese número es tuya."
      : "Las 50 piezas ya tienen dueño. THE OATH es la parte II del pacto.";

  const medida = DROP.medidas[talla];

  return (
    <section className="registro" id="registro">
      <div className="bloque">
        <div className="registro__cabeza">
          <h2 className="display">{titulo}</h2>
          <p>{intro}</p>
          {preventa && <p className="meta num">{libres} de {DROP.piezas - DROP.foundersReservadas} números libres</p>}
        </div>

        {fase !== "sellado" && (
          <>
            {preventa && (
              <div className="libro" role="group" aria-label="Números del registro">
                <div className="libro__founders num">
                  <span>001 a {pad3(DROP.foundersReservadas)}</span>
                  <span>Founders originales</span>
                </div>
                {lineas.map((l) => {
                  const elegida = num === l.n;
                  return (
                    <button
                      key={l.n}
                      type="button"
                      className="linea"
                      disabled={l.firmada}
                      aria-pressed={elegida}
                      aria-label={l.firmada ? `Número ${pad3(l.n)}, ya firmado` : `Elegir el número ${pad3(l.n)}`}
                      onClick={() => { setNum(l.n); setEstado("idle"); }}
                    >
                      <span className="linea__num num">{pad3(l.n)}</span>
                      <span className="linea__puntos" aria-hidden="true" />
                      {elegida ? (
                        <span className="linea__tag linea__tag--firma">{nombre.trim() || "Tu firma"}</span>
                      ) : (
                        <span className={`linea__tag${l.firmada ? " linea__tag--firmado" : ""}`}>{l.firmada ? "Firmado" : "Libre"}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="compra" style={preventa ? undefined : { marginTop: 0 }}>
              <div className="grupo">
                <h3 className="grupo__titulo">Corte y talla</h3>
                <div className="pildoras">
                  {CORTES.map((c) => (
                    <button key={c.id} type="button" className="pildora" aria-pressed={corte === c.id} onClick={() => setCorte(c.id)}>
                      {c.id === "tee" ? "Oversized tee" : "Crop top"}
                    </button>
                  ))}
                </div>
                <div className="pildoras">
                  {TALLAS.map((t) => (
                    <button key={t} type="button" className="pildora" aria-pressed={talla === t} onClick={() => setTalla(t)}>{t}</button>
                  ))}
                </div>
                <p className="aviso num">
                  Talla {talla}: pecho {medida?.pecho ?? "[__]"} cm, largo {medida?.largo ?? "[__]"} cm. Mateo mide 1,78 m y usa {DROP.tallaMateo}.
                </p>
              </div>

              <form className="grupo" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
                <h3 className="grupo__titulo num">
                  {preventa ? (num ? `Número ${pad3(num)} de 050` : "Elige un número arriba") : "Tus datos"}
                </h3>
                <label className="campo">
                  {preventa ? "Firma con tu nombre" : "Nombre"}
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={60} />
                </label>
                {preventa && nombreOk && <span className="firma">{nombre}</span>}
                <label className="campo">
                  WhatsApp
                  <input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" autoComplete="tel" maxLength={20} />
                </label>

                {estado === "ok" ? (
                  <p className="confirmado">
                    {preventa ? `Pacto firmado. Te llevamos al pago con ${DROP.pasarelaNombre}.` : `Estás en la lista. El ${DROP.abre} te escribimos primero.`}
                  </p>
                ) : estado === "demo" ? (
                  <p className="aviso">Modo de prueba: la base de datos aún no está conectada, así que esta firma no se guardó.</p>
                ) : (
                  <>
                    <button type="submit" className="boton boton--tinta" disabled={!puedeFirmar || estado === "enviando"} style={{ marginTop: 8 }}>
                      {estado === "enviando" ? "Firmando…" : preventa ? `Firmar y pagar ${precioTexto()}` : "Entrar a la lista"}
                    </button>
                    <p className="aviso" role="status">
                      {estado === "error"
                        ? mensaje
                        : puedeFirmar
                        ? preventa ? "Después de firmar vas al pago seguro." : "Te escribimos una sola vez, el día que abra."
                        : preventa ? "Elige un número, firma y deja tu WhatsApp para el seguimiento." : "Deja tu nombre y tu WhatsApp."}
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
