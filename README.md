# Covenant Studios — Portal

Web de Covenant en Next.js. Durante el drop, la página de inicio es la experiencia de **GENESIS — THE PACT I**:

1. **La llamada** (THE SIGNAL): "Unknown Caller — ¿Estás listo?"
2. **El cuarto** (THE CALL): la mesa del pacto, con luz de vela que sigue el cursor o el dedo.
3. **La pieza**: GENESIS, la camiseta en 3D, las pruebas y el registro de 50 líneas para firmar y pagar.

El portal anterior sigue funcionando en `/portal`.

Enlaces directos: `/#genesis` abre la pieza sin pasar por la llamada (úsalo en anuncios y en la bio).

## Correr en local

```bash
npm install
npm run dev
```

## Configurar el drop

Todo lo que cambia está en `lib/drop.ts`: precio, fechas, medidas, talla de Mateo y gramaje.

Variables de entorno (en Vercel › Settings › Environment Variables):

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_DROP_FASE` | `lista`, `preventa` o `sellado`. Cambia toda la página. |
| `NEXT_PUBLIC_WHATSAPP` | Número con indicativo, solo dígitos (ej. `573001234567`). |
| `NEXT_PUBLIC_PASARELA_URL` | Link de pago de Wompi, Bold o Mercado Pago. |
| `NEXT_PUBLIC_PASARELA_NOMBRE` | Nombre de la pasarela que se muestra (ej. `Wompi`). |
| `SUPABASE_URL` | URL del proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role. Solo servidor: nunca la pongas con `NEXT_PUBLIC_`. |

Después de cambiar una variable `NEXT_PUBLIC_…`, vuelve a desplegar para que se aplique.

## Base de datos

1. Crea un proyecto en Supabase.
2. Abre SQL Editor, pega `supabase/schema.sql` y ejecútalo.
3. Copia la URL y la clave service_role a las variables de entorno de Vercel.

Sin Supabase la página funciona en **modo demo**: muestra todo, pero no guarda firmas ni la lista de espera.

### Cómo funciona una reserva

- Al firmar, se crea una reserva `pendiente` con la referencia `CVNT-GEN-0XX` y la persona va al link de pago.
- La línea queda apartada 30 minutos.
- Cuando confirmes el pago en la pasarela, cambia la reserva a `pagada` en Supabase (Table Editor › reservas). Las líneas pagadas aparecen como "Firmado".
- Pide a cada cliente que ponga su referencia en el pago para cruzarlo fácil.

## Imágenes

En `public/genesis/`:

- `genesis-front-cut.webp`, `genesis-back-cut.webp`: camiseta sin fondo (visor 3D y el cuarto).
- `emblem.webp`: emblema cromado (49 KB; el `logo.svg` original pesa 5 MB).

Cuando lleguen las fotos reales, reemplaza los archivos con el mismo nombre.
