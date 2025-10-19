import type { NextConfig } from "next"
import withPWA from "next-pwa"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
}

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig)
