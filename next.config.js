const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "books.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
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
  redirects() {
    return [
      {
        source: "/collections",
        destination: "/books",
        permanent: false,
      },
      {
        source: "/collections/:path*",
        destination: "/books",
        permanent: false,
      },
    ];
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
