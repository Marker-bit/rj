/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add a rule for node-loader to handle the binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Your existing webpack configuration
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  images: {
    domains: ['vercel-storage.com', 'utfs.io'],
  },
};

export default nextConfig;
