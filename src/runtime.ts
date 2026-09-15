export const RUNTIME_CLIENT_BRAND = "astro-analytics:client:v1";
export const FATHOM_SCRIPT_ID = "codeworkslabs-astro-analytics-fathom";
export const PLAUSIBLE_SCRIPT_ID = "codeworkslabs-astro-analytics-plausible";
export const GOOGLE_ANALYTICS_SCRIPT_ID = "codeworkslabs-astro-analytics-google-analytics";
export const MATOMO_SCRIPT_ID = "codeworkslabs-astro-analytics-matomo";
export const UMAMI_SCRIPT_ID = "codeworkslabs-astro-analytics-umami";

export interface AnalyticsRuntimeOptions {
  events: boolean;
  locationPolicyRequired?: boolean;
  providers: readonly string[];
  runtimeToken: string;
}

interface BaseRuntimeOptions {
  consentMode?: "immediate" | "deferred" | "external" | undefined;
  events: boolean;
  locationPolicyRequired?: boolean;
  pageviews: "provider" | "astro" | "none";
  runtimeToken: string;
  scriptSrc: string;
}

export interface FathomRuntimeOptions extends BaseRuntimeOptions {
  canonical?: boolean | undefined;
  honorDnt?: boolean | undefined;
  siteId: string;
}

export interface PlausibleRuntimeOptions extends BaseRuntimeOptions {
  captureOnLocalhost?: boolean | undefined;
  endpoint?: string | undefined;
}

export interface GoogleAnalyticsRuntimeOptions extends BaseRuntimeOptions {
  config?: Readonly<Record<string, string | number | boolean>> | undefined;
  consentInitial?: Readonly<{
    analyticsStorage: "granted" | "denied";
    adStorage?: "granted" | "denied";
    adUserData?: "granted" | "denied";
    adPersonalization?: "granted" | "denied";
  }> | undefined;
  consentMode: "immediate" | "deferred" | "external";
  measurementId: string;
}

export interface MatomoRuntimeOptions extends BaseRuntimeOptions {
  eventCategory: string;
  siteId: string;
  trackerUrl: string;
}

export interface UmamiRuntimeOptions extends BaseRuntimeOptions {
  hostUrl?: string | undefined;
  websiteId: string;
}

function serialize(value: unknown): string {
  const json = JSON.stringify(value);
  return `JSON.parse(${JSON.stringify(json)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")})`;
}

// Serialized into the page; keep this function self-contained.
function browserClientRuntime(config: any, brand: string): void {
  try {
    const root = globalThis as any;
    const key = Symbol.for("codeworkslabs.astro-analytics:client-coordinator:v3");
    const existing = root[key];
    if (existing) {
      if (existing.runtimeToken === config.runtimeToken && existing.sameProviders(config.providers)) {
        existing.enable(config.events === true);
      }
      return;
    }
    const providers = Object.freeze(Array.from(config.providers)) as string[];
    const handlers = new Map<string, any>();
    let eventsEnabled = config.events === true;
    const normalizedEvent = (name: unknown, properties: unknown) => {
      if (typeof name !== "string") return undefined;
      const eventName = name.trim();
      if (!eventName || eventName.length > 128) return undefined;
      if (properties === undefined) return { name: eventName, properties: undefined };
      if (!properties || typeof properties !== "object" || Array.isArray(properties))
        return undefined;
      const entries = Object.entries(properties);
      if (entries.length > 100) return undefined;
      const copy: Record<string, string | number | boolean> = {};
      for (const [key, value] of entries) {
        if (!key || key.length > 128 ||
            typeof value === "string" && value.length > 1024 ||
            typeof value === "number" && !Number.isFinite(value) ||
            typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return undefined;
        copy[key] = value as string | number | boolean;
      }
      return { name: eventName, properties: copy };
    };
    const client = Object.freeze({
      __astroAnalyticsBrand: brand,
      providers,
      status() {
        const statuses: Record<string, string> = {};
        for (const provider of providers) {
          const handler = handlers.get(provider);
          try { statuses[provider] = handler ? handler.status() : "adapter-not-loaded"; }
          catch { statuses[provider] = "adapter-not-loaded"; }
        }
        return Object.freeze(statuses);
      },
      track(name: string, properties?: Record<string, string | number | boolean>) {
        const results: Record<string, any> = {};
        const event = normalizedEvent(name, properties);
        if (!event) {
          for (const provider of providers) results[provider] = Object.freeze({ ok: false, reason: "invalid-event" });
          return { ok: false, providers: Object.freeze(results), reason: "invalid-event" };
        }
        let accepted = providers.length > 0;
        let failures = 0;
        let sharedReason: string | undefined;
        for (const provider of providers) {
          const handler = handlers.get(provider);
          let result;
          try {
            result = eventsEnabled && handler
              ? handler.track(event.name, event.properties)
              : { ok: false, reason: "adapter-not-loaded" };
          } catch { result = { ok: false, reason: "adapter-not-loaded" }; }
          if (!result || typeof result !== "object" ||
              result.ok !== true && (result.ok !== false ||
                !["adapter-not-loaded", "consent-pending", "invalid-event"].includes(result.reason))) {
            result = { ok: false, reason: "adapter-not-loaded" };
          }
          results[provider] = Object.freeze(result);
          if (!result.ok) {
            accepted = false;
            failures += 1;
            sharedReason = sharedReason === undefined ? result.reason
              : sharedReason === result.reason ? sharedReason : "";
          }
        }
        const frozen = Object.freeze(results);
        if (accepted) return { ok: true, providers: frozen };
        return failures === providers.length && sharedReason
          ? { ok: false, providers: frozen, reason: sharedReason }
          : { ok: false, providers: frozen };
      },
    });
    const installClient = () => {
      if (!eventsEnabled) return;
      if (root.astroAnalytics === undefined || root.astroAnalytics === client) root.astroAnalytics = client;
    };
    const coordinator = Object.freeze({
      enable(value: boolean) { eventsEnabled = eventsEnabled || value; installClient(); },
      register(provider: string, handler: any, token: string) {
        if (token !== config.runtimeToken || !providers.includes(provider) ||
            !handler || handler.__astroAnalyticsBrand !== brand ||
            handler.__astroAnalyticsProvider !== provider ||
            typeof handler.status !== "function" || typeof handler.track !== "function") return false;
        handlers.set(provider, handler);
        return true;
      },
      runtimeToken: config.runtimeToken,
      sameProviders(next: unknown) {
        return Array.isArray(next) && next.length === providers.length &&
          next.every((provider, index) => provider === providers[index]);
      },
    });
    Object.defineProperty(root, key, { value: coordinator });
    installClient();
  } catch {
    // Analytics must never break the host page.
  }
}

type BrowserAdapter = {
  name: string;
  scriptId: string;
  configureScript(script: any, config: any): void;
  prepare(root: any, config: any): boolean;
  ready(root: any, config: any): boolean;
  cleanup(root: any, config: any): void;
  pageview(root: any, route: any, config: any): boolean;
  context(root: any, route: any, config: any): boolean;
  event(root: any, name: string, properties: any, route: any, config: any): any;
};

// Serialized once per configured provider. Provider-specific behavior is supplied by adapter.
function browserProviderRuntime(config: any, adapter: BrowserAdapter, brand: string): void {
  try {
    const root = globalThis as any;
    const documentValue = root.document;
    if (!documentValue || typeof documentValue.addEventListener !== "function") return;
    const stateKey = Symbol.for(`codeworkslabs.astro-analytics:${adapter.name}:v2`);
    const existing = root[stateKey];
    if (existing) {
      if (existing.runtimeToken === config.runtimeToken && existing.identity === JSON.stringify(config)) {
        existing.register();
        existing.refresh();
      }
      return;
    }
    const policy = () => config.locationPolicyRequired === true
      ? root[Symbol.for("codeworkslabs.astro-analytics:location-policy:v1")]
      : undefined;
    const allowsUrl = (value: string) => {
      if (config.locationPolicyRequired !== true) return true;
      try { return policy()?.runtimeToken === config.runtimeToken && policy().allowsUrl(value) === true; }
      catch { return false; }
    };
    const locationAllowed = () => {
      if (config.locationPolicyRequired !== true) return true;
      try { return policy()?.runtimeToken === config.runtimeToken && policy().allowsCurrentLocation() === true; }
      catch { return false; }
    };
    const startupCompletion = () => {
      if (config.locationPolicyRequired !== true) return false;
      try { return policy()?.runtimeToken === config.runtimeToken && policy().startupPageLoadObserved() === true; }
      catch { return false; }
    };
    const readRoute = (previous?: any) => {
      if (!locationAllowed()) return undefined;
      try {
        const url = String(root.location.href);
        const title = typeof documentValue.title === "string" ? documentValue.title : "";
        let referrer = previous?.url;
        if (referrer === undefined && typeof documentValue.referrer === "string" &&
            documentValue.referrer !== "" && allowsUrl(documentValue.referrer)) referrer = documentValue.referrer;
        return Object.freeze({ url, title, referrer: referrer ?? "" });
      } catch { return undefined; }
    };
    let active = true;
    let ready = false;
    let script: any;
    let route: any;
    let pending: any;
    let inFlight = false;
    const consentPending = config.consentMode === "deferred" || config.consentMode === "external";
    const state = { identity: JSON.stringify(config), register, refresh: () => flush(), runtimeToken: config.runtimeToken };
    const handler = Object.freeze({
      __astroAnalyticsBrand: brand,
      __astroAnalyticsProvider: adapter.name,
      status() {
        try {
          if (consentPending) return "consent-pending";
          return active && ready && adapter.ready(root, config) ? "ready" : "adapter-not-loaded";
        } catch { return "adapter-not-loaded"; }
      },
      track(name: string, properties?: Record<string, string | number | boolean>) {
        try {
          if (consentPending) return { ok: false, reason: "consent-pending" };
          if (!active || !ready || !locationAllowed() || !adapter.ready(root, config))
            return { ok: false, reason: "adapter-not-loaded" };
          return adapter.event(root, name, properties, route, config);
        }
        catch { return { ok: false, reason: "adapter-not-loaded" }; }
      },
    });
    function register() {
      try {
        const coordinator = root[Symbol.for("codeworkslabs.astro-analytics:client-coordinator:v3")];
        coordinator?.register(adapter.name, handler, config.runtimeToken);
      } catch {}
    }
    const flush = () => {
      try {
        if (!active || !ready || inFlight || !pending || documentValue.prerendering === true ||
            !locationAllowed() || !adapter.ready(root, config)) return;
        route = pending;
        if (!adapter.context(root, route, config)) return;
        if (config.pageviews !== "none" && !adapter.pageview(root, route, config)) return;
        pending = undefined;
      } catch {
        // Retain the completed route for a later lifecycle retry.
      }
    };
    const complete = () => {
      inFlight = false;
      const next = readRoute(route);
      if (!next) { route = undefined; pending = undefined; return; }
      pending = next;
      flush();
    };
    const beforeNavigation = () => { inFlight = true; };
    const fail = () => {
      if (!active) return;
      active = false; ready = false; pending = undefined;
      try { script?.remove(); } catch {}
      try { adapter.cleanup(root, config); } catch {}
      try { documentValue.removeEventListener("astro:before-preparation", beforeNavigation); } catch {}
      try { documentValue.removeEventListener("astro:page-load", complete); } catch {}
      try { if (root[stateKey] === state) delete root[stateKey]; } catch {}
    };
    Object.defineProperty(root, stateKey, { configurable: true, value: state });
    try {
      register();
      documentValue.addEventListener("astro:before-preparation", beforeNavigation);
      documentValue.addEventListener("astro:page-load", complete);
      documentValue.addEventListener("prerenderingchange", flush);
      if (startupCompletion()) complete();
      if (consentPending) return;
      const hasClientRouter = typeof documentValue.querySelector === "function" &&
        documentValue.querySelector('[name="astro-view-transitions-enabled"]') !== null;
      if (!hasClientRouter && !route) pending = readRoute();
      if (!adapter.prepare(root, config)) { fail(); return; }
      script = documentValue.createElement("script");
      let selectedId = adapter.scriptId;
      for (let suffix = 0; documentValue.getElementById(selectedId); suffix += 1)
        selectedId = `${adapter.scriptId}-${suffix + 1}`;
      script.id = selectedId;
      script.src = config.scriptSrc;
      adapter.configureScript(script, config);
      script.addEventListener("load", () => {
        try {
          if (!active || !adapter.ready(root, config)) { fail(); return; }
          ready = true;
          flush();
        } catch { fail(); }
      });
      script.addEventListener("error", fail);
      documentValue.head.appendChild(script);
    } catch { fail(); }
  } catch {
    // Analytics must never break the host page.
  }
}

function fathomAdapter(): BrowserAdapter {
  return {
    name: "fathom", scriptId: "codeworkslabs-astro-analytics-fathom",
    configureScript(script, config) {
      script.async = false; script.defer = true;
      script.setAttribute("data-cwl-astro-analytics", "fathom-v2");
      script.setAttribute("data-site", config.siteId); script.setAttribute("data-auto", "false");
      if (config.honorDnt === true) script.setAttribute("data-honor-dnt", "true");
      if (config.canonical === false) script.setAttribute("data-canonical", "false");
    },
    prepare() { return true; }, cleanup() {}, context() { return true; },
    ready(root, config) {
      return !!root.fathom && (config.pageviews === "none" || typeof root.fathom.trackPageview === "function") &&
        (!config.events || typeof root.fathom.trackEvent === "function");
    },
    pageview(root, route) {
      const options: any = { url: route.url }; if (route.referrer) options.referrer = route.referrer;
      root.fathom.trackPageview(options); return true;
    },
    event(root, name, properties) {
      const value = properties?._value;
      if (value !== undefined && (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0))
        return { ok: false, reason: "invalid-event" };
      if (value === undefined) root.fathom.trackEvent(name);
      else root.fathom.trackEvent(name, { _value: value });
      return { ok: true };
    },
  };
}

function plausibleAdapter(): BrowserAdapter {
  let requestReferrer = "";
  let owned: any;
  return {
    name: "plausible", scriptId: "codeworkslabs-astro-analytics-plausible",
    configureScript(script) { script.async = true; script.defer = false; script.setAttribute("data-cwl-astro-analytics", "plausible-v2"); },
    prepare(root, config) {
      if (root.plausible !== undefined) return false;
      const queue: any[] = [];
      owned = (...args: any[]) => queue.push(args); owned.q = queue;
      owned.init = (options: any = {}) => { owned.o = options; };
      root.plausible = owned;
      owned.init({ autoCapturePageviews: false, captureOnLocalhost: config.captureOnLocalhost === true,
        ...(config.endpoint ? { endpoint: config.endpoint } : {}),
        transformRequest(payload: any) { if (payload && typeof payload === "object") payload.r = requestReferrer; return payload; } });
      return true;
    },
    cleanup(root) { if (root.plausible === owned) delete root.plausible; },
    ready(root) { return typeof root.plausible === "function" && root.plausible !== owned && root.plausible.l === true; },
    context(_root, route) { requestReferrer = route.referrer; return true; },
    pageview(root, route) { root.plausible("pageview", { url: route.url }); return true; },
    event(root, name, properties) {
      if (properties && Object.keys(properties).length > 30) return { ok: false, reason: "invalid-event" };
      const props = properties && Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, String(value)]));
      root.plausible(name, props ? { props } : undefined); return { ok: true };
    },
  };
}

function googleAdapter(): BrowserAdapter {
  let dataLayer: any[] | undefined;
  let gtag: any;
  const validName = (value: string) => Array.from(value).length <= 40 && /^[\p{L}][\p{L}\p{N}_]*$/u.test(value) &&
    !["firebase_", "ga_", "google_"].some((prefix) => value.toLowerCase().startsWith(prefix));
  return {
    name: "google-analytics", scriptId: "codeworkslabs-astro-analytics-google-analytics",
    configureScript(script, config) {
      script.async = true; script.defer = false;
      script.setAttribute("data-cwl-astro-analytics", "google-analytics-v2");
      script.setAttribute("data-measurement-id", config.measurementId);
    },
    prepare(root, config) {
      if (root.gtag !== undefined || root.dataLayer !== undefined) return false;
      dataLayer = [];
      gtag = function() { dataLayer?.push(arguments); };
      root.dataLayer = dataLayer; root.gtag = gtag;
      if (config.consentInitial) {
        const initial: any = {};
        const names: Record<string, string> = { analyticsStorage: "analytics_storage", adStorage: "ad_storage", adUserData: "ad_user_data", adPersonalization: "ad_personalization" };
        for (const [source, target] of Object.entries(names)) if (config.consentInitial[source] !== undefined) initial[target] = config.consentInitial[source];
        gtag("consent", "default", initial);
      }
      gtag("js", new Date());
      gtag("config", config.measurementId, { ...(config.config ?? {}), send_page_view: false, page_referrer: "" });
      return true;
    },
    cleanup(root) { if (root.gtag === gtag) delete root.gtag; if (root.dataLayer === dataLayer) delete root.dataLayer; },
    ready(root) { return root.gtag === gtag && root.dataLayer === dataLayer; }, context() { return true; },
    pageview(root, route, config) {
      root.gtag("event", "page_view", { page_location: route.url, page_title: route.title, page_referrer: route.referrer, send_to: config.measurementId }); return true;
    },
    event(root, name, properties, _route, config) {
      if (!validName(name) || (properties && Object.keys(properties).length > 25) || properties?.send_to !== undefined)
        return { ok: false, reason: "invalid-event" };
      for (const [key, value] of Object.entries(properties ?? {}))
        if (!validName(key) || typeof value === "string" && Array.from(value).length > 100)
          return { ok: false, reason: "invalid-event" };
      root.gtag("event", name, { ...(properties ?? {}), send_to: config.measurementId }); return { ok: true };
    },
  };
}

function matomoAdapter(): BrowserAdapter {
  let queue: any;
  const push = (command: any[]) => { queue.push(command); return true; };
  return {
    name: "matomo", scriptId: "codeworkslabs-astro-analytics-matomo",
    configureScript(script) { script.async = true; script.defer = false; script.setAttribute("data-cwl-astro-analytics", "matomo-v2"); },
    prepare(root, config) {
      if (root._paq !== undefined) return false;
      queue = []; root._paq = queue; push(["setTrackerUrl", config.trackerUrl]); push(["setSiteId", config.siteId]); return true;
    },
    cleanup(root) { if (root._paq === queue) delete root._paq; },
    ready(root) { return root._paq === queue || !!root._paq && typeof root._paq.push === "function"; },
    context(root, route) {
      queue = root._paq; push(["setCustomUrl", route.url]); push(["setDocumentTitle", route.title]); push(["setReferrerUrl", route.referrer]); return true;
    },
    pageview() { push(["trackPageView"]); return true; },
    event(root, name, properties, route, config) {
      if (route) this.context(root, route, config);
      const label = properties?._name; const value = properties?._value;
      if (label !== undefined && (typeof label !== "string" || label.length === 0) ||
          value !== undefined && (typeof value !== "number" || !Number.isFinite(value))) return { ok: false, reason: "invalid-event" };
      const command: any[] = ["trackEvent", config.eventCategory, name];
      if (label !== undefined || value !== undefined) command.push(label ?? "");
      if (value !== undefined) command.push(value);
      push(command); return { ok: true };
    },
  };
}

function umamiAdapter(): BrowserAdapter {
  return {
    name: "umami", scriptId: "codeworkslabs-astro-analytics-umami",
    configureScript(script, config) {
      script.async = true; script.defer = false;
      script.setAttribute("data-cwl-astro-analytics", "umami-v2");
      script.setAttribute("data-website-id", config.websiteId); script.setAttribute("data-auto-pageview", "false");
      if (config.hostUrl) script.setAttribute("data-host-url", config.hostUrl);
    },
    prepare(root) { return root.umami === undefined; }, cleanup() {}, context() { return true; },
    ready(root) { return !!root.umami && typeof root.umami.track === "function"; },
    pageview(root, route) {
      root.umami.track((payload: any) => ({ ...payload, url: route.url, title: route.title, referrer: route.referrer })); return true;
    },
    event(root, name, properties, route) {
      if (Array.from(name).length > 50 || properties && Object.keys(properties).length > 50) return { ok: false, reason: "invalid-event" };
      for (const value of Object.values(properties ?? {}))
        if (typeof value === "string" && Array.from(value).length > 500 ||
            typeof value === "number" && Math.round(value * 10_000) !== value * 10_000)
          return { ok: false, reason: "invalid-event" };
      root.umami.track((payload: any) => ({ ...payload, name, data: properties, url: route?.url, title: route?.title, referrer: route?.referrer }));
      return { ok: true };
    },
  };
}

function providerScript(options: unknown, factory: () => BrowserAdapter): string {
  return `(${browserProviderRuntime.toString()})(${serialize(options)},(${factory.toString()})(),${JSON.stringify(RUNTIME_CLIENT_BRAND)});`;
}

export function createBootstrapScript(options: AnalyticsRuntimeOptions = { events: true, providers: ["fathom"], runtimeToken: "test-runtime-token" }): string {
  return `(${browserClientRuntime.toString()})(${serialize(options)},${JSON.stringify(RUNTIME_CLIENT_BRAND)});`;
}

export const createFathomBootstrapScript = (options: FathomRuntimeOptions): string => providerScript(options, fathomAdapter);
export const createPlausibleBootstrapScript = (options: PlausibleRuntimeOptions): string => providerScript(options, plausibleAdapter);
export const createGoogleAnalyticsBootstrapScript = (options: GoogleAnalyticsRuntimeOptions): string => providerScript(options, googleAdapter);
export const createMatomoBootstrapScript = (options: MatomoRuntimeOptions): string => providerScript(options, matomoAdapter);
export const createUmamiBootstrapScript = (options: UmamiRuntimeOptions): string => providerScript(options, umamiAdapter);
