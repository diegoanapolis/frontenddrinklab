/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Não bloquear build por regras de ESLint em produção (Railway)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

const withPWA = require("next-pwa")

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig)
