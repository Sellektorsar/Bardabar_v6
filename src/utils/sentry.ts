/**
 * Sentry error monitoring integration
 *
 * To use:
 * 1. Install: npm install @sentry/react
 * 2. Set VITE_SENTRY_DSN in .env
 * 3. Call initSentry() in main.tsx
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";
const IS_PRODUCTION = import.meta.env.PROD;

// Sentry instance (lazy loaded)
let Sentry: typeof import("@sentry/react") | null = null;

/**
 * Initialize Sentry error monitoring
 */
export async function initSentry(): Promise<void> {
  if (!SENTRY_DSN || !IS_PRODUCTION) {
    console.log("Sentry disabled (no DSN or not production)");
    return;
  }

  try {
    Sentry = await import("@sentry/react");

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      // Session replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      // Filter out common non-actionable errors
      beforeSend(event: { exception?: { values?: Array<{ value?: string }> } }) {
        // Ignore ResizeObserver errors
        if (event.exception?.values?.[0]?.value?.includes("ResizeObserver")) {
          return null;
        }
        return event;
      },
    });

    console.log("Sentry initialized");
  } catch (error) {
    console.warn("Failed to initialize Sentry:", error);
  }
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (Sentry) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("Error:", error, context);
  }
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
  if (Sentry) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level}]`, message);
  }
}

/**
 * Set user context
 */
export function setUser(user: { id?: string; email?: string; username?: string } | null): void {
  if (Sentry) {
    Sentry.setUser(user);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
): void {
  if (Sentry) {
    Sentry.addBreadcrumb({
      category,
      message,
      data,
      level: "info",
    });
  }
}

/**
 * Error boundary wrapper component
 * Usage: <ErrorBoundary fallback={<ErrorFallback />}><App /></ErrorBoundary>
 */
export function getErrorBoundary() {
  if (Sentry) {
    return Sentry.ErrorBoundary;
  }
  // Fallback for when Sentry is not loaded
  return null;
}
