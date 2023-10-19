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
        destination:
          process.env.NODE_ENV === "production"
            ? "https://chatdb-api.onrender.com/:path*"
            : "http://localhost:8000/:path*",
      },
    ];
  },
};

module.exports = withNextra({
  ...nextConfig,
});
