const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["react-tweet"],
  async rewrites() {
    return [
      {
        source: "/fastify/:path*",
        destination: " https://chatdb-api.onrender.com/:path*",
      },
    ];
  },
};

module.exports = withNextra({
  ...nextConfig,
});
