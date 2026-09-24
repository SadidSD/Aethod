/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/works", permanent: true },
      { source: "/about-the-studio", destination: "/studio", permanent: true },
      { source: "/about", destination: "/studio", permanent: true },
      { source: "/research/clarity-gap", destination: "/research/tcg-marketplace-margin-decay", permanent: true },
      { source: "/research/multi-agent-ecosystem", destination: "/research/tcg-multi-agent-automation", permanent: true },
      { source: "/research/predictive-latency", destination: "/research/tcg-omnichannel-race-conditions", permanent: true },
      { source: "/research/designing-uncertainty", destination: "/research/tcg-grading-condition-variance", permanent: true },
      { source: "/works/sadid-ai", destination: "/works/rng-gamez", permanent: true },
      { source: "/works/coming-soon", destination: "/works", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
