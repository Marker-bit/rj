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
        hostname: process.env.UPLOADTHING_APP_ID + ".ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.labirint.ru",
        pathname: "/**",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
