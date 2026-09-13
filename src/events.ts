import type { AnalyticsProvider } from "#config";

export const EVENT_NAME_MAX_LENGTH = 128;
export const EVENT_PROPERTY_COUNT_MAX = 100;
export const EVENT_PROPERTY_KEY_MAX_LENGTH = 128;
export const EVENT_PROPERTY_STRING_MAX_LENGTH = 1024;

export type TrackFailureReason =
  | "disabled"
  | "adapter-not-loaded"
  | "consent-pending"
  | "invalid-event";

export type ProviderName = AnalyticsProvider["name"];
export type ProviderTrackFailureReason = Exclude<TrackFailureReason, "disabled">;

export type ProviderTrackResult =
  | { ok: true }
  | { ok: false; reason: ProviderTrackFailureReason };

export type ProviderTrackResults = Readonly<
  Partial<Record<ProviderName, ProviderTrackResult>>
>;
export type ProviderRuntimeStatus =
  | "ready"
  | "adapter-not-loaded"
  | "consent-pending";
export type ProviderRuntimeStatuses = Readonly<
  Partial<Record<ProviderName, ProviderRuntimeStatus>>
>;

export type TrackResult =
  | { ok: true; providers: ProviderTrackResults }
  | {
      ok: false;
      providers: ProviderTrackResults;
      reason?: TrackFailureReason;
    };

export type EventProperties = Record<string, string | number | boolean>;

export interface AstroAnalyticsClient {
  readonly providers: readonly ProviderName[];
  status(): ProviderRuntimeStatuses;
  track(name: string, properties?: EventProperties): TrackResult;
}

declare global {
  interface Window {
    astroAnalytics?: AstroAnalyticsClient;
  }
}

const FAILURE_REASONS = new Set<TrackFailureReason>([
  "disabled",
  "adapter-not-loaded",
  "consent-pending",
  "invalid-event",
]);
const PROVIDER_FAILURE_REASONS = new Set<ProviderTrackFailureReason>([
  "adapter-not-loaded",
  "consent-pending",
  "invalid-event",
]);
const PROVIDER_RUNTIME_STATUSES = new Set<ProviderRuntimeStatus>([
  "ready",
  "adapter-not-loaded",
  "consent-pending",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  const prototype = Reflect.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Reflect.ownKeys(value);
  return actual.length === keys.length && keys.every((key) => actual.includes(key));
}

function normalizeEvent(
  name: unknown,
  properties: unknown,
): { name: string; properties?: EventProperties } | undefined {
  if (typeof name !== "string") return undefined;
  const normalizedName = name.trim();
  if (!normalizedName || normalizedName.length > EVENT_NAME_MAX_LENGTH) {
    return undefined;
  }
  if (properties === undefined) return { name: normalizedName };
  if (!isRecord(properties)) return undefined;

  const keys = Reflect.ownKeys(properties);
  if (keys.length > EVENT_PROPERTY_COUNT_MAX) return undefined;
  const normalized: EventProperties = {};
  for (const key of keys) {
    if (typeof key !== "string") return undefined;
    const value = Reflect.get(properties, key) as unknown;
    if (!key || key.length > EVENT_PROPERTY_KEY_MAX_LENGTH) return undefined;
    if (typeof value === "string") {
      if (value.length > EVENT_PROPERTY_STRING_MAX_LENGTH) return undefined;
    } else if (typeof value === "number") {
      if (!Number.isFinite(value)) return undefined;
    } else if (typeof value !== "boolean") {
      return undefined;
    }
    Object.defineProperty(normalized, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  }
  return { name: normalizedName, properties: normalized };
}

function emptyFailure(reason: "disabled" | "invalid-event"): TrackResult {
  return { ok: false, providers: Object.freeze({}), reason };
}

function normalizeProviderResult(value: unknown): ProviderTrackResult {
  if (!isRecord(value)) {
    return { ok: false, reason: "adapter-not-loaded" };
  }
  const keys = Reflect.ownKeys(value);
  const ok = Reflect.get(value, "ok") as unknown;
  if (ok === true && keys.length === 1 && keys[0] === "ok") {
    return { ok: true };
  }
  if (ok === false && hasExactKeys(value, ["ok", "reason"])) {
    const reason = Reflect.get(value, "reason") as unknown;
    if (
      typeof reason === "string" &&
      PROVIDER_FAILURE_REASONS.has(reason as ProviderTrackFailureReason)
    ) {
      return { ok: false, reason: reason as ProviderTrackFailureReason };
    }
  }
  return { ok: false, reason: "adapter-not-loaded" };
}

function normalizeProviderNames(value: unknown): readonly ProviderName[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const supported = new Set<ProviderName>([
    "fathom",
    "google-analytics",
    "matomo",
    "plausible",
    "umami",
  ]);
  const names: ProviderName[] = [];
  for (const provider of value) {
    if (typeof provider !== "string" || !supported.has(provider as ProviderName)) {
      return undefined;
    }
    if (names.includes(provider as ProviderName)) return undefined;
    names.push(provider as ProviderName);
  }
  return Object.freeze(names);
}

function normalizeResult(
  value: unknown,
  providerNames: readonly ProviderName[],
): TrackResult {
  if (
    !isRecord(value) ||
    (!hasExactKeys(value, ["ok", "providers"]) &&
      !hasExactKeys(value, ["ok", "providers", "reason"]))
  ) {
    const failures: Partial<Record<ProviderName, ProviderTrackResult>> = {};
    for (const provider of providerNames) {
      Object.defineProperty(failures, provider, {
        configurable: false,
        enumerable: true,
        value: Object.freeze({ ok: false, reason: "adapter-not-loaded" }),
        writable: false,
      });
    }
    return { ok: false, providers: Object.freeze(failures) };
  }
  const rawProviders = Reflect.get(value, "providers") as unknown;
  if (!isRecord(rawProviders)) {
    return normalizeResult(undefined, providerNames);
  }
  const rawKeys = Reflect.ownKeys(rawProviders);
  if (
    rawKeys.length !== providerNames.length ||
    !providerNames.every((provider) => rawKeys.includes(provider))
  ) {
    return normalizeResult(undefined, providerNames);
  }
  const providers: Partial<Record<ProviderName, ProviderTrackResult>> = {};
  let allAccepted = providerNames.length > 0;
  let sharedReason: TrackFailureReason | undefined;
  let failures = 0;
  for (const provider of providerNames) {
    const result = normalizeProviderResult(Reflect.get(rawProviders, provider));
    if (!result.ok) {
      allAccepted = false;
      failures += 1;
      if (failures === 1) sharedReason = result.reason;
      else if (sharedReason !== result.reason) sharedReason = undefined;
    }
    Object.defineProperty(providers, provider, {
      configurable: false,
      enumerable: true,
      value: Object.freeze(result),
      writable: false,
    });
  }
  if (Reflect.get(value, "ok") !== allAccepted) {
    return normalizeResult(undefined, providerNames);
  }
  const frozenProviders = Object.freeze(providers);
  if (allAccepted) {
    if (Reflect.ownKeys(value).includes("reason")) {
      return normalizeResult(undefined, providerNames);
    }
    return { ok: true, providers: frozenProviders };
  }
  const rawReason = Reflect.get(value, "reason") as unknown;
  if (rawReason !== undefined) {
    if (typeof rawReason !== "string" || !FAILURE_REASONS.has(rawReason as TrackFailureReason)) {
      return normalizeResult(undefined, providerNames);
    }
    if (failures !== providerNames.length || sharedReason !== rawReason) {
      return normalizeResult(undefined, providerNames);
    }
    return { ok: false, providers: frozenProviders, reason: rawReason as TrackFailureReason };
  }
  return { ok: false, providers: frozenProviders };
}

export function configuredProviders(): readonly ProviderName[] {
  try {
    if (typeof window === "undefined") return Object.freeze([]);
    const client = Reflect.get(window, "astroAnalytics") as unknown;
    if (!isObject(client)) return Object.freeze([]);
    return normalizeProviderNames(Reflect.get(client, "providers")) ?? Object.freeze([]);
  } catch {
    return Object.freeze([]);
  }
}

export function providerStatuses(): ProviderRuntimeStatuses {
  try {
    if (typeof window === "undefined") return Object.freeze({});
    const client = Reflect.get(window, "astroAnalytics") as unknown;
    if (!isObject(client)) return Object.freeze({});
    const providerNames = normalizeProviderNames(Reflect.get(client, "providers"));
    const status = Reflect.get(client, "status") as unknown;
    if (!providerNames || typeof status !== "function") return Object.freeze({});
    const value = Reflect.apply(status, client, []) as unknown;
    if (!isRecord(value)) return Object.freeze({});
    const keys = Reflect.ownKeys(value);
    if (keys.length !== providerNames.length ||
        !providerNames.every((provider) => keys.includes(provider))) {
      return Object.freeze({});
    }
    const normalized: Partial<Record<ProviderName, ProviderRuntimeStatus>> = {};
    for (const provider of providerNames) {
      const providerStatus = Reflect.get(value, provider) as unknown;
      if (typeof providerStatus !== "string" ||
          !PROVIDER_RUNTIME_STATUSES.has(providerStatus as ProviderRuntimeStatus)) {
        return Object.freeze({});
      }
      Object.defineProperty(normalized, provider, {
        configurable: false,
        enumerable: true,
        value: providerStatus,
        writable: false,
      });
    }
    return Object.freeze(normalized);
  } catch {
    return Object.freeze({});
  }
}

export function track(name: string, properties?: EventProperties): TrackResult {
  try {
    const event = normalizeEvent(name, properties);
    if (!event) return emptyFailure("invalid-event");

    if (typeof window === "undefined") {
      return emptyFailure("disabled");
    }
    const browserGlobal: unknown = window;
    if (!isObject(browserGlobal)) {
      return emptyFailure("disabled");
    }
    const client = Reflect.get(browserGlobal, "astroAnalytics") as unknown;
    if (client === undefined || client === null) {
      return emptyFailure("disabled");
    }
    if (!isObject(client)) {
      return emptyFailure("disabled");
    }
    const clientTrack = Reflect.get(client, "track") as unknown;
    if (typeof clientTrack !== "function") {
      return emptyFailure("disabled");
    }
    const providerNames = normalizeProviderNames(Reflect.get(client, "providers"));
    if (!providerNames || providerNames.length === 0) return emptyFailure("disabled");
    return normalizeResult(
      Reflect.apply(clientTrack, client, [event.name, event.properties]),
      providerNames,
    );
  } catch {
    return emptyFailure("disabled");
  }
}
