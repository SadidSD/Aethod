/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/work", destination: "/works" },
      { source: "/about-the-studio", destination: "/studio" },
      { source: "/about", destination: "/studio" },
    ];
  },
};

export default nextConfig;
