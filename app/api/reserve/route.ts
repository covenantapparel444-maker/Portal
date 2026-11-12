import { NextResponse } from "next/server";
import { DROP, TALLAS, pad3 } from "@/lib/drop";
import { limpiarTexto, limpiarWhatsapp, sb, supabaseConfigurado } from "@/lib/supabase";

const RETENCION_MIN = 30;

export async function POST(req: Request) {
  if (DROP.fase !== "preventa") return NextResponse.json({ error: "cerrada" }, { status: 409 });
  if (!supabaseConfigurado) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const numero = Number(body.numero);
  const nombre = limpiarTexto(body.nombre, 60);
  const whatsapp = limpiarWhatsapp(body.whatsapp);
  const talla = TALLAS.includes(body.talla) ? body.talla : null;
  const corte = body.corte === "crop" ? "crop" : "tee";

  if (!Number.isInteger(numero) || numero <= DROP.foundersReservadas || numero > DROP.piezas) return NextResponse.json({ error: "numero" }, { status: 400 });
  if (nombre.length < 2 || whatsapp.length < 7 || !talla) return NextResponse.json({ error: "datos" }, { status: 400 });

  // ¿La línea ya está firmada o apartada?
  const desde = new Date(Date.now() - RETENCION_MIN * 60_000).toISOString();
  const check = await sb(`reservas?select=id&numero=eq.${numero}&or=(estado.eq.pagada,and(estado.eq.pendiente,created_at.gt.${desde}))`);
  if (check.ok && (await check.json()).length > 0) return NextResponse.json({ error: "tomada" }, { status: 409 });

  const referencia = `CVNT-GEN-${pad3(numero)}`;
  const ins = await sb("reservas", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ numero, nombre, whatsapp, talla, corte, referencia, estado: "pendiente" }),
  });
  if (!ins.ok) {
    // El índice único de la base de datos evita que dos personas se queden con el mismo número.
    return NextResponse.json({ error: ins.status === 409 ? "tomada" : "guardar" }, { status: ins.status === 409 ? 409 : 500 });
  }

  return NextResponse.json({ ok: true, referencia, pagoUrl: DROP.pasarelaUrl || null });
}
