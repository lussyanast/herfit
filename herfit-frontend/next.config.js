/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'herfit-ladiesgym.my.id',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'herfit-ladiesgym.my.id',
        pathname: '/profil/**',
      },
    ],
  },
};

module.exports = nextConfig;