export const RUNTIME_CLIENT_BRAND = "astro-analytics:client:v1";
export const FATHOM_SCRIPT_ID = "codeworkslabs-astro-analytics-fathom";
export const PLAUSIBLE_SCRIPT_ID = "codeworkslabs-astro-analytics-plausible";
export const GOOGLE_ANALYTICS_SCRIPT_ID = "codeworkslabs-astro-analytics-google-analytics";
export const MATOMO_SCRIPT_ID = "codeworkslabs-astro-analytics-matomo";
export const UMAMI_SCRIPT_ID = "codeworkslabs-astro-analytics-umami";

export interface AnalyticsRuntimeOptions {
  events: boolean;
  providers: readonly string[];
  runtimeToken: string;
}

export interface FathomRuntimeOptions {
  canonical?: boolean | undefined;
  consentMode?: "immediate" | "deferred" | "external" | undefined;
  events: boolean;
  honorDnt?: boolean | undefined;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
  siteId: string;
}

export interface PlausibleRuntimeOptions {
  captureOnLocalhost?: boolean | undefined;
  consentMode?: "immediate" | "deferred" | "external" | undefined;
  endpoint?: string | undefined;
  events: boolean;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
}

export interface GoogleAnalyticsRuntimeOptions {
  config?: Readonly<Record<string, string | number | boolean>> | undefined;
  consentInitial?: Readonly<{
    analyticsStorage: "granted" | "denied";
    adStorage?: "granted" | "denied" | undefined;
    adUserData?: "granted" | "denied" | undefined;
    adPersonalization?: "granted" | "denied" | undefined;
  }> | undefined;
  consentMode: "immediate" | "deferred" | "external";
  events: boolean;
  measurementId: string;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
}

export interface MatomoRuntimeOptions {
  consentMode?: "immediate" | "deferred" | "external" | undefined;
  eventCategory: string;
  events: boolean;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
  siteId: string;
  trackerUrl: string;
}

export interface UmamiRuntimeOptions {
  consentMode?: "immediate" | "deferred" | "external" | undefined;
  events: boolean;
  hostUrl?: string | undefined;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
  websiteId: string;
}

export function createBootstrapScript(
  options: AnalyticsRuntimeOptions = {
    events: true,
    providers: ["fathom"],
    runtimeToken: "test-runtime-token",
  },
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  try {
    const root = globalThis;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
    if (typeof coordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(root, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const existingKeys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (existingKeys.length === 3 && ["register", "run", "runtimeToken"].every((key) => existingKeys.includes(key)) &&
            typeof Reflect.get(existingCoordinator, "register") === "function" && typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
          return;
        }
      }
    } catch { return; }

    const clientKey = "astroAnalytics";
    const handlers = Object.create(null);
    const ownedProviders = Object.freeze(Array.from(config.providers));
    let configuredProviders = Object.freeze([]);
    let eventsEnabled = config.events === true;
    let installedClient;

    const normalizeAdapterResult = (value) => {
      try {
        if ((typeof value !== "object" && typeof value !== "function") || value === null) {
          return Object.freeze({ ok: false, reason: "adapter-not-loaded" });
        }
        const keys = Reflect.ownKeys(value);
        const ok = Reflect.get(value, "ok");
        if (ok === true && keys.length === 1 && keys[0] === "ok") {
          return Object.freeze({ ok: true });
        }
        const reason = Reflect.get(value, "reason");
        if (ok === false && keys.length === 2 && keys.includes("ok") && keys.includes("reason") &&
            ["adapter-not-loaded", "consent-pending", "invalid-event"].includes(reason)) {
          return Object.freeze({ ok: false, reason });
        }
      } catch {}
      return Object.freeze({ ok: false, reason: "adapter-not-loaded" });
    };

    const normalizeProviderStatus = (value) =>
      ["ready", "adapter-not-loaded", "consent-pending"].includes(value)
        ? value
        : "adapter-not-loaded";

    const normalizeEvent = (name, properties) => {
      try {
        if (typeof name !== "string") return undefined;
        const normalizedName = name.trim();
        if (normalizedName === "" || normalizedName.length > 128) return undefined;
        if (properties === undefined) {
          return Object.freeze({ name: normalizedName, properties: undefined });
        }
        if (typeof properties !== "object" || properties === null || Array.isArray(properties)) {
          return undefined;
        }
        const prototype = Reflect.getPrototypeOf(properties);
        if (prototype !== null && prototype !== Object.prototype) return undefined;
        const propertyKeys = Reflect.ownKeys(properties);
        if (propertyKeys.length > 100) return undefined;
        const normalizedProperties = Object.create(null);
        for (const key of propertyKeys) {
          if (typeof key !== "string" || key === "" || key.length > 128) return undefined;
          const value = Reflect.get(properties, key);
          if (typeof value === "string") {
            if (value.length > 1024) return undefined;
          } else if (typeof value === "number") {
            if (!Number.isFinite(value)) return undefined;
          } else if (typeof value !== "boolean") {
            return undefined;
          }
          Reflect.defineProperty(normalizedProperties, key, {
            configurable: false, enumerable: true, value, writable: false
          });
        }
        return Object.freeze({
          name: normalizedName,
          properties: Object.freeze(normalizedProperties),
        });
      } catch {
        return undefined;
      }
    };

    const installClient = () => {
      if (!eventsEnabled) return;
      const providerSnapshot = Object.freeze(Array.from(configuredProviders));
      try {
        if (installedClient !== undefined && Reflect.get(root, clientKey) === installedClient &&
            Reflect.get(installedClient, "providers").length === providerSnapshot.length &&
            providerSnapshot.every((provider, index) => Reflect.get(installedClient, "providers")[index] === provider)) return;
      } catch {}
      const client = Object.freeze({
        __astroAnalyticsBrand: brand,
        providers: providerSnapshot,
        status() {
          const statuses = Object.create(null);
          for (const provider of providerSnapshot) {
            let status = "adapter-not-loaded";
            try {
              const handler = Reflect.get(handlers, provider);
              const handlerStatus = (typeof handler === "object" || typeof handler === "function") && handler !== null
                ? Reflect.get(handler, "status")
                : undefined;
              if (typeof handlerStatus === "function") {
                status = normalizeProviderStatus(Reflect.apply(handlerStatus, handler, []));
              }
            } catch {}
            Reflect.defineProperty(statuses, provider, {
              configurable: false, enumerable: true, value: status, writable: false
            });
          }
          return Object.freeze(statuses);
        },
        track(name, properties) {
          const results = Object.create(null);
          const event = normalizeEvent(name, properties);
          if (event === undefined) {
            for (const provider of providerSnapshot) {
              Reflect.defineProperty(results, provider, {
                configurable: false,
                enumerable: true,
                value: Object.freeze({ ok: false, reason: "invalid-event" }),
                writable: false,
              });
            }
            return Object.freeze({
              ok: false,
              providers: Object.freeze(results),
              reason: "invalid-event",
            });
          }
          let allAccepted = providerSnapshot.length > 0;
          let sharedReason;
          let failures = 0;
          for (const provider of providerSnapshot) {
            let result;
            try {
              const handler = Reflect.get(handlers, provider);
              const handlerTrack = (typeof handler === "object" || typeof handler === "function") && handler !== null
                ? Reflect.get(handler, "track")
                : undefined;
              result = typeof handlerTrack === "function"
                ? normalizeAdapterResult(Reflect.apply(handlerTrack, handler, [event.name, event.properties]))
                : Object.freeze({ ok: false, reason: "adapter-not-loaded" });
            } catch {
              result = Object.freeze({ ok: false, reason: "adapter-not-loaded" });
            }
            if (result.ok !== true) {
              allAccepted = false;
              failures += 1;
              if (failures === 1) sharedReason = result.reason;
              else if (sharedReason !== result.reason) sharedReason = undefined;
            }
            Reflect.defineProperty(results, provider, {
              configurable: false, enumerable: true, value: result, writable: false
            });
          }
          const frozenResults = Object.freeze(results);
          return Object.freeze(!allAccepted && failures === providerSnapshot.length && sharedReason !== undefined
            ? { ok: false, providers: frozenResults, reason: sharedReason }
            : { ok: allAccepted, providers: frozenResults });
        }
      });
      const previousClientDescriptor = Reflect.getOwnPropertyDescriptor(root, clientKey);
      const extensible = Reflect.isExtensible(root);
      const canReplace = previousClientDescriptor === undefined
        ? extensible
        : previousClientDescriptor.configurable === true ||
          (Object.prototype.hasOwnProperty.call(previousClientDescriptor, "value") && previousClientDescriptor.writable === true);
      if (!canReplace) return;
      const replacement = previousClientDescriptor === undefined
        ? { configurable: true, enumerable: true, value: client, writable: true }
        : Object.prototype.hasOwnProperty.call(previousClientDescriptor, "value")
          ? { ...previousClientDescriptor, value: client }
          : { configurable: previousClientDescriptor.configurable, enumerable: previousClientDescriptor.enumerable, value: client, writable: true };
      if (Reflect.defineProperty(root, clientKey, replacement) === true && Reflect.get(root, clientKey) === client) {
        installedClient = client;
      }
    };

    const run = (nextConfig) => {
      try {
        if ((typeof nextConfig !== "object" && typeof nextConfig !== "function") || nextConfig === null ||
            Reflect.get(nextConfig, "runtimeToken") !== config.runtimeToken) return;
        const nextProviders = Reflect.get(nextConfig, "providers");
        if (!Array.isArray(nextProviders) || Reflect.get(nextConfig, "events") !== true ||
            nextProviders.length !== ownedProviders.length ||
            !nextProviders.every((provider, index) => provider === ownedProviders[index])) return;
        configuredProviders = Object.freeze(Array.from(nextProviders));
        eventsEnabled = true;
        installClient();
      } catch {}
    };
    const register = (provider, handler, runtimeToken) => {
      try {
        if (runtimeToken !== config.runtimeToken || typeof provider !== "string" ||
            !configuredProviders.includes(provider) ||
            (typeof handler !== "object" && typeof handler !== "function") || handler === null ||
            Reflect.get(handler, "__astroAnalyticsBrand") !== brand ||
            Reflect.get(handler, "__astroAnalyticsProvider") !== provider ||
            typeof Reflect.get(handler, "status") !== "function" ||
            typeof Reflect.get(handler, "track") !== "function") return false;
        Reflect.defineProperty(handlers, provider, {
          configurable: true, enumerable: true, value: handler, writable: true
        });
        return true;
      } catch { return false; }
    };
    const coordinator = Object.freeze({ register, run, runtimeToken: config.runtimeToken });
    let published = false;
    try {
      published = Reflect.defineProperty(root, coordinatorKey, {
        configurable: false, value: coordinator, writable: false
      }) === true && Reflect.get(root, coordinatorKey) === coordinator;
    } catch {}
    if (!published) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // The reserved global can be hostile; bootstrap must never escape an exception.
  }
})();`;
}

export function createFathomBootstrapScript(
  options: FathomRuntimeOptions,
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  const scriptId = ${JSON.stringify(FATHOM_SCRIPT_ID)};
  try {
    const root = globalThis;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const stateKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:fathom:v1"]);
    if (typeof stateKey !== "symbol") return;
    const documentValue = Reflect.get(root, "document");
    if ((typeof documentValue !== "object" && typeof documentValue !== "function") || documentValue === null) return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:fathom-coordinator:v1"]);
    if (typeof coordinatorKey !== "symbol") return;
    const clientCoordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
    if (typeof clientCoordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(documentValue, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const existingKeys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (existingKeys.length === 2 && existingKeys.includes("run") && existingKeys.includes("runtimeToken") &&
            typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
          return;
        }
      }
    } catch { return; }
    let authenticState;
    const run = (config) => {
    const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
    const isPackageScript = (value) => {
      try {
        if ((typeof value !== "object" && typeof value !== "function") || value === null ||
            Reflect.get(value, "isConnected") !== true || Reflect.get(value, "tagName") !== "SCRIPT" ||
            Reflect.get(value, "defer") !== true ||
            Reflect.get(value, "async") === true || Reflect.get(value, "noModule") === true) return false;
        const type = Reflect.get(value, "type");
        if (typeof type !== "string" || type.trim() !== "") return false;
        const getAttribute = Reflect.get(value, "getAttribute");
        return typeof getAttribute === "function" &&
          Reflect.apply(getAttribute, value, ["data-cwl-astro-analytics"]) === "fathom-v1";
      } catch { return false; }
    };
    const isOwnedScript = (value) => {
      try {
        if (!isPackageScript(value) || Reflect.get(value, "src") !== config.scriptSrc) return false;
        const getAttribute = Reflect.get(value, "getAttribute");
        return Reflect.apply(getAttribute, value, ["data-site"]) === config.siteId &&
          Reflect.apply(getAttribute, value, ["data-auto"]) === "false" &&
          Reflect.apply(getAttribute, value, ["data-cwl-pageviews"]) === config.pageviews &&
          Reflect.apply(getAttribute, value, ["data-honor-dnt"]) === (config.honorDnt === true ? "true" : null) &&
          Reflect.apply(getAttribute, value, ["data-canonical"]) === (config.canonical === false ? "false" : null);
      } catch { return false; }
    };
    let previousState;
    let previousLifecycle;
    let previousDedup;
    let previousReadiness;
    let previousScript;
    try {
      previousState = authenticState;
      if ((typeof previousState === "object" || typeof previousState === "function") && previousState !== null) {
        const candidateScript = Reflect.get(previousState, "script");
        const boundState = isPackageScript(candidateScript)
          ? Reflect.get(candidateScript, stateKey)
          : undefined;
        const keys = (typeof boundState === "object" || typeof boundState === "function") && boundState !== null
          ? Reflect.ownKeys(boundState)
          : [];
        if (keys.length === 7 && ["dedupState", "events", "lifecycle", "pageLoadListener", "readiness", "runtimeToken", "script"].every((key) => keys.includes(key)) &&
            Reflect.get(boundState, "runtimeToken") === config.runtimeToken &&
            Reflect.get(boundState, "script") === candidateScript) {
          previousState = boundState;
          previousLifecycle = Reflect.get(boundState, "lifecycle");
          previousDedup = Reflect.get(boundState, "dedupState");
          previousReadiness = Reflect.get(boundState, "readiness");
          previousScript = candidateScript;
        } else {
          previousState = undefined;
        }
      }
    } catch {}
    const installEventClient = (lifecycle, pending, clientState, isVendorReady, isEventsEnabled) => {
      if (!config.events) return;
      try {
        const client = Object.freeze({
        __astroAnalyticsBrand: brand,
        __astroAnalyticsProvider: "fathom",
        status() {
          try {
            if (authenticState !== clientState) return "adapter-not-loaded";
            if (typeof isEventsEnabled === "function" &&
                Reflect.apply(isEventsEnabled, undefined, []) !== true) return "adapter-not-loaded";
            if (pending) return "consent-pending";
            if (Reflect.get(lifecycle, "active") !== true) return "adapter-not-loaded";
            if (typeof isVendorReady !== "function" ||
                Reflect.apply(isVendorReady, undefined, []) !== true) return "adapter-not-loaded";
            const fathom = Reflect.get(root, "fathom");
            return ((typeof fathom === "object" || typeof fathom === "function") && fathom !== null &&
              typeof Reflect.get(fathom, "trackEvent") === "function")
              ? "ready"
              : "adapter-not-loaded";
          } catch { return "adapter-not-loaded"; }
        },
        track(name, properties) {
          try {
            if (authenticState !== clientState) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            if (typeof isEventsEnabled === "function" &&
                Reflect.apply(isEventsEnabled, undefined, []) !== true) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            if (pending) {
              return { ok: false, reason: "consent-pending" };
            }
            if (Reflect.get(lifecycle, "active") !== true) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            if (typeof isVendorReady !== "function" || Reflect.apply(isVendorReady, undefined, []) !== true) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            const fathom = Reflect.get(root, "fathom");
            if ((typeof fathom !== "object" && typeof fathom !== "function") || fathom === null) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            const trackEvent = Reflect.get(fathom, "trackEvent");
            if (typeof trackEvent !== "function") {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            const hasValue = properties !== undefined &&
              Object.prototype.hasOwnProperty.call(properties, "_value");
            const value = hasValue ? Reflect.get(properties, "_value") : undefined;
            if (hasValue && (!Number.isSafeInteger(value) || value < 0)) {
              return { ok: false, reason: "invalid-event" };
            }
            const eventOptions = hasValue ? { _value: value } : undefined;
            Reflect.apply(trackEvent, fathom, eventOptions === undefined ? [name] : [name, eventOptions]);
            return { ok: true };
          } catch {
            return { ok: false, reason: "adapter-not-loaded" };
          }
        }
      });
        const clientCoordinator = Reflect.get(root, clientCoordinatorKey);
        const register = (typeof clientCoordinator === "object" || typeof clientCoordinator === "function") && clientCoordinator !== null
          ? Reflect.get(clientCoordinator, "register")
          : undefined;
        if (typeof register !== "function" || Reflect.get(clientCoordinator, "runtimeToken") !== config.runtimeToken) return;
        Reflect.apply(register, clientCoordinator, ["fathom", client, config.runtimeToken]);
      } catch {
        // The optional event client must not prevent independent pageview loading.
      }
    };
    if (consentPending) {
      try {
        if (Reflect.get(previousLifecycle, "active") === true) return;
      } catch {}
      const lifecycle = Object.freeze({ active: false });
      const state = Object.freeze({ dedupState: previousDedup, events: config.events, lifecycle, pageLoadListener: undefined, readiness: undefined, runtimeToken: config.runtimeToken, script: undefined });
      let published = false;
      try {
        published = Reflect.defineProperty(documentValue, stateKey, {
          configurable: true,
          value: state,
          writable: true,
        }) === true && Reflect.get(documentValue, stateKey) === state;
        if (!published) return;
      } catch {}
      if (!published) return;
      authenticState = state;
      installEventClient(lifecycle, true, state);
      return;
    }

    const getElementById = Reflect.get(documentValue, "getElementById");
    if (typeof getElementById !== "function") return;
    const getById = (id) => Reflect.apply(getElementById, documentValue, [id]);
    let selectedScriptId;
    let reusableScript;
    for (let index = 0; index <= 100; index += 1) {
      const candidateId = index === 0 ? scriptId : scriptId + "-owned" + (index === 1 ? "" : "-" + index);
      const candidate = getById(candidateId);
      if (isOwnedScript(candidate)) {
        if (candidate === previousScript) {
          selectedScriptId = candidateId;
          reusableScript = candidate;
          break;
        }
        try {
          const remove = Reflect.get(candidate, "remove");
          if (typeof remove !== "function") return;
          Reflect.apply(remove, candidate, []);
          if (Reflect.get(candidate, "isConnected") === true) return;
          if (selectedScriptId === undefined) selectedScriptId = candidateId;
        } catch { return; }
        continue;
      }
      if (isPackageScript(candidate)) return;
      if ((candidate === null || candidate === undefined) && selectedScriptId === undefined) {
        selectedScriptId = candidateId;
      }
    }
    if (selectedScriptId === undefined) return;
    if (reusableScript !== undefined) {
      try {
        if (Reflect.get(previousLifecycle, "active") !== true) return;
        const previousEvents = Reflect.get(previousState, "events");
        if (config.events === false) {
          const disable = Reflect.get(previousEvents, "disable");
          if (typeof disable === "function") Reflect.apply(disable, previousEvents, []);
        } else {
          const enable = Reflect.get(previousEvents, "enable");
          if (typeof enable === "function") Reflect.apply(enable, previousEvents, []);
        }
        const restored = Reflect.defineProperty(documentValue, stateKey, {
          configurable: true,
          value: previousState,
          writable: true,
        }) === true && Reflect.get(documentValue, stateKey) === previousState;
        if (!restored) return;
        installEventClient(previousLifecycle, false, previousState, () =>
          Reflect.get(previousReadiness, "ready") === true,
        () => Reflect.get(previousEvents, "enabled") === true,
        );
      } catch {}
      return;
    }
    let lifecycleActive = true;
    const lifecycle = Object.freeze({
      get active() { return lifecycleActive; }
    });
    const script = Reflect.apply(Reflect.get(documentValue, "createElement"), documentValue, ["script"]);
    Reflect.set(script, "id", selectedScriptId);
    Reflect.set(script, "src", config.scriptSrc);
    Reflect.set(script, "async", false);
    Reflect.set(script, "defer", true);
    Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-astro-analytics", "fathom-v1"]);
    Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-pageviews", config.pageviews]);
    Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-site", config.siteId]);
    if (config.honorDnt === true) {
      Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-honor-dnt", "true"]);
    }
    if (config.canonical === false) {
      Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-canonical", "false"]);
    }
    Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-auto", "false"]);
    let installHref;
    try {
      const previousInstallHref = Reflect.get(previousReadiness, "installHref");
      installHref = typeof previousInstallHref === "string"
        ? previousInstallHref
        : Reflect.get(Reflect.get(root, "location"), "href");
    } catch {
      try { installHref = Reflect.get(Reflect.get(root, "location"), "href"); } catch {}
    }
    let lastTrackedNavigationUrl;
    let pendingPageviewUrl;
    let vendorReady = false;
    let readinessVerified = false;
    let eventsEnabled = config.events;
    const events = Object.freeze({
      disable() { eventsEnabled = false; },
      enable() { eventsEnabled = true; },
      get enabled() { return eventsEnabled; }
    });
    const readiness = Object.freeze({
      get installHref() { return installHref; },
      get ready() { return readinessVerified; }
    });
    const readHref = () => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    };
    const isPrerendering = () => {
      try { return Reflect.get(documentValue, "prerendering") === true; } catch { return false; }
    };
    let state;
    const sendPageview = (browserUrl) => {
      try {
        if (!vendorReady || typeof browserUrl !== "string" || browserUrl === lastTrackedNavigationUrl ||
            authenticState !== state) return;
        const fathom = Reflect.get(root, "fathom");
        if ((typeof fathom !== "object" && typeof fathom !== "function") || fathom === null) return;
        const trackPageviewMethod = Reflect.get(fathom, "trackPageview");
        if (typeof trackPageviewMethod !== "function") return;
        Reflect.apply(trackPageviewMethod, fathom, []);
        lastTrackedNavigationUrl = browserUrl;
        try { Reflect.set(dedupState, "lastTrackedNavigationUrl", browserUrl); } catch {}
      } catch {}
    };
    const pageLoadListener = config.pageviews === "none" ? undefined : () => {
      if (lifecycle.active !== true) return;
      if (authenticState !== state) return;
      const href = readHref();
      if (typeof href !== "string") return;
      if (vendorReady && !isPrerendering()) {
        sendPageview(href);
      } else pendingPageviewUrl = href;
    };
    let previousLastTrackedNavigationUrl;
    try {
      if ((typeof previousDedup === "object" || typeof previousDedup === "function") && previousDedup !== null) {
          const previousUrl = Reflect.get(previousDedup, "lastTrackedNavigationUrl");
          if (typeof previousUrl === "string") previousLastTrackedNavigationUrl = previousUrl;
      }
    } catch {}
    lastTrackedNavigationUrl = previousLastTrackedNavigationUrl;
    const dedupState = { lastTrackedNavigationUrl };
    state = Object.freeze({ dedupState, events, lifecycle, pageLoadListener, readiness, runtimeToken: config.runtimeToken, script });
    let scriptBound = false;
    try {
      scriptBound = Reflect.defineProperty(script, stateKey, {
        configurable: false,
        value: state,
        writable: false,
      }) === true && Reflect.get(script, stateKey) === state;
    } catch {}
    if (!scriptBound) return;
    let published = false;
    try {
      published = Reflect.defineProperty(documentValue, stateKey, {
        configurable: true,
        value: state,
        writable: true,
      }) === true && Reflect.get(documentValue, stateKey) === state;
    } catch {}
    if (!published) {
      return;
    }
    authenticState = state;
    installEventClient(lifecycle, false, state, () => vendorReady, () => eventsEnabled);
    if (typeof pageLoadListener === "function") {
      Reflect.apply(Reflect.get(documentValue, "addEventListener"), documentValue, ["astro:page-load", pageLoadListener]);
    }
    const flushReadyPageviews = () => {
      if (lifecycle.active !== true || isPrerendering()) return;
      if (authenticState !== state) return;
      const currentHref = readHref();
      const pendingHref = pendingPageviewUrl;
      pendingPageviewUrl = undefined;
      if (typeof pendingHref === "string") {
        if (pendingHref === currentHref) sendPageview(pendingHref);
      } else if (currentHref === installHref) sendPageview(currentHref);
    };
    const failRuntime = () => {
      if (!lifecycleActive) return;
      if (authenticState !== state) return;
      lifecycleActive = false;
      pendingPageviewUrl = undefined;
      if (typeof pageLoadListener === "function") {
        try {
          const removeEventListener = Reflect.get(documentValue, "removeEventListener");
          if (typeof removeEventListener === "function") {
            Reflect.apply(removeEventListener, documentValue, ["astro:page-load", pageLoadListener]);
          }
        } catch {}
      }
      try {
        const remove = Reflect.get(script, "remove");
        if (typeof remove === "function") Reflect.apply(remove, script, []);
      } catch {}
    };
    const hasRequiredFathomApi = () => {
      try {
        const fathom = Reflect.get(root, "fathom");
        if ((typeof fathom !== "object" && typeof fathom !== "function") || fathom === null) return false;
        if (config.pageviews !== "none") {
          return typeof Reflect.get(fathom, "trackPageview") === "function";
        }
        return config.events !== true || typeof Reflect.get(fathom, "trackEvent") === "function";
      } catch { return false; }
    };
    const activateRuntime = () => {
      if (lifecycle.active !== true) return;
      if (authenticState !== state) return;
      if (!hasRequiredFathomApi()) {
        failRuntime();
        return;
      }
      vendorReady = true;
      readinessVerified = true;
      if (config.pageviews === "none") return;
      if (isPrerendering()) {
        try {
          const addEventListener = Reflect.get(documentValue, "addEventListener");
          if (typeof addEventListener === "function") {
            Reflect.apply(addEventListener, documentValue, ["prerenderingchange", flushReadyPageviews, { once: true }]);
          }
        } catch {}
        return;
      }
      flushReadyPageviews();
    };
    Reflect.apply(Reflect.get(script, "addEventListener"), script, ["load", activateRuntime, { once: true }]);
    Reflect.apply(Reflect.get(script, "addEventListener"), script, ["error", () => {
      failRuntime();
    }, { once: true }]);
    const head = Reflect.get(documentValue, "head");
    if ((typeof head !== "object" && typeof head !== "function") || head === null) return;
    Reflect.apply(Reflect.get(head, "appendChild"), head, [script]);
    };
    const coordinator = Object.freeze({ run, runtimeToken: config.runtimeToken });
    let coordinatorPublished = false;
    try {
      coordinatorPublished = Reflect.defineProperty(documentValue, coordinatorKey, {
        configurable: false,
        value: coordinator,
        writable: false,
      }) === true && Reflect.get(documentValue, coordinatorKey) === coordinator;
    } catch {}
    if (!coordinatorPublished) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // Browser globals and DOM methods can be hostile; runtime must never escape.
  }
})();`;
}

export function createPlausibleBootstrapScript(
  options: PlausibleRuntimeOptions,
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  const scriptId = ${JSON.stringify(PLAUSIBLE_SCRIPT_ID)};
  try {
    const root = globalThis;
    const documentValue = Reflect.get(root, "document");
    if ((typeof documentValue !== "object" && typeof documentValue !== "function") || documentValue === null) return;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:plausible:v1"]);
    if (typeof coordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(documentValue, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const keys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (keys.length === 2 && keys.includes("run") && keys.includes("runtimeToken") && typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
        }
        return;
      }
    } catch { return; }

    let activeConfig;
    let activeGeneration;
    let generationCounter = 0;
    let handler;
    let lifecycle;
    let pageLoadListener;
    let pendingPageviewUrl;
    let lastTrackedNavigationUrl;
    let vendorReady = false;
    let vendorClient;
    const installHref = (() => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    })();

    const sameConfig = (value) => {
      try {
        return (typeof value === "object" || typeof value === "function") && value !== null &&
          Reflect.get(value, "captureOnLocalhost") === config.captureOnLocalhost &&
          Reflect.get(value, "consentMode") === config.consentMode &&
          Reflect.get(value, "endpoint") === config.endpoint &&
          Reflect.get(value, "events") === config.events &&
          Reflect.get(value, "pageviews") === config.pageviews &&
          Reflect.get(value, "runtimeToken") === config.runtimeToken &&
          Reflect.get(value, "scriptSrc") === config.scriptSrc;
      } catch { return false; }
    };
    const registerHandler = () => {
      if (!config.events || handler === undefined) return;
      try {
        const clientCoordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
        if (typeof clientCoordinatorKey !== "symbol") return;
        const clientCoordinator = Reflect.get(root, clientCoordinatorKey);
        const register = (typeof clientCoordinator === "object" || typeof clientCoordinator === "function") && clientCoordinator !== null
          ? Reflect.get(clientCoordinator, "register")
          : undefined;
        if (typeof register !== "function" || Reflect.get(clientCoordinator, "runtimeToken") !== config.runtimeToken) return;
        Reflect.apply(register, clientCoordinator, ["plausible", handler, config.runtimeToken]);
      } catch {}
    };
    const readHref = () => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    };
    const isPrerendering = () => {
      try { return Reflect.get(documentValue, "prerendering") === true; } catch { return false; }
    };
    const callPlausible = (name, options) => {
      const plausible = Reflect.get(root, "plausible");
      if (typeof plausible !== "function" || plausible !== vendorClient ||
          Reflect.get(plausible, "l") !== true) return false;
      Reflect.apply(plausible, root, options === undefined ? [name] : [name, options]);
      return true;
    };
    const sendPageview = (href) => {
      try {
        if (!vendorReady || lifecycle?.active !== true || typeof href !== "string" || href === lastTrackedNavigationUrl) return;
        if (!callPlausible("pageview", { url: href })) return;
        lastTrackedNavigationUrl = href;
      } catch {}
    };
    const flushPageview = () => {
      if (lifecycle?.active !== true || isPrerendering()) return;
      const href = readHref();
      const pending = pendingPageviewUrl;
      pendingPageviewUrl = undefined;
      if (typeof pending === "string" && pending === href) sendPageview(pending);
      else if (pending === undefined && href === installHref) sendPageview(href);
    };
    const run = (nextConfig) => {
      let cleanup;
      let generation;
      let lifecycleActive = false;
      try {
        if (!sameConfig(nextConfig)) return;
        if (activeConfig !== undefined) {
          if (lifecycle?.active === true) {
            registerHandler();
            return;
          }
          activeConfig = undefined;
        }
        activeConfig = nextConfig;
        generation = ++generationCounter;
        activeGeneration = generation;
        vendorReady = false;
        vendorClient = undefined;
        pendingPageviewUrl = undefined;
        lastTrackedNavigationUrl = undefined;
        lifecycleActive = true;
        lifecycle = Object.freeze({ get active() { return lifecycleActive; } });
        const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
        handler = Object.freeze({
          __astroAnalyticsBrand: brand,
          __astroAnalyticsProvider: "plausible",
          status() {
            if (activeGeneration !== generation || lifecycle.active !== true) return "adapter-not-loaded";
            if (consentPending) return "consent-pending";
            try {
              const plausible = Reflect.get(root, "plausible");
              return vendorReady && plausible === vendorClient &&
                typeof plausible === "function" && Reflect.get(plausible, "l") === true
                ? "ready"
                : "adapter-not-loaded";
            } catch { return "adapter-not-loaded"; }
          },
          track(name, properties) {
            try {
              if (activeGeneration !== generation || lifecycle.active !== true || !vendorReady) {
                return { ok: false, reason: consentPending ? "consent-pending" : "adapter-not-loaded" };
              }
              if (properties !== undefined && Reflect.ownKeys(properties).length > 30) {
                return { ok: false, reason: "invalid-event" };
              }
              let options;
              if (properties !== undefined) {
                const props = Object.create(null);
                for (const key of Reflect.ownKeys(properties)) {
                  Reflect.defineProperty(props, key, {
                    configurable: false,
                    enumerable: true,
                    value: String(Reflect.get(properties, key)),
                    writable: false,
                  });
                }
                options = { props: Object.freeze(props) };
              }
              return callPlausible(name, options)
                ? { ok: true }
                : { ok: false, reason: "adapter-not-loaded" };
            } catch { return { ok: false, reason: "adapter-not-loaded" }; }
          }
        });
        registerHandler();
        if (consentPending) return;

        const getElementById = Reflect.get(documentValue, "getElementById");
        const createElement = Reflect.get(documentValue, "createElement");
        const head = Reflect.get(documentValue, "head");
        if (typeof getElementById !== "function" || typeof createElement !== "function" ||
            (typeof head !== "object" && typeof head !== "function") || head === null) {
          lifecycleActive = false;
          return;
        }
        const occupied = Reflect.apply(getElementById, documentValue, [scriptId]);
        if (occupied !== null && occupied !== undefined) {
          lifecycleActive = false;
          return;
        }
        const previousDescriptor = Reflect.getOwnPropertyDescriptor(root, "plausible");
        if (previousDescriptor !== undefined) {
          lifecycleActive = false;
          return;
        }
        const queue = [];
        const stub = function(...args) { queue.push(args); };
        Reflect.defineProperty(stub, "q", { configurable: true, enumerable: true, value: queue, writable: true });
        Reflect.defineProperty(stub, "init", {
          configurable: true,
          enumerable: true,
          value: function(initOptions) { Reflect.set(stub, "o", initOptions || {}); },
          writable: true,
        });
        const initOptions = {
          autoCapturePageviews: false,
          captureOnLocalhost: config.captureOnLocalhost === true,
          ...(typeof config.endpoint === "string" ? { endpoint: config.endpoint } : {}),
        };
        Reflect.apply(Reflect.get(stub, "init"), stub, [initOptions]);
        if (Reflect.defineProperty(root, "plausible", {
          configurable: true, enumerable: true, value: stub, writable: true
        }) !== true || Reflect.get(root, "plausible") !== stub) {
          lifecycleActive = false;
          return;
        }
        let ownedGlobal = stub;
        let script;
        const fail = () => {
          if (activeGeneration !== generation || !lifecycleActive) return;
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          vendorReady = false;
          pendingPageviewUrl = undefined;
          if (typeof pageLoadListener === "function") {
            try {
              const remove = Reflect.get(documentValue, "removeEventListener");
              if (typeof remove === "function") Reflect.apply(remove, documentValue, ["astro:page-load", pageLoadListener]);
            } catch {}
          }
          try {
            if ((typeof script === "object" || typeof script === "function") && script !== null) {
              const remove = Reflect.get(script, "remove");
              if (typeof remove === "function") Reflect.apply(remove, script, []);
            }
          } catch {}
          try {
            if (Reflect.get(root, "plausible") === ownedGlobal) Reflect.deleteProperty(root, "plausible");
          } catch {}
        };
        cleanup = fail;
        script = Reflect.apply(createElement, documentValue, ["script"]);
        Reflect.set(script, "id", scriptId);
        Reflect.set(script, "src", config.scriptSrc);
        Reflect.set(script, "async", true);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-astro-analytics", "plausible-v1"]);
        pageLoadListener = config.pageviews === "none" ? undefined : () => {
          if (activeGeneration !== generation || lifecycle.active !== true) return;
          const href = readHref();
          if (typeof href !== "string") return;
          if (vendorReady && !isPrerendering()) sendPageview(href);
          else pendingPageviewUrl = href;
        };
        if (typeof pageLoadListener === "function") {
          const addEventListener = Reflect.get(documentValue, "addEventListener");
          if (typeof addEventListener === "function") {
            Reflect.apply(addEventListener, documentValue, ["astro:page-load", pageLoadListener]);
          }
        }
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["load", () => {
          try {
            if (activeGeneration !== generation) return;
            const plausible = Reflect.get(root, "plausible");
            if (plausible !== stub) ownedGlobal = plausible;
            if (lifecycle.active !== true || typeof plausible !== "function" ||
                plausible === stub || Reflect.get(plausible, "l") !== true) {
              fail();
              return;
            }
            vendorClient = plausible;
            vendorReady = true;
            if (config.pageviews !== "none") {
              if (isPrerendering()) {
                const addEventListener = Reflect.get(documentValue, "addEventListener");
                if (typeof addEventListener !== "function") {
                  fail();
                  return;
                }
                Reflect.apply(addEventListener, documentValue, ["prerenderingchange", () => {
                  if (activeGeneration === generation) flushPageview();
                }, { once: true }]);
              } else {
                flushPageview();
              }
            }
          } catch {
            fail();
          }
        }, { once: true }]);
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["error", fail, { once: true }]);
        Reflect.apply(Reflect.get(head, "appendChild"), head, [script]);
      } catch {
        if (typeof cleanup === "function") {
          cleanup();
        } else if (activeGeneration === generation) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
        }
      }
    };
    const coordinator = Object.freeze({ run, runtimeToken: config.runtimeToken });
    if (Reflect.defineProperty(documentValue, coordinatorKey, {
      configurable: false, value: coordinator, writable: false
    }) !== true || Reflect.get(documentValue, coordinatorKey) !== coordinator) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // Provider failure must not prevent the page from rendering.
  }
})();`;
}

export function createGoogleAnalyticsBootstrapScript(
  options: GoogleAnalyticsRuntimeOptions,
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  const scriptId = ${JSON.stringify(GOOGLE_ANALYTICS_SCRIPT_ID)};
  try {
    const root = globalThis;
    const documentValue = Reflect.get(root, "document");
    if ((typeof documentValue !== "object" && typeof documentValue !== "function") || documentValue === null) return;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:google-analytics:v1"]);
    if (typeof coordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(documentValue, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const keys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (keys.length === 2 && keys.includes("run") && keys.includes("runtimeToken") && typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
        }
        return;
      }
    } catch { return; }

    let active = false;
    let activeGeneration;
    let generationCounter = 0;
    let handler;
    let vendorReady = false;
    let ownedGtag;
    let ownedDataLayer;
    let pageLoadListener;
    let pendingPageviewUrl;
    let lastTrackedNavigationUrl;
    const installHref = (() => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    })();
    const sameRecord = (left, right) => {
      try {
        if (left === undefined || right === undefined) return left === right;
        if ((typeof left !== "object" && typeof left !== "function") || left === null ||
            (typeof right !== "object" && typeof right !== "function") || right === null) return false;
        const leftKeys = Reflect.ownKeys(left);
        const rightKeys = Reflect.ownKeys(right);
        return leftKeys.length === rightKeys.length && leftKeys.every((key) =>
          typeof key === "string" && rightKeys.includes(key) && Reflect.get(left, key) === Reflect.get(right, key));
      } catch { return false; }
    };
    const sameConfig = (value) => {
      try {
        return (typeof value === "object" || typeof value === "function") && value !== null &&
          sameRecord(Reflect.get(value, "config"), config.config) &&
          sameRecord(Reflect.get(value, "consentInitial"), config.consentInitial) &&
          Reflect.get(value, "consentMode") === config.consentMode &&
          Reflect.get(value, "events") === config.events &&
          Reflect.get(value, "measurementId") === config.measurementId &&
          Reflect.get(value, "pageviews") === config.pageviews &&
          Reflect.get(value, "runtimeToken") === config.runtimeToken &&
          Reflect.get(value, "scriptSrc") === config.scriptSrc;
      } catch { return false; }
    };
    const readHref = () => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    };
    const isPrerendering = () => {
      try { return Reflect.get(documentValue, "prerendering") === true; } catch { return false; }
    };
    const isValidGoogleName = (value) => {
      try {
        if (typeof value !== "string" || Array.from(value).length > 40 ||
            !/^[\\p{L}][\\p{L}\\p{N}_]*$/u.test(value)) return false;
        const normalized = value.toLowerCase();
        return !["firebase_", "ga_", "google_"].some((prefix) => normalized.startsWith(prefix));
      } catch { return false; }
    };
    const callGtag = (...args) => {
      try {
        const gtag = Reflect.get(root, "gtag");
        const dataLayer = Reflect.get(root, "dataLayer");
        if (!vendorReady || gtag !== ownedGtag || dataLayer !== ownedDataLayer ||
            typeof gtag !== "function" || !Array.isArray(dataLayer)) return false;
        Reflect.apply(gtag, root, args);
        return true;
      } catch { return false; }
    };
    const sendPageview = (href, generation) => {
      if (!active || activeGeneration !== generation || typeof href !== "string" || href === lastTrackedNavigationUrl) return;
      const parameters = Object.create(null);
      Reflect.defineProperty(parameters, "page_location", {
        configurable: false, enumerable: true, value: href, writable: false,
      });
      try {
        const title = Reflect.get(documentValue, "title");
        if (typeof title === "string") Reflect.defineProperty(parameters, "page_title", {
          configurable: false, enumerable: true, value: title, writable: false,
        });
      } catch {}
      let referrer = lastTrackedNavigationUrl;
      if (referrer === undefined) {
        try {
          const documentReferrer = Reflect.get(documentValue, "referrer");
          if (typeof documentReferrer === "string" && documentReferrer !== "") referrer = documentReferrer;
        } catch {}
      }
      if (typeof referrer === "string") Reflect.defineProperty(parameters, "page_referrer", {
        configurable: false, enumerable: true, value: referrer, writable: false,
      });
      Reflect.defineProperty(parameters, "send_to", {
        configurable: false, enumerable: true, value: config.measurementId, writable: false,
      });
      if (callGtag("event", "page_view", parameters)) {
        lastTrackedNavigationUrl = href;
      }
    };
    const flushPageview = (generation) => {
      if (!active || activeGeneration !== generation || isPrerendering()) return;
      const href = readHref();
      const pending = pendingPageviewUrl;
      pendingPageviewUrl = undefined;
      if (typeof pending === "string" && pending === href) sendPageview(pending, generation);
      else if (pending === undefined && href === installHref) sendPageview(href, generation);
    };
    const registerHandler = () => {
      if (!config.events || handler === undefined) return;
      try {
        const clientCoordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
        if (typeof clientCoordinatorKey !== "symbol") return;
        const clientCoordinator = Reflect.get(root, clientCoordinatorKey);
        const register = (typeof clientCoordinator === "object" || typeof clientCoordinator === "function") && clientCoordinator !== null
          ? Reflect.get(clientCoordinator, "register")
          : undefined;
        if (typeof register !== "function" || Reflect.get(clientCoordinator, "runtimeToken") !== config.runtimeToken) return;
        Reflect.apply(register, clientCoordinator, ["google-analytics", handler, config.runtimeToken]);
      } catch {}
    };
    const run = (nextConfig) => {
      if (!sameConfig(nextConfig)) return;
      if (active) {
        registerHandler();
        return;
      }
      const generation = ++generationCounter;
      activeGeneration = generation;
      vendorReady = false;
      pendingPageviewUrl = undefined;
      lastTrackedNavigationUrl = undefined;
      const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
      handler = Object.freeze({
        __astroAnalyticsBrand: brand,
        __astroAnalyticsProvider: "google-analytics",
        status() {
          if (consentPending) return "consent-pending";
          return activeGeneration === generation && active && vendorReady && Reflect.get(root, "gtag") === ownedGtag &&
            Reflect.get(root, "dataLayer") === ownedDataLayer ? "ready" : "adapter-not-loaded";
        },
        track(name, properties) {
          try {
            if (consentPending) return { ok: false, reason: "consent-pending" };
            if (activeGeneration !== generation || !active || !vendorReady) return { ok: false, reason: "adapter-not-loaded" };
            if (properties !== undefined && Reflect.ownKeys(properties).length > 25) {
              return { ok: false, reason: "invalid-event" };
            }
            if (!isValidGoogleName(name)) {
              return { ok: false, reason: "invalid-event" };
            }
            if (properties !== undefined && Object.prototype.hasOwnProperty.call(properties, "send_to")) {
              return { ok: false, reason: "invalid-event" };
            }
            const parameters = Object.create(null);
            if (properties !== undefined) {
              for (const key of Reflect.ownKeys(properties)) {
                const value = Reflect.get(properties, key);
                if (!isValidGoogleName(key) ||
                    (typeof value === "string" && Array.from(value).length > 100)) {
                  return { ok: false, reason: "invalid-event" };
                }
                Reflect.defineProperty(parameters, key, {
                  configurable: false, enumerable: true,
                  value, writable: false,
                });
              }
            }
            Reflect.defineProperty(parameters, "send_to", {
              configurable: false, enumerable: true, value: config.measurementId, writable: false,
            });
            return callGtag("event", name, parameters)
              ? { ok: true }
              : { ok: false, reason: "adapter-not-loaded" };
          } catch { return { ok: false, reason: "adapter-not-loaded" }; }
        }
      });
      registerHandler();
      if (consentPending) return;

      let localDataLayer;
      let localGtag;
      let localPageLoadListener;
      let localScript;
      const cleanup = () => {
        if (activeGeneration !== generation) return;
        active = false;
        activeGeneration = undefined;
        vendorReady = false;
        pendingPageviewUrl = undefined;
        if (typeof localPageLoadListener === "function") {
          try {
            const remove = Reflect.get(documentValue, "removeEventListener");
            if (typeof remove === "function") Reflect.apply(remove, documentValue, ["astro:page-load", localPageLoadListener]);
          } catch {}
        }
        try {
          if ((typeof localScript === "object" || typeof localScript === "function") && localScript !== null) {
            const remove = Reflect.get(localScript, "remove");
            if (typeof remove === "function") Reflect.apply(remove, localScript, []);
          }
        } catch {}
        try { if (Reflect.get(root, "gtag") === localGtag) Reflect.deleteProperty(root, "gtag"); } catch {}
        try { if (Reflect.get(root, "dataLayer") === localDataLayer) Reflect.deleteProperty(root, "dataLayer"); } catch {}
      };
      try {
        const getElementById = Reflect.get(documentValue, "getElementById");
        const createElement = Reflect.get(documentValue, "createElement");
        const head = Reflect.get(documentValue, "head");
        if (typeof getElementById !== "function" || typeof createElement !== "function" ||
            (typeof head !== "object" && typeof head !== "function") || head === null) return;
        const occupied = Reflect.apply(getElementById, documentValue, [scriptId]);
        if (occupied !== null && occupied !== undefined) return;
        if (Reflect.getOwnPropertyDescriptor(root, "gtag") !== undefined ||
            Reflect.getOwnPropertyDescriptor(root, "dataLayer") !== undefined) return;

        const dataLayer = [];
        const gtag = function() { dataLayer.push(arguments); };
        localDataLayer = dataLayer;
        ownedDataLayer = dataLayer;
        if (Reflect.defineProperty(root, "dataLayer", {
          configurable: true, enumerable: true, value: dataLayer, writable: true
        }) !== true || Reflect.get(root, "dataLayer") !== dataLayer) {
          cleanup();
          return;
        }
        localGtag = gtag;
        ownedGtag = gtag;
        if (Reflect.defineProperty(root, "gtag", {
          configurable: true, enumerable: true, value: gtag, writable: true
        }) !== true || Reflect.get(root, "gtag") !== gtag) {
          cleanup();
          return;
        }
        if (config.consentInitial !== undefined) {
          const initial = Object.create(null);
          const mappings = [
            ["analyticsStorage", "analytics_storage"],
            ["adStorage", "ad_storage"],
            ["adUserData", "ad_user_data"],
            ["adPersonalization", "ad_personalization"],
          ];
          for (const [source, destination] of mappings) {
            const value = Reflect.get(config.consentInitial, source);
            if (value !== undefined) Reflect.defineProperty(initial, destination, {
              configurable: false, enumerable: true, value, writable: false,
            });
          }
          Reflect.apply(gtag, root, ["consent", "default", initial]);
        }
        Reflect.apply(gtag, root, ["js", new Date()]);
        const providerConfig = Object.create(null);
        if (config.config !== undefined) {
          for (const key of Reflect.ownKeys(config.config)) {
            if (typeof key === "string" && key !== "send_page_view") {
              Reflect.defineProperty(providerConfig, key, {
                configurable: false, enumerable: true,
                value: Reflect.get(config.config, key), writable: false,
              });
            }
          }
        }
        Reflect.defineProperty(providerConfig, "send_page_view", {
          configurable: false, enumerable: true, value: false, writable: false,
        });
        Reflect.apply(gtag, root, ["config", config.measurementId, providerConfig]);

        const script = Reflect.apply(createElement, documentValue, ["script"]);
        localScript = script;
        Reflect.set(script, "id", scriptId);
        Reflect.set(script, "src", config.scriptSrc);
        Reflect.set(script, "async", true);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-astro-analytics", "google-analytics-v1"]);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-measurement-id", config.measurementId]);
        localPageLoadListener = config.pageviews === "none" ? undefined : () => {
          if (!active || activeGeneration !== generation) return;
          const href = readHref();
          if (typeof href !== "string") return;
          if (vendorReady && !isPrerendering()) sendPageview(href, generation);
          else pendingPageviewUrl = href;
        };
        pageLoadListener = localPageLoadListener;
        if (typeof localPageLoadListener === "function") {
          const addEventListener = Reflect.get(documentValue, "addEventListener");
          if (typeof addEventListener === "function") {
            Reflect.apply(addEventListener, documentValue, ["astro:page-load", localPageLoadListener]);
          }
        }
        active = true;
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["load", () => {
          try {
            if (!active || activeGeneration !== generation || Reflect.get(root, "gtag") !== localGtag ||
                Reflect.get(root, "dataLayer") !== localDataLayer) {
              cleanup();
              return;
            }
            vendorReady = true;
            if (config.pageviews !== "none") {
              if (isPrerendering()) {
                const addEventListener = Reflect.get(documentValue, "addEventListener");
                if (typeof addEventListener !== "function") { cleanup(); return; }
                Reflect.apply(addEventListener, documentValue, ["prerenderingchange", () => {
                  try { flushPageview(generation); } catch { cleanup(); }
                }, { once: true }]);
              } else {
                flushPageview(generation);
              }
            }
          } catch {
            cleanup();
          }
        }, { once: true }]);
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["error", cleanup, { once: true }]);
        Reflect.apply(Reflect.get(head, "appendChild"), head, [script]);
      } catch {
        cleanup();
      }
    };
    const coordinator = Object.freeze({ run, runtimeToken: config.runtimeToken });
    if (Reflect.defineProperty(documentValue, coordinatorKey, {
      configurable: false, value: coordinator, writable: false
    }) !== true || Reflect.get(documentValue, coordinatorKey) !== coordinator) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // Provider failure must not prevent the page from rendering.
  }
})();`;
}

export function createMatomoBootstrapScript(
  options: MatomoRuntimeOptions,
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  const scriptId = ${JSON.stringify(MATOMO_SCRIPT_ID)};
  try {
    const root = globalThis;
    const documentValue = Reflect.get(root, "document");
    if ((typeof documentValue !== "object" && typeof documentValue !== "function") || documentValue === null) return;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:matomo:v1"]);
    if (typeof coordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(documentValue, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const keys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (keys.length === 2 && keys.includes("run") && keys.includes("runtimeToken") && typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
        }
        return;
      }
    } catch { return; }

    let active = false;
    let activeGeneration;
    let generationCounter = 0;
    let handler;
    let ownedMatomo;
    let ownedQueue;
    let vendorLoadProven = false;
    let vendorReady = false;
    let navigationObservationGap = false;
    let navigationObserverInstalled = false;
    let lastTrackedNavigationUrl;
    let vendorContextNavigationUrl;
    let pendingPageviewUrl;
    let pendingPageviewReferrer;
    const installHref = (() => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    })();
    const installTitle = (() => {
      try {
        const title = Reflect.get(documentValue, "title");
        return typeof title === "string" ? title : undefined;
      } catch { return undefined; }
    })();
    const installReferrer = (() => {
      try {
        const referrer = Reflect.get(documentValue, "referrer");
        return typeof referrer === "string" && referrer !== "" ? referrer : undefined;
      } catch { return undefined; }
    })();
    let completedNavigationUrl = installHref;
    let completedNavigationTitle = installTitle;
    let completedNavigationReferrer = installReferrer;
    const sameConfig = (value) => {
      try {
        return (typeof value === "object" || typeof value === "function") && value !== null &&
          Reflect.get(value, "consentMode") === config.consentMode &&
          Reflect.get(value, "eventCategory") === config.eventCategory &&
          Reflect.get(value, "events") === config.events &&
          Reflect.get(value, "pageviews") === config.pageviews &&
          Reflect.get(value, "runtimeToken") === config.runtimeToken &&
          Reflect.get(value, "scriptSrc") === config.scriptSrc &&
          Reflect.get(value, "siteId") === config.siteId &&
          Reflect.get(value, "trackerUrl") === config.trackerUrl;
      } catch { return false; }
    };
    const readHref = () => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    };
    const readTitle = () => {
      try {
        const title = Reflect.get(documentValue, "title");
        return typeof title === "string" ? title : undefined;
      } catch { return undefined; }
    };
    const isPrerendering = () => {
      try { return Reflect.get(documentValue, "prerendering") === true; } catch { return false; }
    };
    const ensureNavigationObserver = () => {
      if (navigationObserverInstalled) return true;
      try {
        const addEventListener = Reflect.get(documentValue, "addEventListener");
        if (typeof addEventListener !== "function") {
          navigationObservationGap = true;
          return false;
        }
        Reflect.apply(addEventListener, documentValue, ["astro:page-load", recordCompletedNavigation]);
        navigationObserverInstalled = true;
        return true;
      } catch {
        navigationObservationGap = true;
        return false;
      }
    };
    const matchesOwnedVendor = () => {
      try {
        if (!vendorLoadProven) return false;
        const queue = Reflect.get(root, "_paq");
        const matomo = Reflect.get(root, "Matomo");
        if (queue !== ownedQueue || matomo !== ownedMatomo ||
            Reflect.get(root, "Piwik") !== ownedMatomo || Reflect.get(root, "AnalyticsTracker") !== ownedMatomo ||
            (typeof queue !== "object" && typeof queue !== "function") || queue === null) return false;
        const push = Reflect.get(queue, "push");
        return typeof push === "function";
      } catch { return false; }
    };
    const hasUsableVendor = () => vendorReady && matchesOwnedVendor();
    const callQueue = (command) => {
      try {
        if (!hasUsableVendor()) return false;
        const queue = Reflect.get(root, "_paq");
        const push = Reflect.get(queue, "push");
        Reflect.apply(push, queue, [command]);
        return true;
      } catch {
        vendorReady = false;
        return false;
      }
    };
    const queueBeforeReady = (queue, command) => {
      try {
        const push = Reflect.get(queue, "push");
        if (typeof push !== "function") return false;
        Reflect.apply(push, queue, [command]);
        return true;
      } catch { return false; }
    };
    const applyVendorContext = (href, referrer, title) => {
      if (typeof href !== "string") return false;
      if (referrer === null) {
        if (!callQueue(["setReferrerUrl", ""])) return false;
      } else if (typeof referrer === "string" && !callQueue(["setReferrerUrl", referrer])) return false;
      if (!callQueue(["setCustomUrl", href])) return false;
      if (typeof title === "string" && !callQueue(["setDocumentTitle", title])) return false;
      vendorContextNavigationUrl = href;
      return true;
    };
    const sendPageview = (href, generation, explicitReferrer, explicitTitle) => {
      if (!active || activeGeneration !== generation || typeof href !== "string" || href === lastTrackedNavigationUrl) return;
      const referrerIsUnknown = explicitReferrer === null;
      let referrer = referrerIsUnknown
        ? null
        : typeof explicitReferrer === "string" ? explicitReferrer : lastTrackedNavigationUrl;
      if (!referrerIsUnknown && referrer === undefined) {
        try {
          const documentReferrer = Reflect.get(documentValue, "referrer");
          if (typeof documentReferrer === "string" && documentReferrer !== "") referrer = documentReferrer;
        } catch {}
      }
      const title = typeof explicitTitle === "string" ? explicitTitle : readTitle();
      if (!applyVendorContext(href, referrer, title)) return;
      if (callQueue(["trackPageView"])) lastTrackedNavigationUrl = href;
    };
    const flushCompletedNavigation = (generation) => {
      if (!active || activeGeneration !== generation || isPrerendering()) return;
      const href = readHref();
      if (typeof completedNavigationUrl !== "string" || href !== completedNavigationUrl) return;
      const pending = pendingPageviewUrl;
      const pendingReferrer = pendingPageviewReferrer;
      pendingPageviewUrl = undefined;
      pendingPageviewReferrer = undefined;
      if (config.pageviews === "none") {
        applyVendorContext(completedNavigationUrl, completedNavigationReferrer, completedNavigationTitle);
      } else if (typeof pending === "string" && pending === completedNavigationUrl) {
        sendPageview(pending, generation, pendingReferrer, completedNavigationTitle);
      }
    };
    const recordCompletedNavigation = () => {
      const href = readHref();
      if (typeof href !== "string") return;
      const closesObservationGap = navigationObservationGap;
      if (href !== completedNavigationUrl) {
        completedNavigationReferrer = closesObservationGap ? null : completedNavigationUrl;
        completedNavigationUrl = href;
      } else if (closesObservationGap) {
        completedNavigationReferrer = null;
      }
      completedNavigationTitle = readTitle();
      pendingPageviewUrl = href;
      pendingPageviewReferrer = completedNavigationReferrer;
      if (closesObservationGap) {
        navigationObservationGap = false;
        try { run(config); } catch {}
      }
      if (active && typeof activeGeneration === "number" && vendorReady) {
        flushCompletedNavigation(activeGeneration);
      }
    };
    const registerHandler = () => {
      if (!config.events || handler === undefined) return;
      try {
        const clientCoordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
        if (typeof clientCoordinatorKey !== "symbol") return;
        const clientCoordinator = Reflect.get(root, clientCoordinatorKey);
        const register = (typeof clientCoordinator === "object" || typeof clientCoordinator === "function") && clientCoordinator !== null
          ? Reflect.get(clientCoordinator, "register")
          : undefined;
        if (typeof register !== "function" || Reflect.get(clientCoordinator, "runtimeToken") !== config.runtimeToken) return;
        Reflect.apply(register, clientCoordinator, ["matomo", handler, config.runtimeToken]);
      } catch {}
    };
    const run = (nextConfig) => {
      if (!sameConfig(nextConfig)) return;
      if (!ensureNavigationObserver()) {
        registerHandler();
        return;
      }
      if (navigationObservationGap) {
        registerHandler();
        return;
      }
      if (active) {
        if (!vendorReady && matchesOwnedVendor()) {
          vendorReady = true;
          pendingPageviewUrl = completedNavigationUrl;
          pendingPageviewReferrer = completedNavigationReferrer;
          flushCompletedNavigation(activeGeneration);
        }
        registerHandler();
        return;
      }
      const generation = ++generationCounter;
      activeGeneration = generation;
      vendorLoadProven = false;
      vendorReady = false;
      vendorContextNavigationUrl = undefined;
      pendingPageviewUrl = completedNavigationUrl;
      pendingPageviewReferrer = completedNavigationReferrer;
      lastTrackedNavigationUrl = undefined;
      const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
      handler = Object.freeze({
        __astroAnalyticsBrand: brand,
        __astroAnalyticsProvider: "matomo",
        status() {
          if (consentPending) return "consent-pending";
          return activeGeneration === generation && active && hasUsableVendor()
            ? "ready"
            : "adapter-not-loaded";
        },
        track(name, properties) {
          try {
            if (consentPending) return { ok: false, reason: "consent-pending" };
            if (activeGeneration !== generation || !active || !hasUsableVendor()) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            if (config.pageviews === "none" && typeof completedNavigationUrl === "string" &&
                vendorContextNavigationUrl !== completedNavigationUrl &&
                !applyVendorContext(completedNavigationUrl, completedNavigationReferrer, completedNavigationTitle)) {
              return { ok: false, reason: "adapter-not-loaded" };
            }
            const hasEventName = properties !== undefined && Object.prototype.hasOwnProperty.call(properties, "_name");
            const eventName = hasEventName ? Reflect.get(properties, "_name") : undefined;
            if (hasEventName && (typeof eventName !== "string" || eventName.trim() === "")) {
              return { ok: false, reason: "invalid-event" };
            }
            const hasValue = properties !== undefined && Object.prototype.hasOwnProperty.call(properties, "_value");
            const value = hasValue ? Reflect.get(properties, "_value") : undefined;
            if (hasValue && (typeof value !== "number" || !Number.isFinite(value))) {
              return { ok: false, reason: "invalid-event" };
            }
            const command = ["trackEvent", config.eventCategory, name];
            if (hasEventName || hasValue) command.push(hasEventName ? eventName : "");
            if (hasValue) command.push(value);
            return callQueue(command)
              ? { ok: true }
              : { ok: false, reason: "adapter-not-loaded" };
          } catch { return { ok: false, reason: "adapter-not-loaded" }; }
        }
      });
      registerHandler();
      if (consentPending) return;

      let localMatomo;
      let localScript;
      let localQueue;
      let localQueueProxy;
      let localPiwik;
      let localTrackerAlias;
      let queueBinding;
      let matomoBinding;
      let piwikBinding;
      let trackerBinding;
      const installBinding = (name, initialValue, recordOwnedValue) => {
        let value = initialValue;
        const get = () => value;
        const set = (nextValue) => {
          value = nextValue;
          try {
            if (localScript !== undefined && Reflect.get(documentValue, "currentScript") === localScript) {
              Reflect.apply(recordOwnedValue, undefined, [nextValue]);
            }
          } catch {}
        };
        if (Reflect.defineProperty(root, name, {
          configurable: true, enumerable: true, get, set
        }) !== true) return undefined;
        const descriptor = Reflect.getOwnPropertyDescriptor(root, name);
        if (descriptor === undefined || descriptor.get !== get || descriptor.set !== set) return undefined;
        return Object.freeze({ get, read: get, set });
      };
      const releaseBinding = (name, binding, ownedValue) => {
        try {
          if (binding === undefined) return;
          const descriptor = Reflect.getOwnPropertyDescriptor(root, name);
          if (descriptor === undefined || descriptor.get !== binding.get || descriptor.set !== binding.set) return;
          const currentValue = Reflect.apply(binding.read, undefined, []);
          if (currentValue === ownedValue) Reflect.deleteProperty(root, name);
          else Reflect.defineProperty(root, name, {
            configurable: true, enumerable: true, value: currentValue, writable: true
          });
        } catch {}
      };
      const cleanup = () => {
        if (activeGeneration !== generation) return;
        active = false;
        activeGeneration = undefined;
        vendorLoadProven = false;
        vendorReady = false;
        pendingPageviewUrl = undefined;
        pendingPageviewReferrer = undefined;
        try {
          if ((typeof localScript === "object" || typeof localScript === "function") && localScript !== null) {
            const remove = Reflect.get(localScript, "remove");
            if (typeof remove === "function") Reflect.apply(remove, localScript, []);
          }
        } catch {}
        releaseBinding("_paq", queueBinding, localQueueProxy === undefined ? localQueue : localQueueProxy);
        releaseBinding("Matomo", matomoBinding, localMatomo);
        releaseBinding("Piwik", piwikBinding, localPiwik);
        releaseBinding("AnalyticsTracker", trackerBinding, localTrackerAlias);
      };
      try {
        const getElementById = Reflect.get(documentValue, "getElementById");
        const createElement = Reflect.get(documentValue, "createElement");
        const head = Reflect.get(documentValue, "head");
        if (typeof getElementById !== "function" || typeof createElement !== "function" ||
            (typeof head !== "object" && typeof head !== "function") || head === null) return;
        const occupied = Reflect.apply(getElementById, documentValue, [scriptId]);
        if (occupied !== null && occupied !== undefined) return;
        if (Reflect.getOwnPropertyDescriptor(root, "_paq") !== undefined ||
            Reflect.getOwnPropertyDescriptor(root, "Matomo") !== undefined ||
            Reflect.getOwnPropertyDescriptor(root, "Piwik") !== undefined ||
            Reflect.getOwnPropertyDescriptor(root, "AnalyticsTracker") !== undefined) return;

        const queue = [];
        localQueue = queue;
        ownedQueue = queue;
        queueBinding = installBinding("_paq", queue, (value) => { localQueueProxy = value; });
        matomoBinding = installBinding("Matomo", undefined, (value) => { localMatomo = value; });
        piwikBinding = installBinding("Piwik", undefined, (value) => { localPiwik = value; });
        trackerBinding = installBinding("AnalyticsTracker", undefined, (value) => { localTrackerAlias = value; });
        if (queueBinding === undefined || matomoBinding === undefined || piwikBinding === undefined || trackerBinding === undefined ||
            Reflect.get(root, "_paq") !== queue) {
          cleanup();
          return;
        }
        if (!queueBeforeReady(queue, ["setTrackerUrl", config.trackerUrl]) ||
            !queueBeforeReady(queue, ["setSiteId", config.siteId])) {
          cleanup();
          return;
        }
        const script = Reflect.apply(createElement, documentValue, ["script"]);
        localScript = script;
        Reflect.set(script, "id", scriptId);
        Reflect.set(script, "src", config.scriptSrc);
        Reflect.set(script, "async", true);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-astro-analytics", "matomo-v1"]);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-site-id", config.siteId]);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-tracker-url", config.trackerUrl]);
        active = true;
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["load", () => {
          try {
            const queueProxy = Reflect.get(root, "_paq");
            const matomo = Reflect.get(root, "Matomo");
            const piwik = Reflect.get(root, "Piwik");
            const trackerAlias = Reflect.get(root, "AnalyticsTracker");
            const queueKeys = (typeof queueProxy === "object" || typeof queueProxy === "function") && queueProxy !== null
              ? Reflect.ownKeys(queueProxy)
              : [];
            if (!active || activeGeneration !== generation || queueProxy === localQueue ||
                queueKeys.length !== 1 || queueKeys[0] !== "push" || typeof Reflect.get(queueProxy, "push") !== "function" ||
                (typeof matomo !== "object" && typeof matomo !== "function") || matomo === null ||
                piwik !== matomo || trackerAlias !== matomo || Reflect.get(matomo, "initialized") !== true ||
                typeof Reflect.get(matomo, "getAsyncTrackers") !== "function" ||
                localQueueProxy !== queueProxy || localMatomo !== matomo || localPiwik !== piwik || localTrackerAlias !== trackerAlias) {
              cleanup();
              return;
            }
            localQueueProxy = queueProxy;
            localMatomo = matomo;
            localPiwik = piwik;
            localTrackerAlias = trackerAlias;
            ownedQueue = queueProxy;
            ownedMatomo = matomo;
            vendorLoadProven = true;
            vendorReady = true;
            if (isPrerendering()) {
              const addEventListener = Reflect.get(documentValue, "addEventListener");
              if (typeof addEventListener !== "function") { cleanup(); return; }
              Reflect.apply(addEventListener, documentValue, ["prerenderingchange", () => {
                try { flushCompletedNavigation(generation); } catch { cleanup(); }
              }, { once: true }]);
            } else {
              flushCompletedNavigation(generation);
            }
          } catch { cleanup(); }
        }, { once: true }]);
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["error", cleanup, { once: true }]);
        Reflect.apply(Reflect.get(head, "appendChild"), head, [script]);
      } catch { cleanup(); }
    };
    const coordinator = Object.freeze({ run, runtimeToken: config.runtimeToken });
    if (Reflect.defineProperty(documentValue, coordinatorKey, {
      configurable: false, value: coordinator, writable: false
    }) !== true || Reflect.get(documentValue, coordinatorKey) !== coordinator) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // Provider failure must not prevent the page from rendering.
  }
})();`;
}

export function createUmamiBootstrapScript(
  options: UmamiRuntimeOptions,
): string {
  const serializedOptions = JSON.stringify(options);
  return `(() => {
  "use strict";
  const config = ${serializedOptions};
  const brand = ${JSON.stringify(RUNTIME_CLIENT_BRAND)};
  const scriptId = ${JSON.stringify(UMAMI_SCRIPT_ID)};
  try {
    const root = globalThis;
    const documentValue = Reflect.get(root, "document");
    if ((typeof documentValue !== "object" && typeof documentValue !== "function") || documentValue === null) return;
    const symbolValue = Reflect.get(root, "Symbol");
    if ((typeof symbolValue !== "object" && typeof symbolValue !== "function") || symbolValue === null) return;
    const symbolFor = Reflect.get(symbolValue, "for");
    if (typeof symbolFor !== "function") return;
    const coordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:umami:v1"]);
    if (typeof coordinatorKey !== "symbol") return;
    try {
      const existingCoordinator = Reflect.get(documentValue, coordinatorKey);
      if ((typeof existingCoordinator === "object" || typeof existingCoordinator === "function") && existingCoordinator !== null &&
          Reflect.get(existingCoordinator, "runtimeToken") === config.runtimeToken) {
        const keys = Reflect.ownKeys(existingCoordinator);
        const existingRun = Reflect.get(existingCoordinator, "run");
        if (keys.length === 2 && keys.includes("run") && keys.includes("runtimeToken") && typeof existingRun === "function") {
          Reflect.apply(existingRun, existingCoordinator, [config]);
        }
        return;
      }
    } catch { return; }

    let activeConfig;
    let activeGeneration;
    let generationCounter = 0;
    let handler;
    let lifecycle;
    let observerInstalled = false;
    let observationGap = false;
    let pendingPageview;
    let completedUrl;
    let completedReferrer;
    let completedTitle;
    let lastTrackedUrl;
    let vendorClient;
    let vendorScript;
    let vendorTrack;
    let vendorReady = false;

    const sameConfig = (value) => {
      try {
        return (typeof value === "object" || typeof value === "function") && value !== null &&
          Reflect.get(value, "consentMode") === config.consentMode &&
          Reflect.get(value, "events") === config.events &&
          Reflect.get(value, "hostUrl") === config.hostUrl &&
          Reflect.get(value, "pageviews") === config.pageviews &&
          Reflect.get(value, "runtimeToken") === config.runtimeToken &&
          Reflect.get(value, "scriptSrc") === config.scriptSrc &&
          Reflect.get(value, "websiteId") === config.websiteId;
      } catch { return false; }
    };
    const readHref = () => {
      try {
        const href = Reflect.get(Reflect.get(root, "location"), "href");
        return typeof href === "string" ? href : undefined;
      } catch { return undefined; }
    };
    const readTitle = () => {
      try {
        const title = Reflect.get(documentValue, "title");
        return typeof title === "string" ? title : "";
      } catch { return ""; }
    };
    const readDocumentReferrer = () => {
      try {
        const referrer = Reflect.get(documentValue, "referrer");
        return typeof referrer === "string" ? referrer : "";
      } catch { return ""; }
    };
    const isPrerendering = () => {
      try { return Reflect.get(documentValue, "prerendering") === true; } catch { return false; }
    };
    const hasClientRouter = () => {
      try {
        const querySelector = Reflect.get(documentValue, "querySelector");
        return typeof querySelector === "function" &&
          Reflect.apply(querySelector, documentValue, ['[name="astro-view-transitions-enabled"]']) !== null;
      } catch { return true; }
    };
    const registerHandler = () => {
      if (!config.events || handler === undefined) return;
      try {
        const clientCoordinatorKey = Reflect.apply(symbolFor, symbolValue, ["codeworkslabs.astro-analytics:client-coordinator:v2"]);
        if (typeof clientCoordinatorKey !== "symbol") return;
        const clientCoordinator = Reflect.get(root, clientCoordinatorKey);
        const register = (typeof clientCoordinator === "object" || typeof clientCoordinator === "function") && clientCoordinator !== null
          ? Reflect.get(clientCoordinator, "register")
          : undefined;
        if (typeof register !== "function" || Reflect.get(clientCoordinator, "runtimeToken") !== config.runtimeToken) return;
        Reflect.apply(register, clientCoordinator, ["umami", handler, config.runtimeToken]);
      } catch {}
    };
    const matchesConfiguredScript = () => {
      try {
        const script = vendorScript;
        if ((typeof script !== "object" && typeof script !== "function") || script === null ||
            Reflect.get(script, "ownerDocument") !== documentValue ||
            Reflect.get(script, "id") !== scriptId ||
            Reflect.get(script, "tagName") !== "SCRIPT" ||
            Reflect.get(script, "src") !== config.scriptSrc ||
            Reflect.get(script, "async") !== true ||
            Reflect.get(script, "defer") !== true ||
            Reflect.get(script, "noModule") !== false ||
            Reflect.get(script, "type") !== "") return false;
        const getElementById = Reflect.get(documentValue, "getElementById");
        const getAttribute = Reflect.get(script, "getAttribute");
        const getAttributeNames = Reflect.get(script, "getAttributeNames");
        if (typeof getElementById !== "function" || typeof getAttribute !== "function" ||
            typeof getAttributeNames !== "function" ||
            Reflect.apply(getAttribute, script, ["data-auto-pageview"]) !== "false" ||
            Reflect.apply(getAttribute, script, ["data-cwl-astro-analytics"]) !== "umami-v1" ||
            Reflect.apply(getAttribute, script, ["data-website-id"]) !== config.websiteId ||
            Reflect.apply(getAttribute, script, ["data-host-url"]) !==
              (typeof config.hostUrl === "string" ? config.hostUrl : null)) return false;
        const connected = Reflect.get(script, "isConnected") === true;
        const boundScript = Reflect.apply(getElementById, documentValue, [scriptId]);
        if (connected ? boundScript !== script : boundScript !== null) return false;
        const names = Reflect.apply(getAttributeNames, script, []);
        if (!Array.isArray(names)) return false;
        const dataNames = names.filter((name) => typeof name === "string" && name.startsWith("data-"));
        const expectedNames = ["data-auto-pageview", "data-cwl-astro-analytics", "data-website-id"];
        if (typeof config.hostUrl === "string") expectedNames.push("data-host-url");
        return dataNames.length === expectedNames.length &&
          expectedNames.every((name) => dataNames.includes(name));
      } catch { return false; }
    };
    const hasUsableVendor = () => {
      try {
        const current = Reflect.get(root, "umami");
        return vendorReady && matchesConfiguredScript() && current === vendorClient &&
          (typeof current === "object" || typeof current === "function") && current !== null &&
          Reflect.get(current, "track") === vendorTrack && typeof vendorTrack === "function";
      } catch { return false; }
    };
    const callUmami = (args) => {
      if (!hasUsableVendor()) return false;
      Reflect.apply(vendorTrack, vendorClient, args);
      return true;
    };
    const sendPageview = (pageview) => {
      try {
        if (!hasUsableVendor() || lifecycle?.active !== true || pageview === undefined ||
            pageview.url === lastTrackedUrl) return pageview?.url === lastTrackedUrl;
        const payload = (properties) => {
          const base = (typeof properties === "object" || typeof properties === "function") && properties !== null
            ? properties
            : {};
          return { ...base, url: pageview.url, title: pageview.title, referrer: pageview.referrer };
        };
        if (!callUmami([payload])) return false;
        lastTrackedUrl = pageview.url;
        return true;
      } catch { return false; }
    };
    const flushPageview = () => {
      if (lifecycle?.active !== true || isPrerendering()) return;
      const href = readHref();
      const pageview = pendingPageview;
      if (pageview === undefined) return;
      if (pageview.url !== href) return;
      if (sendPageview(pageview)) pendingPageview = undefined;
    };
    const recordPageLoad = () => {
      const href = readHref();
      if (typeof href !== "string") return;
      const referrer = observationGap
        ? ""
        : typeof completedUrl === "string" && completedUrl !== href
          ? completedUrl
          : completedReferrer ?? readDocumentReferrer();
      completedUrl = href;
      completedReferrer = referrer;
      completedTitle = readTitle();
      if (config.pageviews !== "none") {
        pendingPageview = Object.freeze({ referrer, title: completedTitle, url: href });
      }
      if (observationGap) {
        observationGap = false;
        try { run(config); } catch {}
        return;
      }
      if (vendorReady && lifecycle?.active === true && !isPrerendering()) flushPageview();
    };
    const recordInitialDocument = () => {
      if (typeof completedUrl !== "string") recordPageLoad();
    };
    const ensureObserver = () => {
      if (config.pageviews === "none" && !config.events) return true;
      if (observerInstalled) return !observationGap;
      try {
        const addEventListener = Reflect.get(documentValue, "addEventListener");
        if (typeof addEventListener !== "function") {
          observationGap = true;
          return false;
        }
        Reflect.apply(addEventListener, documentValue, ["astro:page-load", recordPageLoad]);
        if (!hasClientRouter()) {
          const readyState = Reflect.get(documentValue, "readyState");
          if (readyState === "interactive" || readyState === "complete") {
            recordInitialDocument();
          } else {
            Reflect.apply(addEventListener, documentValue, ["DOMContentLoaded", recordInitialDocument, { once: true }]);
          }
        }
        observerInstalled = true;
        return !observationGap;
      } catch {
        observationGap = true;
        return false;
      }
    };

    const run = (nextConfig) => {
      let cleanup;
      let generation;
      let lifecycleActive = false;
      try {
        if (!sameConfig(nextConfig)) return;
        if (activeConfig !== undefined) {
          if (lifecycle?.active === true) {
            registerHandler();
            if (vendorReady && !isPrerendering()) flushPageview();
            return;
          }
          activeConfig = undefined;
        }
        activeConfig = nextConfig;
        generation = ++generationCounter;
        activeGeneration = generation;
        vendorClient = undefined;
        vendorScript = undefined;
        vendorTrack = undefined;
        vendorReady = false;
        lastTrackedUrl = undefined;
        lifecycleActive = true;
        lifecycle = Object.freeze({ get active() { return lifecycleActive; } });
        const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
        handler = Object.freeze({
          __astroAnalyticsBrand: brand,
          __astroAnalyticsProvider: "umami",
          status() {
            if (activeGeneration !== generation || lifecycle.active !== true) return "adapter-not-loaded";
            if (consentPending) return "consent-pending";
            return hasUsableVendor() && typeof completedUrl === "string"
              ? "ready"
              : "adapter-not-loaded";
          },
          track(name, properties) {
            try {
              if (activeGeneration !== generation || lifecycle.active !== true || !hasUsableVendor()) {
                return { ok: false, reason: consentPending ? "consent-pending" : "adapter-not-loaded" };
              }
              if (typeof completedUrl !== "string") return { ok: false, reason: "adapter-not-loaded" };
              if (name.length > 50) return { ok: false, reason: "invalid-event" };
              let data;
              if (properties !== undefined) {
                const keys = Reflect.ownKeys(properties);
                if (keys.length > 50) return { ok: false, reason: "invalid-event" };
                data = Object.create(null);
                for (const key of keys) {
                  const value = Reflect.get(properties, key);
                  if (typeof value === "string" && value.length > 500) {
                    return { ok: false, reason: "invalid-event" };
                  }
                  if (typeof value === "number") {
                    const numeric = /^-?\\d+(?:\\.(\\d+))?(?:e([+-]?\\d+))?$/i.exec(String(value));
                    const decimalPlaces = numeric === null
                      ? 0
                      : (numeric[1]?.length ?? 0) - Number(numeric[2] ?? 0);
                    if (decimalPlaces > 4) return { ok: false, reason: "invalid-event" };
                  }
                  Reflect.defineProperty(data, key, {
                    configurable: false,
                    enumerable: true,
                    value,
                    writable: false,
                  });
                }
                Object.freeze(data);
              }
              const eventUrl = completedUrl;
              const eventTitle = completedTitle ?? "";
              const eventReferrer = completedReferrer ?? "";
              const payload = (properties) => {
                const base = (typeof properties === "object" || typeof properties === "function") && properties !== null
                  ? properties
                  : {};
                return data === undefined
                  ? { ...base, url: eventUrl, title: eventTitle, referrer: eventReferrer, name }
                  : { ...base, url: eventUrl, title: eventTitle, referrer: eventReferrer, name, data };
              };
              return callUmami([payload])
                ? { ok: true }
                : { ok: false, reason: "adapter-not-loaded" };
            } catch { return { ok: false, reason: "adapter-not-loaded" }; }
          }
        });
        registerHandler();
        if (consentPending) return;
        if (!ensureObserver()) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          return;
        }

        const getElementById = Reflect.get(documentValue, "getElementById");
        const createElement = Reflect.get(documentValue, "createElement");
        const head = Reflect.get(documentValue, "head");
        if (typeof getElementById !== "function" || typeof createElement !== "function" ||
            (typeof head !== "object" && typeof head !== "function") || head === null) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          return;
        }
        if (Reflect.apply(getElementById, documentValue, [scriptId]) !== null ||
            Reflect.getOwnPropertyDescriptor(root, "umami") !== undefined) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          return;
        }

        let boundValue;
        let assignedVendor;
        let script;
        const get = () => boundValue;
        const set = (value) => {
          boundValue = value;
          try {
            if (script !== undefined && Reflect.get(documentValue, "currentScript") === script &&
                matchesConfiguredScript()) assignedVendor = value;
          } catch {}
        };
        const releaseBinding = () => {
          try {
            const descriptor = Reflect.getOwnPropertyDescriptor(root, "umami");
            if (descriptor === undefined || descriptor.get !== get || descriptor.set !== set) return;
            if (boundValue === assignedVendor) Reflect.deleteProperty(root, "umami");
            else Reflect.defineProperty(root, "umami", {
              configurable: true, enumerable: true, value: boundValue, writable: true
            });
          } catch {}
        };
        const fail = () => {
          if (activeGeneration !== generation || !lifecycleActive) return;
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          vendorClient = undefined;
          vendorScript = undefined;
          vendorTrack = undefined;
          vendorReady = false;
          try {
            if ((typeof script === "object" || typeof script === "function") && script !== null) {
              const remove = Reflect.get(script, "remove");
              if (typeof remove === "function") Reflect.apply(remove, script, []);
            }
          } catch {}
          releaseBinding();
        };
        cleanup = fail;
        if (Reflect.defineProperty(root, "umami", {
          configurable: true, enumerable: true, get, set
        }) !== true) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
          return;
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(root, "umami");
        if (descriptor === undefined || descriptor.get !== get || descriptor.set !== set) {
          fail();
          return;
        }
        script = Reflect.apply(createElement, documentValue, ["script"]);
        vendorScript = script;
        Reflect.set(script, "id", scriptId);
        Reflect.set(script, "src", config.scriptSrc);
        Reflect.set(script, "async", true);
        Reflect.set(script, "defer", true);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-auto-pageview", "false"]);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-cwl-astro-analytics", "umami-v1"]);
        Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-website-id", config.websiteId]);
        if (typeof config.hostUrl === "string") {
          Reflect.apply(Reflect.get(script, "setAttribute"), script, ["data-host-url", config.hostUrl]);
        }
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["load", () => {
          try {
            if (activeGeneration !== generation || lifecycle.active !== true) return;
            const current = Reflect.get(root, "umami");
            const track = (typeof current === "object" || typeof current === "function") && current !== null
              ? Reflect.get(current, "track")
              : undefined;
            if (!matchesConfiguredScript() || current !== assignedVendor || typeof track !== "function") {
              fail();
              return;
            }
            vendorClient = current;
            vendorTrack = track;
            vendorReady = true;
            if (config.pageviews !== "none") {
              if (isPrerendering()) {
                const addEventListener = Reflect.get(documentValue, "addEventListener");
                if (typeof addEventListener !== "function") { fail(); return; }
                Reflect.apply(addEventListener, documentValue, ["prerenderingchange", () => {
                  if (activeGeneration === generation) flushPageview();
                }, { once: true }]);
              } else {
                flushPageview();
              }
            }
          } catch { fail(); }
        }, { once: true }]);
        Reflect.apply(Reflect.get(script, "addEventListener"), script, ["error", fail, { once: true }]);
        Reflect.apply(Reflect.get(head, "appendChild"), head, [script]);
      } catch {
        if (typeof cleanup === "function") cleanup();
        else if (activeGeneration === generation) {
          lifecycleActive = false;
          activeGeneration = undefined;
          activeConfig = undefined;
        }
      }
    };
    const coordinator = Object.freeze({ run, runtimeToken: config.runtimeToken });
    if (Reflect.defineProperty(documentValue, coordinatorKey, {
      configurable: false, value: coordinator, writable: false
    }) !== true || Reflect.get(documentValue, coordinatorKey) !== coordinator) return;
    Reflect.apply(run, coordinator, [config]);
  } catch {
    // Provider failure must not prevent the page from rendering.
  }
})();`;
}
