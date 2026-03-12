const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' — app uses server-side API routes (AI agents) and middleware
  // Deploy via Firebase Cloud Run or Vercel for SSR support
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript errors are now zero — keeping strict check on
  experimental: {
    // Required for Vercel AI SDK streaming
    serverComponentsExternalPackages: [],
  },
};

module.exports = withSentryConfig(
  nextConfig,
  { silent: true, org: process.env.SENTRY_ORG, project: process.env.SENTRY_PROJECT },
  { hideSourceMaps: true, disableLogger: true }
);
