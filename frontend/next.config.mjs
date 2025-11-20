/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Externalize packages that cause issues with bundling
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Polyfill/ignore node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore test files from being bundled
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules\/thread-stream\/test\//,
      loader: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
