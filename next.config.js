const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["react-tweet"],
};

module.exports = withNextra({
  ...nextConfig,
});
