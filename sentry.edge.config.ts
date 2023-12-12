// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN =
  process.env.SENTRY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://cc54d8324d8907bbd101822e17b6f4a9@o4506377733865472.ingest.sentry.io/4506383371927552",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
