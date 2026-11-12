import type { Metadata, Viewport } from "next";
// Fuentes dentro del proyecto (no dependen de Google Fonts al compilar).
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/archivo/wdth-italic.css";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "GENESIS — THE PACT I · Covenant Studios",
  description: "After the darkness, the sacred pact shall rise again. 50 piezas numeradas. Preventa del 30.11 al 06.12.",
  openGraph: {
    title: "GENESIS — THE PACT I",
    description: "After the darkness, the sacred pact shall rise again.",
    images: ["/genesis/genesis-back.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
