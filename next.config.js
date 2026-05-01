const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // experimental: {
  //   turbo: {
  //     resolveExtensions: [
  //       ".mdx",
  //       ".tsx",
  //       ".ts",
  //       ".jsx",
  //       ".js",
  //       ".mjs",
  //       ".json",
  //     ],
  //   },
  //   mdxRs: true,
  //   serverComponentsExternalPackages: ["@node-rs/argon2-win32-x64-msvc"],
  // },
};
module.exports = withMDX(nextConfig);
