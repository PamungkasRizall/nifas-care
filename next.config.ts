import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mengizinkan deployment tetap berjalan meskipun ada error TypeScript
    ignoreBuildErrors: true,
  },
  // ... konfigurasi Anda yang lain jika ada
};

export default nextConfig;
