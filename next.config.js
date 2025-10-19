/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
}

const withPWA = require("next-pwa")

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig)
