// Emblema de las 3 cruces en cromo, girando en 3D (el sello de THE PACT).
export default function Emblema({ size = 44 }: { size?: number }) {
  return (
    <div className="emblema" style={{ ["--s" as string]: `${size}px` }} aria-hidden="true">
      <div className="emblema__rig">
        <img src="/genesis/emblem.webp" alt="" width={size} height={size} />
        <img src="/genesis/emblem.webp" alt="" width={size} height={size} />
      </div>
    </div>
  );
}
