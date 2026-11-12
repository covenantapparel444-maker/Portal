// Acceso a Supabase desde el servidor (rutas /api) por su API REST.
// Variables de entorno necesarias en Vercel:
//   SUPABASE_URL                 https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    clave service_role (solo servidor, nunca en el navegador)

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigurado = Boolean(URL && KEY);

export async function sb(path: string, init: RequestInit = {}) {
  if (!URL || !KEY) throw new Error("not_configured");
  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

export function limpiarTexto(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function limpiarWhatsapp(v: unknown): string {
  return typeof v === "string" ? v.replace(/\D/g, "").slice(0, 15) : "";
}
