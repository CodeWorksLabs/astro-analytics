export const RUNTIME_SENTINEL = "astro-analytics:runtime:v1";

export function createBootstrapScript(): string {
  return `if (!globalThis.__astroAnalyticsRuntime) {
  globalThis.__astroAnalyticsRuntime = ${JSON.stringify(RUNTIME_SENTINEL)};
  globalThis.astroAnalytics = Object.freeze({
    track() { return { ok: false, reason: "adapter-not-loaded" }; }
  });
}`;
}
