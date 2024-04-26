/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    timeout: 7200000,
    serverTimeout: 7200000,
  },
};

export default nextConfig;
