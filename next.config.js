/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com', 'lh3.googleusercontent.com', 'assets.pokemon.com'],
  },
}

module.exports = nextConfig
