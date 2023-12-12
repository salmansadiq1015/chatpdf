// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const DNS = process.env.DNS || process.env.NEXT_PUBLIC_DNS;

Sentry.init({
  dsn:
    DNS ||
    "https://016e49e3f21308045247ef0d49741419@o4506377733865472.ingest.sentry.io/4506384063070208",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
