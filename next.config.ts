import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El portal anterior (HTML estático) sigue vivo en /portal mientras dura el drop.
  async rewrites() {
    return [{ source: "/portal", destination: "/portal/index.html" }];
  },
};

export default nextConfig;
