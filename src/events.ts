export interface TrackResult {
  ok: boolean;
  reason?: "disabled" | "adapter-not-loaded" | "consent-pending" | "invalid-event";
}

export interface AstroAnalyticsClient {
  track(
    name: string,
    properties?: Record<string, string | number | boolean>,
  ): TrackResult;
}

declare global {
  interface Window {
    astroAnalytics?: AstroAnalyticsClient;
  }
}

export function track(
  name: string,
  properties?: Record<string, string | number | boolean>,
): TrackResult {
  if (typeof window === "undefined" || !window.astroAnalytics) {
    return { ok: false, reason: "disabled" };
  }
  try {
    return window.astroAnalytics.track(name, properties);
  } catch {
    return { ok: false, reason: "adapter-not-loaded" };
  }
}
