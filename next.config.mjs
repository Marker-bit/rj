/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  images: {
    domains: ["vercel-storage.com", "utfs.io", "img3.labirint.ru"],
  },
};

export default nextConfig;
