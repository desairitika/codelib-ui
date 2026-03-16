import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking and monitoring
 * Call this early in your application startup, before any other code executes
 */
export const initializeSentry = () => {
  const environment = import.meta.env.MODE || "development";
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn("Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      // Capture unhandled promise rejections
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Capture 100% of transactions for performance monitoring (adjust in production)
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,
    // Capture 100% of session replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || "0.0.1",
  });

  console.log(`Sentry initialized (env: ${environment})`);
};

/**
 * Capture user context for better error tracking
 */
export const sentrySetUserContext = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id || user._id,
    email: user.email,
    username: user.username,
  });
};

/**
 * Capture custom breadcrumb for debugging
 */
export const sentryAddBreadcrumb = (message, category = "info", level = "info", data = {}) => {
  Sentry.captureMessage(message, level);
  
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

export default Sentry;
