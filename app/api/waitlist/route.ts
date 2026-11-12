import { NextResponse } from "next/server";
import { TALLAS } from "@/lib/drop";
import { limpiarTexto, limpiarWhatsapp, sb, supabaseConfigurado } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!supabaseConfigurado) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const nombre = limpiarTexto(body.nombre, 60);
  const whatsapp = limpiarWhatsapp(body.whatsapp);
  const talla = TALLAS.includes(body.talla) ? body.talla : null;
  if (nombre.length < 2 || whatsapp.length < 7) return NextResponse.json({ error: "datos" }, { status: 400 });

  const r = await sb("lista_espera", {
    method: "POST",
    headers: { prefer: "return=minimal,resolution=ignore-duplicates" },
    body: JSON.stringify({ nombre, whatsapp, talla, drop: "genesis" }),
  });
  if (!r.ok && r.status !== 409) return NextResponse.json({ error: "guardar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
