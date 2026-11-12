import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El portal anterior (HTML estático) sigue vivo en /portal mientras dura el drop.
  // Se redirige a /portal/index.html para que sus archivos (logo, música, íconos) carguen bien.
  async redirects() {
    return [{ source: "/portal", destination: "/portal/index.html", permanent: false }];
  },
};

export default nextConfig;
