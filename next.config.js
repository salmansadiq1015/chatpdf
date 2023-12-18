/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
    ];
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },

  images: {
    domains: [
      "lh3.googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
    ],
  },
};

module.exports = nextConfig;

// "googleusercontent.com",
// "oaidalleapiprodscus.blob.core.windows.net",
// "cdn.openai.com",

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // Suppresses source map uploading logs during build
    silent: true,
    org: "infra-dev",
    project: "chatdoc",
  },
  {
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    disableLogger: true,

    automaticVercelMonitors: true,
  }
);
