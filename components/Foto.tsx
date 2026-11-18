// Una foto de la pieza. Si todavía no existe, muestra el espacio que ocupará
// con una descripción de lo que va ahí, para ver cómo queda la página.
export default function Foto({
  src,
  alt,
  etiqueta,
  ratio = "4 / 5",
  tono = "oscuro",
  video = false,
}: {
  src: string | null;
  alt: string;
  etiqueta?: string;
  ratio?: string;
  tono?: "oscuro" | "claro";
  video?: boolean;
}) {
  return (
    <figure className={`foto foto--${tono}`}>
      <div className="foto__marco" style={{ aspectRatio: ratio }}>
        {src ? (
          video ? (
            <video src={src} muted loop playsInline autoPlay aria-label={alt} />
          ) : (
            <img src={src} alt={alt} loading="lazy" />
          )
        ) : (
          <div className="foto__vacia" role="img" aria-label={`Espacio para: ${alt}`}>
            <span>{video ? "Video" : "Foto"}: {alt}</span>
          </div>
        )}
      </div>
      {etiqueta && <figcaption>{etiqueta}</figcaption>}
    </figure>
  );
}
