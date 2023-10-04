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
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

module.exports = withNextra({
  ...nextConfig,
});
