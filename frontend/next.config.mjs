/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
  },
  webpack: (config, { isServer }) => {
    // Externalize packages that cause issues with bundling
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'bufferutil', 'utf-8-validate');

    // Polyfill/ignore node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Fix for MetaMask SDK trying to import React Native packages in browser
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;
