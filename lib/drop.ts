// ============================================================
// CONFIGURACIÓN DEL DROP — todo lo que cambia está aquí.
// Para cambiar la fase sin tocar código, usa la variable de
// entorno NEXT_PUBLIC_DROP_FASE en Vercel: lista | preventa | sellado
// ============================================================

export type Fase = "lista" | "preventa" | "sellado";

const faseEnv = process.env.NEXT_PUBLIC_DROP_FASE as Fase | undefined;

export const DROP = {
  nombre: "GENESIS",
  parte: "THE PACT I",
  fase: (faseEnv && ["lista", "preventa", "sellado"].includes(faseEnv) ? faseEnv : "lista") as Fase,

  // Precio en pesos colombianos. Déjalo en null hasta tener la cotización.
  precio: null as number | null,

  piezas: 50,
  foundersReservadas: 15, // líneas 001 a 015
  minimoParaProducir: 15,

  abre: "30.11",
  cierra: "06.12",
  entrega: "20 de diciembre",
  anio: "2026",

  // Número de WhatsApp con indicativo, solo dígitos. Ej: 573001234567
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  // Link de pago de la pasarela (Wompi, Bold, Mercado Pago…)
  pasarelaUrl: process.env.NEXT_PUBLIC_PASARELA_URL ?? "",
  pasarelaNombre: process.env.NEXT_PUBLIC_PASARELA_NOMBRE ?? "[PASARELA]",

  // Medidas en cm. Llénalas con la muestra aprobada.
  medidas: {
    S: { pecho: null, largo: null },
    M: { pecho: null, largo: null },
    L: { pecho: null, largo: null },
    XL: { pecho: null, largo: null },
  } as Record<string, { pecho: number | null; largo: number | null }>,
  tallaMateo: "[TALLA]",

  // Foto real de la mesa del cuarto (desde arriba, con velas). Ej: "/genesis/mesa.webp"
  fotoMesa: null as string | null,

  // Videos de las pruebas. La sección solo aparece cuando al menos uno tiene video.
  pruebas: [
    { titulo: "La gramera", texto: "El peso real, sin edición.", video: null as string | null },
    { titulo: "Diez lavadas", texto: "Misma talla, mismo negro.", video: null as string | null },
    { titulo: "El cuello", texto: "Se estira y vuelve a su forma.", video: null as string | null },
  ],
  gramaje: "[GRAMAJE]",
};

export const TALLAS = ["S", "M", "L", "XL"] as const;
export const CORTES = [
  { id: "tee", label: "OVERSIZED TEE" },
  { id: "crop", label: "CROP TOP" },
] as const;

export function precioTexto(): string {
  if (DROP.precio == null) return "$[PRECIO]";
  return "$" + new Intl.NumberFormat("es-CO").format(DROP.precio);
}

export function pad3(n: number): string {
  return String(n).padStart(3, "0");
}
