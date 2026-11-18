import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pie from "@/components/Pie";

// BORRADORES. Antes de abrir la venta, un abogado debe revisarlos y deben llenarse
// los datos entre corchetes (razón social, NIT, dirección y correo).
const EMPRESA = "[RAZÓN SOCIAL O NOMBRE DEL TITULAR]";
const NIT = "[NIT o C.C.]";
const CORREO = "[CORREO DE CONTACTO]";
const DIRECCION = "[DIRECCIÓN], Cajicá, Cundinamarca, Colombia";
const ACTUALIZADO = "17 de noviembre de 2026";

type Pagina = { titulo: string; secciones: { h: string; p?: string[]; li?: string[] }[] };

const PAGINAS: Record<string, Pagina> = {
  privacidad: {
    titulo: "Tratamiento de datos personales",
    secciones: [
      { h: "Quién es responsable", p: [`${EMPRESA}, identificado con ${NIT}, con domicilio en ${DIRECCION}, es el responsable del tratamiento de los datos personales que recibimos por esta web, en cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios.`] },
      { h: "Qué datos recogemos", li: ["Nombre y número de WhatsApp cuando entras a la lista de espera o firmas el registro.", "Talla y corte elegidos, número de pieza y estado de tu pedido.", "Dirección de envío, cuando la necesitamos para entregarte la pieza.", "No guardamos datos de tarjetas ni de cuentas bancarias: los pagos se hacen en la pasarela de pago."] },
      { h: "Para qué los usamos", li: ["Gestionar tu reserva, tu pago y el envío.", "Escribirte por WhatsApp sobre el estado de tu pedido.", "Avisarte cuando abra una preventa, si entraste a la lista de espera.", "Activar tu código de Founder."] },
      { h: "Tus derechos", p: ["Puedes conocer, actualizar, rectificar y pedir que eliminemos tus datos, revocar la autorización que nos diste y presentar quejas ante la Superintendencia de Industria y Comercio.", `Para ejercerlos, escríbenos a ${CORREO}. Respondemos consultas en un máximo de 10 días hábiles y reclamos en un máximo de 15 días hábiles.`] },
      { h: "Con quién los compartimos", p: ["Solo con quienes nos ayudan a prestar el servicio: la pasarela de pago, la empresa de envíos y el proveedor que aloja nuestra base de datos. No vendemos tus datos."] },
      { h: "Autorización", p: ["Al entrar a la lista de espera o firmar el registro, autorizas el tratamiento de tus datos para las finalidades descritas aquí."] },
    ],
  },
  terminos: {
    titulo: "Términos y condiciones",
    secciones: [
      { h: "Quién vende", p: [`${EMPRESA}, ${NIT}, ${DIRECCION}. Contacto: ${CORREO}.`] },
      { h: "Cómo funciona la preventa", li: ["GENESIS se vende en preventa: primero se paga y después se produce.", "Cada pieza está numerada del 001 al 050. Al firmar, el número queda apartado 30 minutos mientras se completa el pago.", "Si al cerrar la preventa no se llega al mínimo de piezas para producir, te devolvemos el 100% de lo pagado.", "Te informamos la fecha estimada de entrega antes de pagar. Si cambia, te avisamos con anticipación."] },
      { h: "Precios y pagos", p: ["Los precios están en pesos colombianos e incluyen los impuestos que apliquen. El envío se cobra aparte y se informa antes de pagar. Los pagos se hacen solo a través de la pasarela de pago indicada en la web."] },
      { h: "Propiedad intelectual", p: ["Los diseños, el nombre COVENANT STUDIOS, el emblema y los contenidos de esta web pertenecen a Covenant Studios. No pueden copiarse ni usarse con fines comerciales sin autorización."] },
      { h: "Ley aplicable", p: ["Estos términos se rigen por las leyes de Colombia, incluido el Estatuto del Consumidor (Ley 1480 de 2011)."] },
    ],
  },
  cambios: {
    titulo: "Cambios, devoluciones y garantía",
    secciones: [
      { h: "Cambio de talla", p: [`Si tu pieza no te queda, escríbenos dentro de los 5 días siguientes a recibirla a ${CORREO} o por WhatsApp. La pieza debe estar sin uso, sin lavar y con sus etiquetas. El cambio depende de las tallas disponibles.`] },
      { h: "Derecho de retracto", p: ["Como compraste a distancia, puedes retractarte de la compra dentro de los 5 días hábiles siguientes a la entrega, según el artículo 47 de la Ley 1480 de 2011. Debes devolver la pieza en las mismas condiciones en que la recibiste; los costos de transporte de la devolución corren por tu cuenta. Te devolvemos el dinero dentro de los 30 días calendario siguientes."] },
      { h: "Reversión del pago", p: ["Si pagaste con un medio electrónico y fuiste víctima de fraude, la operación no fue solicitada, no recibiste el producto o el producto no corresponde a lo pedido o tiene defectos, puedes pedir la reversión del pago dentro de los 5 días hábiles siguientes a que conociste el hecho, según el artículo 51 de la Ley 1480 de 2011."] },
      { h: "Garantía", p: ["Todas las piezas tienen la garantía legal por defectos de calidad o fabricación. Si tu pieza llega con un defecto, escríbenos con fotos y la reparamos, la cambiamos o te devolvemos el dinero."] },
      { h: "Cómo pedirlo", p: [`Escríbenos a ${CORREO} o por WhatsApp con tu nombre, tu número de pieza y lo que necesitas.`] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGINAS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pg = PAGINAS[slug];
  return { title: pg ? `${pg.titulo} · Covenant Studios` : "Covenant Studios" };
}

export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pg = PAGINAS[slug];
  if (!pg) notFound();
  return (
    <main>
      <article className="legal">
        <div className="legal__top">
          <a href="/#genesis" className="marca" style={{ textDecoration: "none" }}>COVENANT STUDIOS</a>
          <a href="/#genesis" className="meta">Volver a GENESIS</a>
        </div>
        <h1 className="display">{pg.titulo}</h1>
        <p className="meta">Actualizado el {ACTUALIZADO}.</p>
        {pg.secciones.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p?.map((t) => <p key={t}>{t}</p>)}
            {s.li && <ul>{s.li.map((t) => <li key={t}>{t}</li>)}</ul>}
          </section>
        ))}
      </article>
      <Pie />
    </main>
  );
}
