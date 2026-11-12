import { NextResponse } from "next/server";
import { sb, supabaseConfigurado } from "@/lib/supabase";

// Una reserva pendiente aparta la línea durante 30 minutos mientras la persona paga.
const RETENCION_MIN = 30;

export async function GET() {
  if (!supabaseConfigurado) return NextResponse.json({ tomadas: [], demo: true });
  const desde = new Date(Date.now() - RETENCION_MIN * 60_000).toISOString();
  const filtro = `or=(estado.eq.pagada,and(estado.eq.pendiente,created_at.gt.${desde}))`;
  const r = await sb(`reservas?select=numero&${filtro}`);
  if (!r.ok) return NextResponse.json({ tomadas: [] }, { status: 200 });
  const filas: { numero: number }[] = await r.json();
  return NextResponse.json({ tomadas: [...new Set(filas.map((f) => f.numero))] });
}
