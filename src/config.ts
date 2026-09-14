export type AnalyticsCommand = "dev" | "build" | "preview" | "sync";
export type PageviewMode = "provider" | "astro" | "none";
export type ConsentMode = "immediate" | "deferred" | "external";
export type ConsentState = "granted" | "denied";

export interface AnalyticsEnvironments {
  production?: boolean;
  preview?: boolean;
  development?: boolean;
}

/** @deprecated Event queueing and alternate globals are not part of the current client. */
export interface EventOptions {
  globalName?: "astroAnalytics";
  queue?: false | { maxSize: number };
}

export interface GoogleConsentConfig {
  mode: ConsentMode;
  initial?: {
    analyticsStorage: ConsentState;
    adStorage?: ConsentState;
    adUserData?: ConsentState;
    adPersonalization?: ConsentState;
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
  consent?: { mode: ConsentMode };
  endpoint?: string;
  captureOnLocalhost?: boolean;
}

export interface FathomProvider {
  name: "fathom";
  siteId: string;
  scriptSrc?: string;
  pageviews?: PageviewMode;
  consent?: { mode: ConsentMode };
  honorDnt?: boolean;
  canonical?: boolean;
}

export interface MatomoProvider {
  name: "matomo";
  trackerUrl: string;
  siteId: string;
  eventCategory: string;
  scriptSrc?: string;
  pageviews?: PageviewMode;
  consent?: { mode: ConsentMode };
}

export interface UmamiProvider {
  name: "umami";
  websiteId: string;
  scriptSrc: string;
  hostUrl?: string;
  pageviews?: PageviewMode;
  consent?: { mode: ConsentMode };
}

export type AnalyticsProvider =
  | GoogleAnalyticsProvider
  | PlausibleProvider
  | FathomProvider
  | MatomoProvider
  | UmamiProvider;

export type NormalizedAnalyticsProvider = AnalyticsProvider & {
  pageviews: PageviewMode;
};

export interface AstroAnalyticsConfig {
  enabled?: boolean;
  environments?: AnalyticsEnvironments;
  /** @deprecated Use providers for multi-provider operation. */
  provider?: false | AnalyticsProvider;
  providers?: false | readonly AnalyticsProvider[];
  events?: boolean | EventOptions;
  /** Suppress the entire browser runtime when any named query parameter is present. */
  blockedQueryParameters?: readonly string[];
  debug?: boolean;
}

export interface NormalizedAstroAnalyticsConfig {
  enabled: boolean;
  environments: Required<AnalyticsEnvironments>;
  /** Normalized legacy input; absent when providers was supplied. */
  provider?: false | NormalizedAnalyticsProvider | undefined;
  providers: false | readonly NormalizedAnalyticsProvider[];
  events: boolean;
  blockedQueryParameters: readonly string[];
  debug: boolean;
}

type UnknownRecord = Record<string, unknown>;

const DEFAULT_FATHOM_SCRIPT = "https://cdn.usefathom.com/script.js";
const PAGEVIEW_MODES = new Set<PageviewMode>(["provider", "astro", "none"]);
const CONSENT_MODES = new Set<ConsentMode>([
  "immediate",
  "deferred",
  "external",
]);
const CONSENT_STATES = new Set<ConsentState>(["granted", "denied"]);

function hasOwn(value: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function expectObject(value: unknown, path: string): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object.`);
  }
  const prototype = Reflect.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype) {
    throw new TypeError(`${path} must be a plain or null-prototype record.`);
  }
  return value as UnknownRecord;
}

function assertExactKeys(
  value: UnknownRecord,
  allowed: readonly string[],
  path: string,
): void {
  const allowedKeys = new Set(allowed);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") {
      throw new TypeError(`${path} contains an unsupported symbol key.`);
    }
    if (!allowedKeys.has(key)) {
      throw new TypeError(`${path}.${key} is not supported.`);
    }
  }
}

function expectBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(`${path} must be a boolean.`);
  }
  return value;
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`${path} must be a string.`);
  }
  return value;
}

function requireNonEmpty(value: unknown, path: string): string {
  const normalized = expectString(value, path).trim();
  if (!normalized) throw new TypeError(`${path} must not be empty.`);
  return normalized;
}

function validateHttpsUrl(value: unknown, path: string): string {
  const text = expectString(value, path);
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    throw new TypeError(`${path} must be an absolute HTTPS URL.`);
  }
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new TypeError(
      `${path} must be an absolute HTTPS URL without credentials.`,
    );
  }
  return url.href;
}

function normalizePageviews(value: unknown, path: string): PageviewMode {
  if (typeof value !== "string" || !PAGEVIEW_MODES.has(value as PageviewMode)) {
    throw new TypeError(`${path} must be provider, astro, or none.`);
  }
  return value as PageviewMode;
}

function normalizeConsentMode(value: unknown, path: string): ConsentMode {
  if (typeof value !== "string" || !CONSENT_MODES.has(value as ConsentMode)) {
    throw new TypeError(`${path} must be immediate, deferred, or external.`);
  }
  return value as ConsentMode;
}

function normalizeConsentState(value: unknown, path: string): ConsentState {
  if (typeof value !== "string" || !CONSENT_STATES.has(value as ConsentState)) {
    throw new TypeError(`${path} must be granted or denied.`);
  }
  return value as ConsentState;
}

function normalizeSimpleConsent(value: unknown, path: string): { mode: ConsentMode } {
  const consent = expectObject(value, path);
  assertExactKeys(consent, ["mode"], path);
  if (!hasOwn(consent, "mode")) {
    throw new TypeError(`${path}.mode is required.`);
  }
  return { mode: normalizeConsentMode(consent.mode, `${path}.mode`) };
}

function normalizeGoogleConsent(value: unknown): GoogleConsentConfig {
  const path = "provider.consent";
  const consent = expectObject(value, path);
  assertExactKeys(consent, ["mode", "initial"], path);
  if (!hasOwn(consent, "mode")) {
    throw new TypeError("Google Analytics (GA4) requires an explicit consent.mode.");
  }

  const normalized: GoogleConsentConfig = {
    mode: normalizeConsentMode(consent.mode, `${path}.mode`),
  };
  if (hasOwn(consent, "initial")) {
    const initialPath = `${path}.initial`;
    const initial = expectObject(consent.initial, initialPath);
    assertExactKeys(
      initial,
      ["analyticsStorage", "adStorage", "adUserData", "adPersonalization"],
      initialPath,
    );
    if (!hasOwn(initial, "analyticsStorage")) {
      throw new TypeError(`${initialPath}.analyticsStorage is required.`);
    }
    normalized.initial = {
      analyticsStorage: normalizeConsentState(
        initial.analyticsStorage,
        `${initialPath}.analyticsStorage`,
      ),
    };
    for (const key of [
      "adStorage",
      "adUserData",
      "adPersonalization",
    ] as const) {
      if (hasOwn(initial, key)) {
        normalized.initial[key] = normalizeConsentState(
          initial[key],
          `${initialPath}.${key}`,
        );
      }
    }
  }
  return normalized;
}

function normalizeProviderConfig(value: unknown): Record<string, string | number | boolean> {
  const path = "provider.config";
  const config = expectObject(value, path);
  const normalized: Record<string, string | number | boolean> = {};
  for (const key of Reflect.ownKeys(config)) {
    if (typeof key !== "string") {
      throw new TypeError(`${path} contains an unsupported symbol key.`);
    }
    const entry = Reflect.get(config, key) as unknown;
    if (
      typeof entry !== "string" &&
      typeof entry !== "boolean" &&
      (typeof entry !== "number" || !Number.isFinite(entry))
    ) {
      throw new TypeError(`${path}.${key} must be a string, finite number, or boolean.`);
    }
    Object.defineProperty(normalized, key, {
      configurable: true,
      enumerable: true,
      value: entry,
      writable: true,
    });
  }
  return normalized;
}

function normalizeGoogle(provider: UnknownRecord): GoogleAnalyticsProvider & {
  pageviews: PageviewMode;
} {
  assertExactKeys(
    provider,
    ["name", "measurementId", "scriptSrc", "pageviews", "consent", "config"],
    "provider",
  );
  if (!hasOwn(provider, "measurementId")) {
    throw new TypeError("provider.measurementId is required.");
  }
  const measurementId = requireNonEmpty(
    provider.measurementId,
    "provider.measurementId",
  );
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    throw new TypeError("provider.measurementId must be a GA4 G- identifier.");
  }
  if (!hasOwn(provider, "consent")) {
    throw new TypeError("Google Analytics (GA4) requires an explicit consent.mode.");
  }

  const normalized: GoogleAnalyticsProvider & { pageviews: PageviewMode } = {
    name: "google-analytics",
    measurementId,
    scriptSrc: validateHttpsUrl(
      hasOwn(provider, "scriptSrc")
        ? provider.scriptSrc
        : `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
      "provider.scriptSrc",
    ),
    pageviews: hasOwn(provider, "pageviews")
      ? normalizePageviews(provider.pageviews, "provider.pageviews")
      : "provider",
    consent: normalizeGoogleConsent(provider.consent),
  };
  if (hasOwn(provider, "config")) {
    normalized.config = normalizeProviderConfig(provider.config);
  }
  return normalized;
}

function normalizePlausible(provider: UnknownRecord): PlausibleProvider & {
  pageviews: PageviewMode;
} {
  assertExactKeys(
    provider,
    ["name", "scriptSrc", "pageviews", "consent", "endpoint", "captureOnLocalhost"],
    "provider",
  );
  if (!hasOwn(provider, "scriptSrc")) {
    throw new TypeError("provider.scriptSrc is required.");
  }
  const normalized: PlausibleProvider & { pageviews: PageviewMode } = {
    name: "plausible",
    scriptSrc: validateHttpsUrl(provider.scriptSrc, "provider.scriptSrc"),
    pageviews: hasOwn(provider, "pageviews")
      ? normalizePageviews(provider.pageviews, "provider.pageviews")
      : "provider",
  };
  if (hasOwn(provider, "consent")) {
    normalized.consent = normalizeSimpleConsent(
      provider.consent,
      "provider.consent",
    );
  }
  if (hasOwn(provider, "endpoint")) {
    normalized.endpoint = validateHttpsUrl(
      provider.endpoint,
      "provider.endpoint",
    );
  }
  if (hasOwn(provider, "captureOnLocalhost")) {
    normalized.captureOnLocalhost = expectBoolean(
      provider.captureOnLocalhost,
      "provider.captureOnLocalhost",
    );
  }
  return normalized;
}

function normalizeFathom(provider: UnknownRecord): FathomProvider & {
  pageviews: PageviewMode;
} {
  assertExactKeys(
    provider,
    ["name", "siteId", "scriptSrc", "pageviews", "consent", "honorDnt", "canonical"],
    "provider",
  );
  if (!hasOwn(provider, "siteId")) {
    throw new TypeError("provider.siteId is required.");
  }
  const normalized: FathomProvider & { pageviews: PageviewMode } = {
    name: "fathom",
    siteId: requireNonEmpty(provider.siteId, "provider.siteId"),
    scriptSrc: validateHttpsUrl(
      hasOwn(provider, "scriptSrc")
        ? provider.scriptSrc
        : DEFAULT_FATHOM_SCRIPT,
      "provider.scriptSrc",
    ),
    pageviews: hasOwn(provider, "pageviews")
      ? normalizePageviews(provider.pageviews, "provider.pageviews")
      : "provider",
  };
  if (hasOwn(provider, "consent")) {
    normalized.consent = normalizeSimpleConsent(
      provider.consent,
      "provider.consent",
    );
  }
  if (hasOwn(provider, "honorDnt")) {
    normalized.honorDnt = expectBoolean(
      provider.honorDnt,
      "provider.honorDnt",
    );
  }
  if (hasOwn(provider, "canonical")) {
    normalized.canonical = expectBoolean(
      provider.canonical,
      "provider.canonical",
    );
  }
  return normalized;
}

function normalizeMatomo(provider: UnknownRecord): MatomoProvider & {
  pageviews: PageviewMode;
} {
  assertExactKeys(
    provider,
    ["name", "trackerUrl", "siteId", "eventCategory", "scriptSrc", "pageviews", "consent"],
    "provider",
  );
  for (const key of ["trackerUrl", "siteId", "eventCategory"] as const) {
    if (!hasOwn(provider, key)) {
      throw new TypeError(`provider.${key} is required.`);
    }
  }
  const trackerUrl = validateHttpsUrl(
    provider.trackerUrl,
    "provider.trackerUrl",
  );
  const tracker = new URL(trackerUrl);
  if (tracker.search || tracker.hash || !tracker.pathname.endsWith("/matomo.php")) {
    throw new TypeError("provider.trackerUrl must end with /matomo.php and contain no query or fragment.");
  }
  const siteId = requireNonEmpty(provider.siteId, "provider.siteId");
  if (!/^[1-9]\d*$/.test(siteId) || !Number.isSafeInteger(Number(siteId))) {
    throw new TypeError("provider.siteId must be a positive integer string.");
  }
  const eventCategory = requireNonEmpty(
    provider.eventCategory,
    "provider.eventCategory",
  );
  if (eventCategory.length > 128) {
    throw new TypeError("provider.eventCategory must be at most 128 characters.");
  }
  const normalized: MatomoProvider & { pageviews: PageviewMode } = {
    name: "matomo",
    trackerUrl,
    siteId,
    eventCategory,
    scriptSrc: validateHttpsUrl(
      hasOwn(provider, "scriptSrc")
        ? provider.scriptSrc
        : new URL("matomo.js", trackerUrl).href,
      "provider.scriptSrc",
    ),
    pageviews: hasOwn(provider, "pageviews")
      ? normalizePageviews(provider.pageviews, "provider.pageviews")
      : "provider",
  };
  if (hasOwn(provider, "consent")) {
    normalized.consent = normalizeSimpleConsent(
      provider.consent,
      "provider.consent",
    );
  }
  return normalized;
}

function normalizeUmami(provider: UnknownRecord): UmamiProvider & {
  pageviews: PageviewMode;
} {
  assertExactKeys(
    provider,
    ["name", "websiteId", "scriptSrc", "hostUrl", "pageviews", "consent"],
    "provider",
  );
  for (const key of ["websiteId", "scriptSrc"] as const) {
    if (!hasOwn(provider, key)) {
      throw new TypeError(`provider.${key} is required.`);
    }
  }
  const websiteId = requireNonEmpty(provider.websiteId, "provider.websiteId");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(websiteId)) {
    throw new TypeError("provider.websiteId must be a UUID string.");
  }
  const normalized: UmamiProvider & { pageviews: PageviewMode } = {
    name: "umami",
    websiteId,
    scriptSrc: validateHttpsUrl(provider.scriptSrc, "provider.scriptSrc"),
    pageviews: hasOwn(provider, "pageviews")
      ? normalizePageviews(provider.pageviews, "provider.pageviews")
      : "provider",
  };
  if (hasOwn(provider, "hostUrl")) {
    const hostUrl = validateHttpsUrl(provider.hostUrl, "provider.hostUrl");
    const parsed = new URL(hostUrl);
    if (parsed.search || parsed.hash) {
      throw new TypeError("provider.hostUrl must contain no query or fragment.");
    }
    normalized.hostUrl = hostUrl;
  }
  if (hasOwn(provider, "consent")) {
    normalized.consent = normalizeSimpleConsent(
      provider.consent,
      "provider.consent",
    );
  }
  return normalized;
}

function normalizeProvider(value: unknown): NormalizedAnalyticsProvider {
  const provider = expectObject(value, "provider");
  if (!hasOwn(provider, "name") || typeof provider.name !== "string") {
    throw new TypeError("provider.name must identify a supported provider.");
  }
  switch (provider.name) {
    case "google-analytics":
      return normalizeGoogle(provider);
    case "plausible":
      return normalizePlausible(provider);
    case "fathom":
      return normalizeFathom(provider);
    case "matomo":
      return normalizeMatomo(provider);
    case "umami":
      return normalizeUmami(provider);
    default:
      throw new TypeError(`provider.name ${JSON.stringify(provider.name)} is not supported.`);
  }
}

function normalizeProviders(
  value: unknown,
): false | readonly NormalizedAnalyticsProvider[] {
  if (value === false) return false;
  if (!Array.isArray(value)) {
    throw new TypeError("configuration.providers must be an array or false.");
  }
  if (value.length === 0) {
    throw new TypeError("configuration.providers must not be empty; use false to disable analytics.");
  }
  const providers = value.map((provider) => normalizeProvider(provider));
  const names = new Set<AnalyticsProvider["name"]>();
  for (const provider of providers) {
    if (names.has(provider.name)) {
      throw new TypeError(
        `configuration.providers contains duplicate provider ${JSON.stringify(provider.name)}.`,
      );
    }
    names.add(provider.name);
  }
  return Object.freeze(providers);
}

function normalizeEnvironments(value: unknown): Required<AnalyticsEnvironments> {
  const environments = expectObject(value, "environments");
  assertExactKeys(
    environments,
    ["production", "preview", "development"],
    "environments",
  );
  return {
    production: hasOwn(environments, "production")
      ? expectBoolean(environments.production, "environments.production")
      : true,
    preview: hasOwn(environments, "preview")
      ? expectBoolean(environments.preview, "environments.preview")
      : false,
    development: hasOwn(environments, "development")
      ? expectBoolean(environments.development, "environments.development")
      : false,
  };
}

function normalizeEvents(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const events = expectObject(value, "configuration.events");
  assertExactKeys(events, ["globalName", "queue"], "configuration.events");
  if (hasOwn(events, "globalName") && events.globalName !== "astroAnalytics") {
    throw new TypeError('configuration.events.globalName must be "astroAnalytics".');
  }
  if (hasOwn(events, "queue") && events.queue !== false) {
    const queue = expectObject(events.queue, "configuration.events.queue");
    assertExactKeys(queue, ["maxSize"], "configuration.events.queue");
    if (!hasOwn(queue, "maxSize") || typeof queue.maxSize !== "number" ||
        !Number.isInteger(queue.maxSize) || queue.maxSize < 1 || queue.maxSize > 100) {
      throw new TypeError("configuration.events.queue.maxSize must be an integer from 1 to 100.");
    }
  }
  return true;
}

function normalizeBlockedQueryParameters(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    throw new TypeError("configuration.blockedQueryParameters must be an array.");
  }
  if (value.length > 32) {
    throw new TypeError("configuration.blockedQueryParameters must contain at most 32 names.");
  }
  const names = value.map((entry, index) => {
    const name = expectString(entry, `configuration.blockedQueryParameters[${index}]`);
    if (name.length === 0 || name.length > 128 || name.trim() !== name) {
      throw new TypeError(`configuration.blockedQueryParameters[${index}] must be a non-empty, unpadded name of at most 128 characters.`);
    }
    return name;
  });
  if (new Set(names).size !== names.length) {
    throw new TypeError("configuration.blockedQueryParameters must not contain duplicates.");
  }
  return Object.freeze(names);
}

export function normalizeConfig(configValue: unknown): NormalizedAstroAnalyticsConfig {
  const config = expectObject(configValue, "astroAnalytics() configuration");
  assertExactKeys(
    config,
    ["enabled", "environments", "provider", "providers", "events", "blockedQueryParameters", "debug"],
    "configuration",
  );
  const hasProvider = hasOwn(config, "provider");
  const hasProviders = hasOwn(config, "providers");
  if (!hasProvider && !hasProviders) {
    throw new TypeError("configuration.provider is required unless configuration.providers is supplied.");
  }
  if (hasProvider && hasProviders) {
    throw new TypeError("configuration.provider and configuration.providers cannot be used together.");
  }
  const legacyProvider = hasProvider
    ? config.provider === false
      ? false
      : normalizeProvider(config.provider)
    : undefined;
  const providers = hasProviders
    ? normalizeProviders(config.providers)
    : legacyProvider === false
      ? false
      : Object.freeze([legacyProvider as NormalizedAnalyticsProvider]);
  return {
    enabled: hasOwn(config, "enabled")
      ? expectBoolean(config.enabled, "configuration.enabled")
      : true,
    environments: hasOwn(config, "environments")
      ? normalizeEnvironments(config.environments)
      : { production: true, preview: false, development: false },
    ...(hasProvider ? { provider: legacyProvider } : {}),
    providers,
    events: hasOwn(config, "events")
      ? normalizeEvents(config.events)
      : false,
    blockedQueryParameters: hasOwn(config, "blockedQueryParameters")
      ? normalizeBlockedQueryParameters(config.blockedQueryParameters)
      : Object.freeze([]),
    debug: hasOwn(config, "debug")
      ? expectBoolean(config.debug, "configuration.debug")
      : false,
  };
}

export function isEnabledForCommand(
  config: NormalizedAstroAnalyticsConfig,
  command: AnalyticsCommand,
): boolean {
  if (!config.enabled || config.providers === false) return false;
  switch (command) {
    case "build":
      return config.environments.production;
    case "preview":
      return config.environments.preview;
    case "dev":
      return config.environments.development;
    case "sync":
    default:
      return false;
  }
}
