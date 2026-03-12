const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: [
      'firebase-admin',
      'firebase-admin/app',
      'firebase-admin/auth',
      'firebase-admin/firestore',
      'firebase-admin/messaging',
      'google-auth-library',
    ],
  },
  webpack: (config) => {
    // Explicit alias fallback — guarantees @/ resolution even when Firebase
    // overrides next.config.js with its own adapter wrapper
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

const sentryBuildOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // SENTRY_AUTH_TOKEN is only available at RUNTIME on Firebase App Hosting.
  // Disable source map upload at build time to avoid crashing the build.
  disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(
  nextConfig,
  sentryBuildOptions,
  { hideSourceMaps: true, disableLogger: true }
);
