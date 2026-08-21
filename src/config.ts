export type AnalyticsCommand = "dev" | "build" | "preview" | "sync";
export type PageviewMode = "provider" | "astro" | "none";

export interface AnalyticsEnvironments {
  production?: boolean;
  preview?: boolean;
  development?: boolean;
}

export interface EventOptions {
  globalName?: "astroAnalytics";
  queue?: false | { maxSize: number };
}

export interface GoogleConsentConfig {
  mode: "immediate" | "deferred" | "external";
  initial?: {
    analyticsStorage: "granted" | "denied";
    adStorage?: "granted" | "denied";
    adUserData?: "granted" | "denied";
    adPersonalization?: "granted" | "denied";
  };
}

export interface GoogleAnalyticsProvider {
  name: "google-analytics";
  measurementId: string;
  scriptSrc?: string;
  pageviews?: PageviewMode;
  consent: GoogleConsentConfig;
  config?: Record<string, string | number | boolean>;
}

export interface PlausibleProvider {
  name: "plausible";
  scriptSrc: string;
  pageviews?: PageviewMode;
  consent?: { mode: "immediate" | "deferred" | "external" };
  endpoint?: string;
  captureOnLocalhost?: boolean;
}

export interface FathomProvider {
  name: "fathom";
  siteId: string;
  scriptSrc?: string;
  pageviews?: PageviewMode;
  consent?: { mode: "immediate" | "deferred" | "external" };
  honorDnt?: boolean;
  canonical?: boolean;
}

export type AnalyticsProvider =
  | GoogleAnalyticsProvider
  | PlausibleProvider
  | FathomProvider;

export interface AstroAnalyticsConfig {
  enabled?: boolean;
  environments?: AnalyticsEnvironments;
  provider: false | AnalyticsProvider;
  events?: boolean | EventOptions;
  debug?: boolean;
}

export interface NormalizedAstroAnalyticsConfig {
  enabled: boolean;
  environments: Required<AnalyticsEnvironments>;
  provider: false | (AnalyticsProvider & { pageviews: PageviewMode });
  events: false | Required<EventOptions>;
  debug: boolean;
}

const SAFE_PROTOCOLS = new Set(["https:"]);
const DEFAULT_FATHOM_SCRIPT = "https://cdn.usefathom.com/script.js";

function requireNonEmpty(value: string, path: string): string {
  const normalized = value.trim();
  if (!normalized) throw new TypeError(`${path} must not be empty.`);
  return normalized;
}

function validateHttpsUrl(value: string, path: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError(`${path} must be an absolute HTTPS URL.`);
  }
  if (!SAFE_PROTOCOLS.has(url.protocol) || url.username || url.password) {
    throw new TypeError(`${path} must be an absolute HTTPS URL without credentials.`);
  }
  return url.href;
}

function normalizeProvider(provider: AnalyticsProvider): AnalyticsProvider & {
  pageviews: PageviewMode;
} {
  switch (provider.name) {
    case "google-analytics": {
      const measurementId = requireNonEmpty(
        provider.measurementId,
        "provider.measurementId",
      );
      if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
        throw new TypeError("provider.measurementId must be a GA4 G- identifier.");
      }
      if (!provider.consent?.mode) {
        throw new TypeError("Google Analytics (GA4) requires an explicit consent.mode.");
      }
      return {
        ...provider,
        measurementId,
        scriptSrc: validateHttpsUrl(
          provider.scriptSrc ??
            `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
          "provider.scriptSrc",
        ),
        pageviews: provider.pageviews ?? "provider",
      };
    }
    case "plausible":
      return {
        ...provider,
        scriptSrc: validateHttpsUrl(provider.scriptSrc, "provider.scriptSrc"),
        endpoint: provider.endpoint
          ? validateHttpsUrl(provider.endpoint, "provider.endpoint")
          : undefined,
        pageviews: provider.pageviews ?? "provider",
      };
    case "fathom":
      return {
        ...provider,
        siteId: requireNonEmpty(provider.siteId, "provider.siteId"),
        scriptSrc: validateHttpsUrl(
          provider.scriptSrc ?? DEFAULT_FATHOM_SCRIPT,
          "provider.scriptSrc",
        ),
        pageviews: provider.pageviews ?? "provider",
      };
  }
}

export function normalizeConfig(
  config: AstroAnalyticsConfig,
): NormalizedAstroAnalyticsConfig {
  if (!config || typeof config !== "object") {
    throw new TypeError("astroAnalytics() requires a configuration object.");
  }

  const events =
    config.events === true
      ? { globalName: "astroAnalytics" as const, queue: false as const }
      : config.events
        ? {
            globalName: config.events.globalName ?? ("astroAnalytics" as const),
            queue: config.events.queue ?? (false as const),
          }
        : false;

  if (events && events.queue && (!Number.isInteger(events.queue.maxSize) || events.queue.maxSize < 1 || events.queue.maxSize > 100)) {
    throw new TypeError("events.queue.maxSize must be an integer from 1 to 100.");
  }

  return {
    enabled: config.enabled ?? true,
    environments: {
      production: config.environments?.production ?? true,
      preview: config.environments?.preview ?? false,
      development: config.environments?.development ?? false,
    },
    provider: config.provider === false ? false : normalizeProvider(config.provider),
    events,
    debug: config.debug ?? false,
  };
}

export function isEnabledForCommand(
  config: NormalizedAstroAnalyticsConfig,
  command: AnalyticsCommand,
): boolean {
  if (!config.enabled || config.provider === false || command === "sync") return false;
  if (command === "build") return config.environments.production;
  if (command === "preview") return config.environments.preview;
  return config.environments.development;
}
