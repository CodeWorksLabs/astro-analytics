import type { AnalyticsProvider } from "#config";
import {
  EVENT_PROPERTY_LIMITS,
  validateEventProperties,
} from "./event-validation.ts";

export const EVENT_NAME_MAX_LENGTH = 128;
export const EVENT_PROPERTY_COUNT_MAX = EVENT_PROPERTY_LIMITS.count;
export const EVENT_PROPERTY_KEY_MAX_LENGTH = EVENT_PROPERTY_LIMITS.keyLength;
export const EVENT_PROPERTY_STRING_MAX_LENGTH = EVENT_PROPERTY_LIMITS.stringLength;

export type TrackFailureReason = "disabled" | "adapter-not-loaded" | "consent-pending" | "invalid-event";
export type ProviderName = AnalyticsProvider["name"];
export type ProviderTrackFailureReason = Exclude<TrackFailureReason, "disabled">;
export type ProviderTrackResult = { ok: true } | { ok: false; reason: ProviderTrackFailureReason };
export type ProviderTrackResults = Readonly<Partial<Record<ProviderName, ProviderTrackResult>>>;
export type ProviderRuntimeStatus = "ready" | "adapter-not-loaded" | "consent-pending";
export type ProviderRuntimeStatuses = Readonly<Partial<Record<ProviderName, ProviderRuntimeStatus>>>;
export type TrackResult =
  | { ok: true; providers: ProviderTrackResults }
  | { ok: false; providers: ProviderTrackResults; reason?: TrackFailureReason };
export type EventProperties = Record<string, string | number | boolean>;

export interface AstroAnalyticsClient {
  readonly providers: readonly ProviderName[];
  status(): ProviderRuntimeStatuses;
  track(name: string, properties?: EventProperties): TrackResult;
}

declare global {
  interface Window { astroAnalytics?: AstroAnalyticsClient; }
}

const PROVIDERS = new Set<ProviderName>(["fathom", "google-analytics", "matomo", "plausible", "umami"]);
const STATUSES = new Set<ProviderRuntimeStatus>(["ready", "adapter-not-loaded", "consent-pending"]);
const REASONS = new Set<ProviderTrackFailureReason>(["adapter-not-loaded", "consent-pending", "invalid-event"]);

function record(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? value as Record<string, unknown>
    : undefined;
}

function providerNames(value: unknown): readonly ProviderName[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const names: ProviderName[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !PROVIDERS.has(item as ProviderName) || names.includes(item as ProviderName)) return undefined;
    names.push(item as ProviderName);
  }
  return Object.freeze(names);
}

function event(name: unknown, properties: unknown): { name: string; properties?: EventProperties } | undefined {
  if (typeof name !== "string") return undefined;
  const normalizedName = name.trim();
  if (!normalizedName || normalizedName.length > EVENT_NAME_MAX_LENGTH) return undefined;
  const validation = validateEventProperties(properties, EVENT_PROPERTY_LIMITS);
  if (!validation.ok) return undefined;
  return validation.properties === undefined
    ? { name: normalizedName }
    : { name: normalizedName, properties: validation.properties };
}

function disabled(reason: "disabled" | "invalid-event"): TrackResult {
  return { ok: false, providers: Object.freeze({}), reason };
}

function normalizeProviderResult(value: unknown): ProviderTrackResult {
  const result = record(value);
  if (result?.ok === true && Object.keys(result).length === 1) return { ok: true };
  if (result?.ok === false && typeof result.reason === "string" &&
      REASONS.has(result.reason as ProviderTrackFailureReason) && Object.keys(result).length === 2)
    return { ok: false, reason: result.reason as ProviderTrackFailureReason };
  return { ok: false, reason: "adapter-not-loaded" };
}

function malformedResults(names: readonly ProviderName[]): TrackResult {
  const providers: ProviderTrackResults = Object.freeze(Object.fromEntries(
    names.map((name) => [name, Object.freeze({ ok: false, reason: "adapter-not-loaded" })]),
  ));
  return { ok: false, providers };
}

function normalizeResult(value: unknown, names: readonly ProviderName[]): TrackResult {
  const aggregate = record(value);
  const rawProviders = record(aggregate?.providers);
  if (!aggregate || !rawProviders || Object.keys(rawProviders).length !== names.length ||
      !names.every((name) => Object.hasOwn(rawProviders, name))) return malformedResults(names);
  const providers: Partial<Record<ProviderName, ProviderTrackResult>> = {};
  let accepted = names.length > 0;
  let sharedReason: ProviderTrackFailureReason | undefined;
  for (const name of names) {
    const result = normalizeProviderResult(rawProviders[name]);
    providers[name] = Object.freeze(result);
    if (!result.ok) {
      accepted = false;
      sharedReason = sharedReason === undefined ? result.reason
        : sharedReason === result.reason ? sharedReason : undefined;
    }
  }
  if (aggregate.ok !== accepted) return malformedResults(names);
  const frozen = Object.freeze(providers);
  if (accepted) return { ok: true, providers: frozen };
  if (typeof aggregate.reason === "string" && aggregate.reason === sharedReason)
    return { ok: false, providers: frozen, reason: sharedReason };
  if (aggregate.reason !== undefined) return malformedResults(names);
  return { ok: false, providers: frozen };
}

export function configuredProviders(): readonly ProviderName[] {
  try { return typeof window === "undefined" ? Object.freeze([]) : providerNames(window.astroAnalytics?.providers) ?? Object.freeze([]); }
  catch { return Object.freeze([]); }
}

export function providerStatuses(): ProviderRuntimeStatuses {
  try {
    const names = configuredProviders();
    if (typeof window === "undefined" || !window.astroAnalytics || names.length === 0) return Object.freeze({});
    const value = record(window.astroAnalytics.status());
    if (!value || Object.keys(value).length !== names.length) return Object.freeze({});
    const statuses: Partial<Record<ProviderName, ProviderRuntimeStatus>> = {};
    for (const name of names) {
      const status = value[name];
      if (typeof status !== "string" || !STATUSES.has(status as ProviderRuntimeStatus)) return Object.freeze({});
      statuses[name] = status as ProviderRuntimeStatus;
    }
    return Object.freeze(statuses);
  } catch { return Object.freeze({}); }
}

export function track(name: string, properties?: EventProperties): TrackResult {
  try {
    const normalized = event(name, properties);
    if (!normalized) return disabled("invalid-event");
    if (typeof window === "undefined" || !window.astroAnalytics) return disabled("disabled");
    const names = providerNames(window.astroAnalytics.providers);
    if (!names?.length) return disabled("disabled");
    return normalizeResult(window.astroAnalytics.track(normalized.name, normalized.properties), names);
  } catch { return disabled("disabled"); }
}
