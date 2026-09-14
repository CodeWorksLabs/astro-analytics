import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import type { AstroIntegration } from "astro";
import astroAnalytics from "../src/index.ts";
import {
  createBootstrapScript,
  createFathomBootstrapScript,
  createGoogleAnalyticsBootstrapScript,
  createMatomoBootstrapScript,
  createPlausibleBootstrapScript,
  createUmamiBootstrapScript,
  FATHOM_SCRIPT_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  MATOMO_SCRIPT_ID,
  PLAUSIBLE_SCRIPT_ID,
  RUNTIME_CLIENT_BRAND,
  UMAMI_SCRIPT_ID,
} from "../src/runtime.ts";

type SetupHook = NonNullable<
  AstroIntegration["hooks"]["astro:config:setup"]
>;
type SetupContext = Parameters<SetupHook>[0];

function runSetup(
  integration: ReturnType<typeof astroAnalytics>,
  command: SetupContext["command"],
  injected: string[],
): void {
  const hook = integration.hooks["astro:config:setup"];
  if (!hook) throw new Error("astro:config:setup hook is missing");
  hook({
    command,
    injectScript(stage, content) {
      injected.push(`${stage}:${content}`);
    },
  } as SetupContext);
}

function serializeGtagCommand(value: ArrayLike<unknown>): unknown[] {
  return JSON.parse(JSON.stringify(Array.from(value))) as unknown[];
}

function executeBootstrap(context: vm.Context): void {
  vm.runInNewContext(createBootstrapScript(), context, { timeout: 1_000 });
}

const simulatedFathomVendorKey = Symbol("simulated-fathom-vendor");

function executeFathomBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createFathomBootstrapScript>[0]> = {},
): void {
  try { if (context.document && context.document.readyState === undefined) Reflect.set(context.document, "readyState", "complete"); } catch {}
  const options = {
    events: true,
    pageviews: "provider" as const,
    runtimeToken: "test-runtime-token",
    scriptSrc: "https://cdn.usefathom.com/script.js",
    siteId: "ABCDEFG",
    ...overrides,
  };
  if (options.events) {
    vm.runInNewContext(
      createBootstrapScript({
        events: true,
        providers: ["fathom"],
        runtimeToken: options.runtimeToken,
      }),
      context,
      { timeout: 1_000 },
    );
  }
  const documentValue = context.document as Record<PropertyKey, unknown> | undefined;
  const coordinatorPresent = documentValue !== undefined && Reflect.ownKeys(documentValue).some((key) =>
    typeof key === "symbol" && Symbol.keyFor(key) === "codeworkslabs.astro-analytics:fathom-coordinator:v1");
  const initialDescriptor = Reflect.getOwnPropertyDescriptor(context, "fathom");
  const initialVendor = !coordinatorPresent && initialDescriptor !== undefined && "value" in initialDescriptor
    ? initialDescriptor.value
    : undefined;
  if (initialVendor !== undefined) {
    Reflect.set(context, simulatedFathomVendorKey, initialVendor);
    Reflect.deleteProperty(context, "fathom");
  }
  const simulatedVendor = Reflect.get(context, simulatedFathomVendorKey);
  vm.runInNewContext(
    createFathomBootstrapScript(options),
    context,
    { timeout: 1_000 },
  );
  if (simulatedVendor !== undefined && documentValue !== undefined) {
    const getElementById = documentValue.getElementById;
    const script = typeof getElementById === "function"
      ? Reflect.apply(getElementById, documentValue, [FATHOM_SCRIPT_ID]) as Record<string, unknown> | null
      : null;
    if (script !== null) {
      documentValue.currentScript = script;
      context.fathom = simulatedVendor;
      documentValue.currentScript = undefined;
    }
  }
}

function executePlausibleBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createPlausibleBootstrapScript>[0]> = {},
): void {
  try { if (context.document && context.document.readyState === undefined) Reflect.set(context.document, "readyState", "complete"); } catch {}
  const options = {
    events: true,
    pageviews: "provider" as const,
    runtimeToken: "test-runtime-token",
    scriptSrc: "https://plausible.example/js/pa-TEST.js",
    ...overrides,
  };
  if (options.events) {
    vm.runInNewContext(
      createBootstrapScript({
        events: true,
        providers: ["plausible"],
        runtimeToken: options.runtimeToken,
      }),
      context,
      { timeout: 1_000 },
    );
  }
  vm.runInNewContext(
    createPlausibleBootstrapScript(options),
    context,
    { timeout: 1_000 },
  );
}

function executeGoogleAnalyticsBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createGoogleAnalyticsBootstrapScript>[0]> = {},
): void {
  try { if (context.document && context.document.readyState === undefined) Reflect.set(context.document, "readyState", "complete"); } catch {}
  const options = {
    consentInitial: {
      analyticsStorage: "granted" as const,
      adStorage: "denied" as const,
      adUserData: "denied" as const,
      adPersonalization: "denied" as const,
    },
    consentMode: "immediate" as const,
    events: true,
    measurementId: "G-TEST123",
    pageviews: "provider" as const,
    runtimeToken: "test-runtime-token",
    scriptSrc: "https://www.googletagmanager.com/gtag/js?id=G-TEST123",
    ...overrides,
  };
  if (options.events) {
    vm.runInNewContext(
      createBootstrapScript({
        events: true,
        providers: ["google-analytics"],
        runtimeToken: options.runtimeToken,
      }),
      context,
      { timeout: 1_000 },
    );
  }
  vm.runInNewContext(
    createGoogleAnalyticsBootstrapScript(options),
    context,
    { timeout: 1_000 },
  );
}

function executeMatomoBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createMatomoBootstrapScript>[0]> = {},
): void {
  try { if (context.document && context.document.readyState === undefined) Reflect.set(context.document, "readyState", "complete"); } catch {}
  const options = {
    eventCategory: "Astro",
    events: true,
    pageviews: "provider" as const,
    runtimeToken: "test-runtime-token",
    scriptSrc: "https://analytics.example/matomo.js",
    siteId: "1",
    trackerUrl: "https://analytics.example/matomo.php",
    ...overrides,
  };
  if (options.events) {
    vm.runInNewContext(
      createBootstrapScript({
        events: true,
        providers: ["matomo"],
        runtimeToken: options.runtimeToken,
      }),
      context,
      { timeout: 1_000 },
    );
  }
  vm.runInNewContext(createMatomoBootstrapScript(options), context, {
    timeout: 1_000,
  });
}

function executeUmamiBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createUmamiBootstrapScript>[0]> = {},
): void {
  const options = {
    events: true,
    pageviews: "provider" as const,
    runtimeToken: "test-runtime-token",
    scriptSrc: "https://analytics.example/script.js",
    websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
    ...overrides,
  };
  if (options.events) {
    vm.runInNewContext(
      createBootstrapScript({
        events: true,
        providers: ["umami"],
        runtimeToken: options.runtimeToken,
      }),
      context,
      { timeout: 1_000 },
    );
  }
  vm.runInNewContext(createUmamiBootstrapScript(options), context, {
    timeout: 1_000,
  });
}

function activatePlausible(
  context: vm.Context,
  script: Record<string, unknown>,
  calls: unknown[][] = [],
): unknown[][] {
  const plausible = (...args: unknown[]) => { calls.push(args); };
  Object.defineProperty(plausible, "l", { value: true });
  (context.document as Record<string, unknown>).currentScript = script;
  context.plausible = plausible;
  (context.document as Record<string, unknown>).currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  return calls;
}

function activateFathom(
  context: vm.Context,
  script: Record<string, unknown>,
  fathom: Record<string, unknown>,
): void {
  (context.document as Record<string, unknown>).currentScript = script;
  context.fathom = fathom;
  (context.document as Record<string, unknown>).currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
}

function activateMatomo(
  context: vm.Context,
  script: Record<string, unknown>,
): unknown[][] {
  const commands = JSON.parse(JSON.stringify(context._paq)) as unknown[][];
  const queueProxy = {
    push(command: unknown[]) {
      commands.push(command);
    },
  };
  const matomo = {
    initialized: true,
    getAsyncTrackers() { return []; },
  };
  (context.document as Record<string, unknown>).currentScript = script;
  context._paq = queueProxy;
  context.Matomo = matomo;
  context.Piwik = matomo;
  context.AnalyticsTracker = matomo;
  (context.document as Record<string, unknown>).currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  return commands;
}

function activateUmami(
  context: vm.Context,
  script: Record<string, unknown>,
  calls: unknown[][] = [],
): unknown[][] {
  const umami = {
    track(...args: unknown[]) { calls.push(args); },
  };
  (context.document as Record<string, unknown>).currentScript = script;
  context.umami = umami;
  (context.document as Record<string, unknown>).currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  return calls;
}

function createDocumentHarness(existingById?: Record<string, unknown> | Record<string, unknown>[]): {
  appended: Record<string, unknown>[];
  document: Record<string, unknown>;
  documentListeners: Map<string, Array<() => void>>;
} {
  const appended: Record<string, unknown>[] = [];
  const existingElements = existingById === undefined
    ? []
    : Array.isArray(existingById) ? existingById : [existingById];
  const documentListeners = new Map<string, Array<() => void>>();
  const document = {
    addEventListener(name: string, listener: () => void) {
      const listeners = documentListeners.get(name) ?? [];
      listeners.push(listener);
      documentListeners.set(name, listeners);
    },
    removeEventListener(name: string, listener: () => void) {
      const listeners = documentListeners.get(name) ?? [];
      documentListeners.set(name, listeners.filter((candidate) => candidate !== listener));
    },
    createElement(tag: string) {
      assert.equal(tag, "script");
      const attributes: Record<string, string> = {};
      const listeners = new Map<string, Array<() => void>>();
      return {
        async: true,
        attributes,
        defer: false,
        isConnected: false,
        listeners,
        noModule: false,
        ownerDocument: this,
        tagName: "SCRIPT",
        type: "",
        addEventListener(name: string, listener: () => void) {
          const registered = listeners.get(name) ?? [];
          registered.push(listener);
          listeners.set(name, registered);
        },
        remove() {
          this.isConnected = false;
        },
        getAttribute(name: string) {
          return attributes[name] ?? null;
        },
        getAttributeNames() {
          return Object.keys(attributes);
        },
        setAttribute(name: string, value: string) {
          attributes[name] = value;
        },
      };
    },
    getElementById(id: string) {
      const existing = existingElements.find((element) => element.id === id);
      if (existing !== undefined) return existing;
      return appended.find((script) => script.id === id && script.isConnected === true) ?? null;
    },
    head: {
      appendChild(script: Record<string, unknown>) {
        script.isConnected = true;
        appended.push(script);
      },
    },
  };
  return { appended, document, documentListeners };
}

test("Plausible pageviews inject without the optional event client", () => {
  const injected: string[] = [];
  runSetup(
    astroAnalytics({
      provider: {
        name: "plausible",
        scriptSrc: "https://plausible.example/script.js",
      },
      events: false,
    }),
    "build",
    injected,
  );
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /plausible-v1/);
});

test("Google Analytics injects without the optional event client", () => {
  const injected: string[] = [];
  runSetup(
    astroAnalytics({
      provider: {
        name: "google-analytics",
        measurementId: "G-TEST123",
        consent: { mode: "immediate" },
      },
      events: false,
    }),
    "build",
    injected,
  );
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /google-analytics-v1/);
  assert.match(injected[0] ?? "", /G-TEST123/);
});

test("Matomo injects without the optional event client", () => {
  const injected: string[] = [];
  runSetup(
    astroAnalytics({
      provider: {
        name: "matomo",
        trackerUrl: "https://analytics.example/matomo.php",
        siteId: "1",
        eventCategory: "Astro",
      },
      events: false,
    }),
    "build",
    injected,
  );
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /matomo-v1/);
  assert.match(injected[0] ?? "", /https:\/\/analytics\.example\/matomo\.php/);
});

test("Umami injects without the optional event client", () => {
  const injected: string[] = [];
  runSetup(
    astroAnalytics({
      provider: {
        name: "umami",
        websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
        scriptSrc: "https://analytics.example/script.js",
      },
      events: false,
    }),
    "build",
    injected,
  );
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /umami-v1/);
  assert.match(injected[0] ?? "", /e676c9b4-11e4-4ef1-a4d7-87001773e9f2/);
});

test("Umami maps ready same-URL completions and bounded events", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      referrer: "https://search.example/",
      title: "Landing",
    }),
    location: { href: "https://example.test/landing/" },
  };
  executeUmamiBootstrap(context, { hostUrl: "https://analytics.example/" });
  assert.equal(harness.appended.length, 1);
  const script = harness.appended[0] ?? {};
  assert.equal(script.id, UMAMI_SCRIPT_ID);
  assert.equal(script.src, "https://analytics.example/script.js");
  assert.equal(script.async, true);
  assert.equal(script.defer, true);
  assert.deepEqual(script.attributes, {
    "data-auto-pageview": "false",
    "data-cwl-astro-analytics": "umami-v1",
    "data-host-url": "https://analytics.example/",
    "data-website-id": "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    umami: "adapter-not-loaded",
  });

  const calls = activateUmami(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    umami: "adapter-not-loaded",
  });
  assert.equal(calls.length, 0);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    umami: "ready",
  });
  assert.equal(calls.length, 1);
  const pageviewPayload = calls[0]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(pageviewPayload({ website: "site", hostname: "example.test" }))), {
    website: "site",
    hostname: "example.test",
    url: "https://example.test/landing/",
    title: "Landing",
    referrer: "https://search.example/",
  });
  const eventResult = vm.runInNewContext(
    'astroAnalytics.track("signup", { plan: "pro", price: 29.99, member: true })',
    context,
  );
  assert.deepEqual(JSON.parse(JSON.stringify(eventResult)), {
    ok: true,
    providers: { umami: { ok: true } },
  });
  const eventPayload = calls[1]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(eventPayload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/landing/",
    title: "Landing",
    referrer: "https://search.example/",
    name: "signup",
    data: { plan: "pro", price: 29.99, member: true },
  });

  context.location.href = "https://example.test/next/";
  context.document.title = "Next";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 3);
  const nextPayload = calls[2]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(nextPayload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/next/",
    title: "Next",
    referrer: "https://example.test/landing/",
  });

  context.document.title = "Next refreshed";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 4);
  const repeatedUrlPayload = calls[3]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(repeatedUrlPayload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/next/",
    title: "Next refreshed",
    referrer: "https://example.test/next/",
  });
});

test("Umami establishes an ordinary MPA initial route at document readiness", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      readyState: "loading",
      referrer: "https://search.example/",
      title: "MPA landing",
    }),
    location: { href: "https://example.test/landing/" },
  };
  executeUmamiBootstrap(context);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  assert.equal(calls.length, 0);
  assert.equal(context.astroAnalytics.status().umami, "adapter-not-loaded");
  context.document.readyState = "interactive";
  harness.documentListeners.get("DOMContentLoaded")?.[0]?.();
  assert.equal(calls.length, 1);
  assert.equal(context.astroAnalytics.status().umami, "ready");
  const payload = calls[0]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(payload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/landing/",
    title: "MPA landing",
    referrer: "https://search.example/",
  });
});

test("Umami waits for ClientRouter page-load instead of using document readiness", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      querySelector(selector: string) {
        return selector === '[name="astro-view-transitions-enabled"]' ? {} : null;
      },
      readyState: "complete",
      title: "Router landing",
    }),
    location: { href: "https://example.test/router/" },
  };
  executeUmamiBootstrap(context);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  assert.equal(calls.length, 0);
  assert.equal(context.astroAnalytics.status().umami, "adapter-not-loaded");
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 1);
  assert.equal(context.astroAnalytics.status().umami, "ready");
});

test("Umami enforces provider event limits without disturbing other providers", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context, { pageviews: "none" });
  const calls = activateUmami(context, harness.appended[0] ?? {});
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const results = [
    vm.runInNewContext(`astroAnalytics.track("${"x".repeat(51)}")`, context),
    vm.runInNewContext('astroAnalytics.track("too-many", Object.fromEntries(Array.from({ length: 51 }, (_, index) => [`p${index}`, index])))', context),
    vm.runInNewContext('astroAnalytics.track("long-string", { value: "x".repeat(501) })', context),
    vm.runInNewContext('astroAnalytics.track("precision", { value: 1.23456 })', context),
  ];
  for (const result of results) {
    assert.deepEqual(JSON.parse(JSON.stringify(result)), {
      ok: false,
      providers: { umami: { ok: false, reason: "invalid-event" } },
      reason: "invalid-event",
    });
  }
  assert.equal(calls.length, 0);
});

test("Umami none mode suppresses pageviews while retaining events", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { readyState: "complete" }),
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context, { pageviews: "none" });
  assert.equal(harness.documentListeners.has("astro:page-load"), true);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  assert.equal(calls.length, 0);
  assert.equal(context.astroAnalytics.status().umami, "ready");
  assert.equal(context.astroAnalytics.track("event-only").ok, true);
  const payload = calls[0]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(payload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/",
    title: "",
    referrer: "",
    name: "event-only",
  });
});

test("Umami deduplicates matching bootstrap reentry while its tracker is loading", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context);
  executeUmamiBootstrap(context);
  assert.equal(harness.appended.length, 1);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 1);
  assert.equal(context.astroAnalytics.track("after-reentry").ok, true);
});

test("Umami rejects and preserves an unrelated assignment made while its tracker loads", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context);
  const script = harness.appended[0] ?? {};
  const unrelated = { track() {} };
  context.umami = unrelated;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(script.isConnected, false);
  assert.equal(context.umami, unrelated);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    umami: "adapter-not-loaded",
  });
});

test("Umami rejects mutated source, website, host, pageview, type, and DOM identity before execution", () => {
  const cases: Array<{
    hostUrl?: string;
    mutate(script: Record<string, any>): void;
  }> = [
    { mutate: (script) => { script.src = "https://foreign.example/script.js"; } },
    { mutate: (script) => { script.attributes["data-website-id"] = "00000000-0000-0000-0000-000000000001"; } },
    { mutate: (script) => { script.attributes["data-auto-pageview"] = "true"; } },
    {
      hostUrl: "https://analytics.example/",
      mutate: (script) => { script.attributes["data-host-url"] = "https://foreign.example/"; },
    },
    { mutate: (script) => { script.attributes["data-auto-track"] = "false"; } },
    { mutate: (script) => { script.type = "module"; } },
  ];

  for (const testCase of cases) {
    const harness = createDocumentHarness();
    const context: vm.Context = {
      document: harness.document,
      location: { href: "https://example.test/" },
    };
    executeUmamiBootstrap(context, { hostUrl: testCase.hostUrl });
    const script = harness.appended[0] ?? {};
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    testCase.mutate(script);
    activateUmami(context, script);
    assert.equal(script.isConnected, false);
    assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
      umami: "adapter-not-loaded",
    });
  }
});

test("Umami closes and restores readiness with its exact post-load script identity", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context, { pageviews: "none" });
  const script = harness.appended[0] ?? {};
  activateUmami(context, script);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(context.astroAnalytics.status().umami, "ready");

  const attributes = script.attributes as Record<string, string>;
  const websiteId = attributes["data-website-id"];
  attributes["data-website-id"] = "00000000-0000-0000-0000-000000000001";
  assert.equal(context.astroAnalytics.status().umami, "adapter-not-loaded");
  attributes["data-website-id"] = websiteId ?? "";
  assert.equal(context.astroAnalytics.status().umami, "ready");

  const src = script.src;
  script.src = "https://foreign.example/script.js";
  assert.equal(context.astroAnalytics.status().umami, "adapter-not-loaded");
  script.src = src;
  assert.equal(context.astroAnalytics.status().umami, "ready");
});

test("Umami retains proven readiness across Astro head disposal but rejects a replacement binding", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a" },
  };
  executeUmamiBootstrap(context);
  const script = harness.appended[0] ?? {};
  const calls = activateUmami(context, script);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 1);

  (script.remove as () => void)();
  context.location.href = "https://example.test/b";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 2);
  assert.equal(context.astroAnalytics.track("after-swap").ok, true);

  const originalGetElementById = context.document.getElementById;
  context.document.getElementById = () => ({ id: UMAMI_SCRIPT_ID });
  assert.equal(context.astroAnalytics.status().umami, "adapter-not-loaded");
  context.document.getElementById = originalGetElementById;
  assert.equal(context.astroAnalytics.status().umami, "ready");

  context.location.href = "https://example.test/a";
  context.document.title = "A again";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 4);
});

test("Umami can finish loading after ClientRouter removes its proven script element", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      querySelector(selector: string) {
        return selector === '[name="astro-view-transitions-enabled"]' ? {} : null;
      },
      readyState: "complete",
      title: "After swap",
    }),
    location: { href: "https://example.test/after-swap" },
  };
  executeUmamiBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.remove as () => void)();
  const calls = activateUmami(context, script);
  assert.equal(calls.length, 0);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 1);
  assert.equal(context.astroAnalytics.track("loaded-after-swap").ok, true);
});

test("Umami closes readiness if its load-proven tracker or track method is replaced", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context, { pageviews: "none" });
  const script = harness.appended[0] ?? {};
  activateUmami(context, script);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const loadProvenClient = context.umami;
  const loadProvenTrack = loadProvenClient.track;

  loadProvenClient.track = () => {};
  assert.equal(context.astroAnalytics.track("method-replaced").ok, false);
  loadProvenClient.track = loadProvenTrack;
  assert.equal(context.astroAnalytics.track("method-restored").ok, true);

  context.umami = { track() {} };
  assert.equal(context.astroAnalytics.track("client-replaced").ok, false);
  context.umami = loadProvenClient;
  assert.equal(context.astroAnalytics.track("client-restored").ok, true);
});

test("Umami defers its initial pageview until prerender activation", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { prerendering: true }),
    location: { href: "https://example.test/prerendered/" },
  };
  executeUmamiBootstrap(context);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  assert.equal(calls.length, 0);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(calls.length, 0);
  context.document.prerendering = false;
  harness.documentListeners.get("prerenderingchange")?.[0]?.();
  assert.equal(calls.length, 1);
});

test("Umami events retain completed Astro context across forward and back traversal", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { referrer: "https://search.example/", title: "A" }),
    location: { href: "https://example.test/a" },
  };
  executeUmamiBootstrap(context);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("on-a");

  context.location.href = "https://example.test/b";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("on-b");

  context.location.href = "https://example.test/a";
  context.document.title = "A again";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("back-on-a");

  const eventPayloads = [calls[1], calls[3], calls[5]].map((call) => {
    const payload = call?.[0] as (properties: object) => object;
    return JSON.parse(JSON.stringify(payload({ website: "site" })));
  });
  assert.deepEqual(eventPayloads, [
    { website: "site", url: "https://example.test/a", title: "A", referrer: "https://search.example/", name: "on-a" },
    { website: "site", url: "https://example.test/b", title: "B", referrer: "https://example.test/a", name: "on-b" },
    { website: "site", url: "https://example.test/a", title: "A again", referrer: "https://example.test/b", name: "back-on-a" },
  ]);
});

test("Umami delayed readiness gives its pageview and event the same completed edge", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { referrer: "https://search.example/", title: "A" }),
    location: { href: "https://example.test/a" },
  };
  executeUmamiBootstrap(context);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.location.href = "https://example.test/b";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.document.title = "B refreshed before readiness";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const calls = activateUmami(context, harness.appended[0] ?? {});
  context.astroAnalytics.track("after-load");
  const pageview = (calls[0]?.[0] as (properties: object) => object)({ website: "site" });
  const event = (calls[1]?.[0] as (properties: object) => object)({ website: "site" });
  assert.deepEqual(JSON.parse(JSON.stringify(pageview)), {
    website: "site", url: "https://example.test/b", title: "B refreshed before readiness", referrer: "https://example.test/b",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(event)), {
    website: "site", url: "https://example.test/b", title: "B refreshed before readiness", referrer: "https://example.test/b", name: "after-load",
  });
});

test("Umami retains a completed pageview while a later navigation is in flight", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { referrer: "https://search.example/", title: "A" }),
    location: { href: "https://example.test/a" },
  };
  executeUmamiBootstrap(context);
  harness.documentListeners.get("astro:page-load")?.[0]?.();

  context.location.href = "https://example.test/in-flight";
  const calls = activateUmami(context, harness.appended[0] ?? {});
  assert.equal(calls.length, 0);

  context.location.href = "https://example.test/a";
  executeUmamiBootstrap(context);
  assert.equal(calls.length, 1);
  const payload = calls[0]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(payload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/a",
    title: "A",
    referrer: "https://search.example/",
  });
});

test("Umami retains a synchronously rejected pageview for matching reentry", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(context);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const script = harness.appended[0] ?? {};
  const calls: unknown[][] = [];
  let attempts = 0;
  const umami = {
    track(...args: unknown[]) {
      attempts += 1;
      if (attempts === 1) throw new Error("transient");
      calls.push(args);
    },
  };
  context.document.currentScript = script;
  context.umami = umami;
  context.document.currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(attempts, 1);
  assert.equal(calls.length, 0);
  executeUmamiBootstrap(context);
  assert.equal(attempts, 2);
  assert.equal(calls.length, 1);
});

test("Umami consent, collisions, failure cleanup, and retry fail closed", () => {
  const pendingHarness = createDocumentHarness();
  const pendingContext: vm.Context = {
    document: pendingHarness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(pendingContext, { consentMode: "external" });
  assert.equal(pendingHarness.appended.length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(pendingContext.astroAnalytics.status())), {
    umami: "consent-pending",
  });

  const collisionHarness = createDocumentHarness();
  const collisionContext: vm.Context = {
    document: collisionHarness.document,
    location: { href: "https://example.test/" },
    umami: { track() {} },
  };
  executeUmamiBootstrap(collisionContext);
  assert.equal(collisionHarness.appended.length, 0);
  assert.equal(typeof collisionContext.umami.track, "function");

  const retryHarness = createDocumentHarness();
  const retryContext: vm.Context = {
    document: retryHarness.document,
    location: { href: "https://example.test/" },
  };
  executeUmamiBootstrap(retryContext);
  const first = retryHarness.appended[0] ?? {};
  (first.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(first.isConnected, false);
  assert.equal(Reflect.getOwnPropertyDescriptor(retryContext, "umami"), undefined);
  executeUmamiBootstrap(retryContext);
  assert.equal(retryHarness.appended.length, 2);
  activateUmami(retryContext, retryHarness.appended[1] ?? {});
  (first.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  retryHarness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(retryContext.astroAnalytics.track("after-retry").ok, true);
});

test("Umami waits for an observed completion after navigation observer recovery", () => {
  const harness = createDocumentHarness();
  const originalAddEventListener = harness.document.addEventListener;
  harness.document.addEventListener = undefined;
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/start/" },
  };
  executeUmamiBootstrap(context);
  assert.equal(harness.appended.length, 0);
  harness.document.addEventListener = originalAddEventListener;
  context.location.href = "https://example.test/missed/";
  executeUmamiBootstrap(context);
  assert.equal(harness.appended.length, 0);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
  context.location.href = "https://example.test/observed/";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(harness.appended.length, 1);
  const calls = activateUmami(context, harness.appended[0] ?? {});
  const payload = calls[0]?.[0] as (properties: object) => object;
  assert.deepEqual(JSON.parse(JSON.stringify(payload({ website: "site" }))), {
    website: "site",
    url: "https://example.test/observed/",
    title: "",
    referrer: "",
  });
});

test("Matomo initializes its owned queue and sends Astro pageviews and mapped events", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      referrer: "https://search.example/",
      title: "Landing",
    }),
    location: { href: "https://example.test/landing/" },
  };
  executeMatomoBootstrap(context);
  assert.equal(harness.appended.length, 1);
  const script = harness.appended[0] ?? {};
  assert.equal(script.id, MATOMO_SCRIPT_ID);
  assert.equal(script.src, "https://analytics.example/matomo.js");
  assert.deepEqual(JSON.parse(JSON.stringify(context._paq)), [
    ["setTrackerUrl", "https://analytics.example/matomo.php"],
    ["setSiteId", "1"],
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    matomo: "adapter-not-loaded",
  });
  const commands = activateMatomo(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), { matomo: "ready" });
  assert.deepEqual(JSON.parse(JSON.stringify(commands)), [
    ["setTrackerUrl", "https://analytics.example/matomo.php"],
    ["setSiteId", "1"],
    ["setReferrerUrl", "https://search.example/"],
    ["setCustomUrl", "https://example.test/landing/"],
    ["setDocumentTitle", "Landing"],
    ["trackPageView"],
  ]);
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("plain"))),
    { ok: true, providers: { matomo: { ok: true } } },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(vm.runInNewContext('astroAnalytics.track("named", { _name: "Primary CTA" })', context))),
    { ok: true, providers: { matomo: { ok: true } } },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(vm.runInNewContext('astroAnalytics.track("valued", { _value: 12.5 })', context))),
    { ok: true, providers: { matomo: { ok: true } } },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(vm.runInNewContext(
      'astroAnalytics.track("signup", { _name: "Primary CTA", _value: 12.5, campaign: "fall" })',
      context,
    ))),
    { ok: true, providers: { matomo: { ok: true } } },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(commands.at(-1))), [
    "trackEvent",
    "Astro",
    "signup",
    "Primary CTA",
    12.5,
  ]);

  context.location.href = "https://example.test/next/";
  context.document.title = "Next";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/landing/"],
    ["setCustomUrl", "https://example.test/next/"],
    ["setDocumentTitle", "Next"],
    ["trackPageView"],
  ]);
});

test("delayed Matomo readiness preserves the preceding virtual URL as referrer", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      referrer: "https://search.example/",
      title: "Landing",
    }),
    location: { href: "https://example.test/landing/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};

  context.location.href = "https://example.test/next/";
  context.document.title = "Next";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const commands = activateMatomo(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/landing/"],
    ["setCustomUrl", "https://example.test/next/"],
    ["setDocumentTitle", "Next"],
    ["trackPageView"],
  ]);
});

test("multiple pre-ready Matomo navigations retain only the current journey edge", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "Landing" }),
    location: { href: "https://example.test/landing/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};

  context.location.href = "https://example.test/next/";
  context.document.title = "Next";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.location.href = "https://example.test/final/";
  context.document.title = "Final";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  const commands = activateMatomo(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/next/"],
    ["setCustomUrl", "https://example.test/final/"],
    ["setDocumentTitle", "Final"],
    ["trackPageView"],
  ]);
  assert.equal(commands.some((command) => command.includes("https://example.test/landing/")), false);
});

test("Matomo readiness during an in-flight navigation preserves every completed edge", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, {
      referrer: "https://search.example/",
      title: "A",
    }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};
  context.location.href = "https://example.test/b/";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.location.href = "https://example.test/c/";
  context.document.title = "C";

  const commands = activateMatomo(context, script);
  assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/b/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C"],
    ["trackPageView"],
  ]);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/c/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C"],
    ["trackPageView"],
  ]);
  assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 2);
});

test("matching Matomo bootstraps before load remain pending and coalesce to the current route", () => {
  for (const pageviews of ["provider", "astro", "none"] as const) {
    for (const events of [true, false]) {
      const harness = createDocumentHarness();
      const context: vm.Context = {
        document: Object.assign(harness.document, { title: "A" }),
        location: { href: "https://example.test/a/" },
      };
      executeMatomoBootstrap(context, { events, pageviews });
      const script = harness.appended[0] ?? {};
      const startupLength = (context._paq as unknown[]).length;

      executeMatomoBootstrap(context, { events, pageviews });
      assert.equal(harness.appended.length, 1);
      assert.equal((context._paq as unknown[]).length, startupLength);
      if (events) {
        assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
          matomo: "adapter-not-loaded",
        });
        assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("before-load"))), {
          ok: false,
          providers: { matomo: { ok: false, reason: "adapter-not-loaded" } },
          reason: "adapter-not-loaded",
        });
        assert.equal((context._paq as unknown[]).length, startupLength);
      }

      context.location.href = "https://example.test/b/";
      context.document.title = "B";
      harness.documentListeners.get("astro:page-load")?.[0]?.();
      executeMatomoBootstrap(context, { events, pageviews });
      context.location.href = "https://example.test/c/";
      context.document.title = "C";
      const commands = activateMatomo(context, script);
      assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
      harness.documentListeners.get("astro:page-load")?.[0]?.();

      if (pageviews === "none") {
        assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
        if (events) {
          assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("after-load"))), {
            ok: true,
            providers: { matomo: { ok: true } },
          });
          assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
            ["setReferrerUrl", "https://example.test/b/"],
            ["setCustomUrl", "https://example.test/c/"],
            ["setDocumentTitle", "C"],
            ["trackEvent", "Astro", "after-load"],
          ]);
        }
      } else {
        assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
          ["setReferrerUrl", "https://example.test/b/"],
          ["setCustomUrl", "https://example.test/c/"],
          ["setDocumentTitle", "C"],
          ["trackPageView"],
        ]);
        assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 1);
      }
    }
  }
});

test("pre-load matching reentry remains pending through error and a clean retry", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context);
  const failedScript = harness.appended[0] ?? {};
  executeMatomoBootstrap(context);
  (failedScript.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(context._paq, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("after-error"))), {
    ok: false,
    providers: { matomo: { ok: false, reason: "adapter-not-loaded" } },
    reason: "adapter-not-loaded",
  });

  context.location.href = "https://example.test/b/";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  executeMatomoBootstrap(context);
  const commands = activateMatomo(context, harness.appended[1] ?? {});
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/a/"],
    ["setCustomUrl", "https://example.test/b/"],
    ["setDocumentTitle", "B"],
    ["trackPageView"],
  ]);
  assert.equal(JSON.stringify(commands).includes("before-load"), false);
  assert.equal(JSON.stringify(commands).includes("after-error"), false);
});

test("Matomo retries failed navigation-observer installation without duplicate listeners", () => {
  for (const pageviews of ["provider", "astro", "none"] as const) {
    for (const unavailable of ["missing", "throwing"] as const) {
      for (const scenario of [
        { destination: "c", missedRoutes: ["b"] },
        { destination: "d", missedRoutes: ["b", "c"] },
        { destination: "a", missedRoutes: ["b"] },
      ]) {
        const { destination, missedRoutes } = scenario;
        const harness = createDocumentHarness();
        const originalAddEventListener = harness.document.addEventListener;
        harness.document.addEventListener = unavailable === "missing"
          ? undefined
          : () => { throw new Error("listener unavailable"); };
        const context: vm.Context = {
          document: Object.assign(harness.document, {
            referrer: "https://search.example/result/",
            title: "A",
          }),
          location: { href: "https://example.test/a/" },
        };

        executeMatomoBootstrap(context, { pageviews });
        assert.equal(harness.appended.length, 0);
        assert.equal(harness.documentListeners.has("astro:page-load"), false);
        for (const route of missedRoutes) {
          context.location.href = `https://example.test/${route}/`;
          context.document.title = route.toUpperCase();
        }

        harness.document.addEventListener = originalAddEventListener;
        executeMatomoBootstrap(context, { pageviews });
        executeMatomoBootstrap(context, { pageviews });
        assert.equal(harness.appended.length, 0);
        assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
        assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
          matomo: "adapter-not-loaded",
        });

        context.location.href = `https://example.test/${destination}/`;
        context.document.title = destination.toUpperCase();
        harness.documentListeners.get("astro:page-load")?.[0]?.();
        assert.equal(harness.appended.length, 1);
        const commands = activateMatomo(context, harness.appended[0] ?? {});

        if (pageviews === "none") {
          assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track(`event-on-${destination}`))), {
            ok: true,
            providers: { matomo: { ok: true } },
          });
          assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
            ["setReferrerUrl", ""],
            ["setCustomUrl", `https://example.test/${destination}/`],
            ["setDocumentTitle", destination.toUpperCase()],
            ["trackEvent", "Astro", `event-on-${destination}`],
          ]);
          assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
        } else {
          assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
            ["setReferrerUrl", ""],
            ["setCustomUrl", `https://example.test/${destination}/`],
            ["setDocumentTitle", destination.toUpperCase()],
            ["trackPageView"],
          ]);
          assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 1);
        }

        context.location.href = "https://example.test/known-next/";
        context.document.title = "Known next";
        harness.documentListeners.get("astro:page-load")?.[0]?.();
        if (pageviews === "none") context.astroAnalytics.track("event-on-known-next");
        assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
          ["setReferrerUrl", `https://example.test/${destination}/`],
          ["setCustomUrl", "https://example.test/known-next/"],
          ["setDocumentTitle", "Known next"],
          [pageviews === "none" ? "trackEvent" : "trackPageView", ...(pageviews === "none" ? ["Astro", "event-on-known-next"] : [])],
        ]);
      }
    }
  }
});

test("Matomo validates reserved event fields and fails closed for pending consent", () => {
  const pendingHarness = createDocumentHarness();
  const pendingContext: vm.Context = {
    document: pendingHarness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(pendingContext, { consentMode: "external" });
  assert.equal(pendingHarness.appended.length, 0);
  assert.equal(pendingContext._paq, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(pendingContext.astroAnalytics.status())), {
    matomo: "consent-pending",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(pendingContext.astroAnalytics.track("signup"))), {
    ok: false,
    providers: { matomo: { ok: false, reason: "consent-pending" } },
    reason: "consent-pending",
  });

  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};
  activateMatomo(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext('astroAnalytics.track("signup", { _name: "" })', context))), {
    ok: false,
    providers: { matomo: { ok: false, reason: "invalid-event" } },
    reason: "invalid-event",
  });
});

test("Matomo rejects occupied state, cleans up failures, and retries once", () => {
  const occupiedHarness = createDocumentHarness();
  const occupiedContext: vm.Context = {
    _paq: [],
    document: occupiedHarness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(occupiedContext);
  assert.equal(occupiedHarness.appended.length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(occupiedContext.astroAnalytics.status())), {
    matomo: "adapter-not-loaded",
  });

  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  const failedScript = harness.appended[0] ?? {};
  (failedScript.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(context._paq, undefined);
  assert.equal(failedScript.isConnected, false);

  executeMatomoBootstrap(context);
  assert.equal(harness.appended.length, 2);
  const retryScript = harness.appended[1] ?? {};
  activateMatomo(context, retryScript);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    matomo: "ready",
  });
  executeMatomoBootstrap(context);
  assert.equal(harness.appended.length, 2);
});

test("Matomo retry restores same-page and completed-navigation pageviews", () => {
  const sameHarness = createDocumentHarness();
  const sameContext: vm.Context = {
    document: Object.assign(sameHarness.document, {
      referrer: "https://search.example/",
      title: "A",
    }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(sameContext);
  (sameHarness.appended[0]?.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  executeMatomoBootstrap(sameContext);
  const sameCommands = activateMatomo(sameContext, sameHarness.appended[1] ?? {});
  assert.equal(sameCommands.filter((command) => command[0] === "trackPageView").length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(sameCommands.slice(-4))), [
    ["setReferrerUrl", "https://search.example/"],
    ["setCustomUrl", "https://example.test/a/"],
    ["setDocumentTitle", "A"],
    ["trackPageView"],
  ]);

  const movedHarness = createDocumentHarness();
  const movedContext: vm.Context = {
    document: Object.assign(movedHarness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(movedContext);
  movedContext.location.href = "https://example.test/b/";
  movedContext.document.title = "B";
  movedHarness.documentListeners.get("astro:page-load")?.[0]?.();
  (movedHarness.appended[0]?.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  executeMatomoBootstrap(movedContext);
  const movedCommands = activateMatomo(movedContext, movedHarness.appended[1] ?? {});
  assert.deepEqual(JSON.parse(JSON.stringify(movedCommands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/a/"],
    ["setCustomUrl", "https://example.test/b/"],
    ["setDocumentTitle", "B"],
    ["trackPageView"],
  ]);
});

test("Matomo retry waits for an in-flight destination without replaying history", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context);
  context.location.href = "https://example.test/b/";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  executeMatomoBootstrap(context);
  context.location.href = "https://example.test/c/";
  context.document.title = "C";
  const commands = activateMatomo(context, harness.appended[1] ?? {});
  assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
  harness.documentListeners.get("astro:page-load")?.at(-1)?.();
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/b/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C"],
    ["trackPageView"],
  ]);
});

test("Matomo observes completed routes between failure and retry in every pageview mode", () => {
  for (const pageviews of ["provider", "astro", "none"] as const) {
    const harness = createDocumentHarness();
    const context: vm.Context = {
      document: Object.assign(harness.document, { title: "A" }),
      location: { href: "https://example.test/a/" },
    };
    executeMatomoBootstrap(context, { pageviews });
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
    context.location.href = "https://example.test/b/";
    context.document.title = "B";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    context.location.href = "https://example.test/c/";
    context.document.title = "C";
    harness.documentListeners.get("astro:page-load")?.[0]?.();

    executeMatomoBootstrap(context, { pageviews });
    const commands = activateMatomo(context, harness.appended[1] ?? {});
    if (pageviews === "none") {
      context.astroAnalytics.track("event-on-c");
      assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
      assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
        ["setReferrerUrl", "https://example.test/b/"],
        ["setCustomUrl", "https://example.test/c/"],
        ["setDocumentTitle", "C"],
        ["trackEvent", "Astro", "event-on-c"],
      ]);
    } else {
      assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
        ["setReferrerUrl", "https://example.test/b/"],
        ["setCustomUrl", "https://example.test/c/"],
        ["setDocumentTitle", "C"],
        ["trackPageView"],
      ]);
      assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 1);
    }
  }
});

test("Matomo observes navigation after initial setup failure and waits out retry navigation", () => {
  const harness = createDocumentHarness();
  const originalCreateElement = harness.document.createElement;
  harness.document.createElement = () => { throw new Error("setup failed"); };
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context);
  context.location.href = "https://example.test/b/";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  harness.document.createElement = originalCreateElement;
  executeMatomoBootstrap(context);
  context.location.href = "https://example.test/c/";
  context.document.title = "C";
  const commands = activateMatomo(context, harness.appended[0] ?? {});
  assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-4))), [
    ["setReferrerUrl", "https://example.test/b/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C"],
    ["trackPageView"],
  ]);
});

test("Matomo cleans up partial vendor initialization before retrying", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  const failedScript = harness.appended[0] ?? {};
  context.document.currentScript = failedScript;
  context._paq = { push() {} };
  const partialMatomo = { initialized: false, getAsyncTrackers() { return []; } };
  context.Matomo = partialMatomo;
  context.Piwik = partialMatomo;
  context.AnalyticsTracker = partialMatomo;
  context.document.currentScript = undefined;
  (failedScript.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(context._paq, undefined);
  assert.equal(context.Matomo, undefined);
  assert.equal(context.Piwik, undefined);
  assert.equal(context.AnalyticsTracker, undefined);
  assert.equal(failedScript.isConnected, false);

  executeMatomoBootstrap(context);
  assert.equal(harness.appended.length, 2);
  activateMatomo(context, harness.appended[1] ?? {});
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    matomo: "ready",
  });
});

test("Matomo preserves unrelated globals that replace its startup state", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};
  const foreignQueue = { push() {}, unexpected: true };
  const foreignMatomo = { initialized: false };
  const foreignPiwik = { partial: true };
  const foreignTracker = { partial: true };
  context._paq = foreignQueue;
  context.Matomo = foreignMatomo;
  context.Piwik = foreignPiwik;
  context.AnalyticsTracker = foreignTracker;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(context._paq, foreignQueue);
  assert.equal(context.Matomo, foreignMatomo);
  assert.equal(context.Piwik, foreignPiwik);
  assert.equal(context.AnalyticsTracker, foreignTracker);
  assert.equal(script.isConnected, false);
});

test("Matomo preserves structurally conforming foreign state and stale callbacks cannot remove it", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  const script = harness.appended[0] ?? {};
  const foreignQueue = { push() {} };
  const foreignMatomo = { initialized: true, getAsyncTrackers() { return []; } };
  context._paq = foreignQueue;
  context.Matomo = foreignMatomo;
  context.Piwik = foreignMatomo;
  context.AnalyticsTracker = foreignMatomo;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(context._paq, foreignQueue);
  assert.equal(context.Matomo, foreignMatomo);
  assert.equal(context.Piwik, foreignMatomo);
  assert.equal(context.AnalyticsTracker, foreignMatomo);

  (script.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(context._paq, foreignQueue);
  assert.equal(context.Matomo, foreignMatomo);
});

test("Matomo pageview none keeps mapped events without lifecycle sends", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "No pageviews" }),
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context, { pageviews: "none" });
  const script = harness.appended[0] ?? {};
  const commands = activateMatomo(context, script);
  assert.equal(harness.documentListeners.has("astro:page-load"), true);
  assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("signup"))),
    { ok: true, providers: { matomo: { ok: true } } },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(commands.at(-1))), [
    "trackEvent",
    "Astro",
    "signup",
  ]);
});

test("Matomo pageview none keeps event context on the last completed navigation", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context, { pageviews: "none" });
  const commands = activateMatomo(context, harness.appended[0] ?? {});
  context.location.href = "https://example.test/b/";
  context.document.title = "B";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("event-on-b");
  context.location.href = "https://example.test/c/";
  context.document.title = "C";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("event-on-c");
  context.document.title = "C refreshed";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.astroAnalytics.track("event-on-c-refreshed");

  assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(-12))), [
    ["setReferrerUrl", "https://example.test/a/"],
    ["setCustomUrl", "https://example.test/b/"],
    ["setDocumentTitle", "B"],
    ["trackEvent", "Astro", "event-on-b"],
    ["setReferrerUrl", "https://example.test/b/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C"],
    ["trackEvent", "Astro", "event-on-c"],
    ["setReferrerUrl", "https://example.test/c/"],
    ["setCustomUrl", "https://example.test/c/"],
    ["setDocumentTitle", "C refreshed"],
    ["trackEvent", "Astro", "event-on-c-refreshed"],
  ]);
});

test("Matomo readiness fails closed when its retained command proxy becomes unusable", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeMatomoBootstrap(context);
  activateMatomo(context, harness.appended[0] ?? {});
  context._paq.push = undefined;
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    matomo: "adapter-not-loaded",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("event"))), {
    ok: false,
    providers: { matomo: { ok: false, reason: "adapter-not-loaded" } },
    reason: "adapter-not-loaded",
  });
});

test("Matomo requalifies its exact restored proxy after a transient command exception", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { title: "A" }),
    location: { href: "https://example.test/a/" },
  };
  executeMatomoBootstrap(context);
  const commands = activateMatomo(context, harness.appended[0] ?? {});
  const queue = context._paq as { push: (command: unknown[]) => void };
  const originalPush = queue.push;
  queue.push = () => { throw new Error("transient"); };
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("fails-once"))), {
    ok: false,
    providers: { matomo: { ok: false, reason: "adapter-not-loaded" } },
    reason: "adapter-not-loaded",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    matomo: "adapter-not-loaded",
  });

  queue.push = originalPush;
  executeMatomoBootstrap(context);
  assert.equal(harness.appended.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), { matomo: "ready" });
  assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("recovered"))), {
    ok: true,
    providers: { matomo: { ok: true } },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(commands.at(-1))), ["trackEvent", "Astro", "recovered"]);
});

test("Google Analytics initializes consent before config and sends Astro-owned pageviews and events", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: Object.assign(harness.document, { referrer: "https://search.example/", title: "Landing" }),
    location: { href: "https://example.test/landing/" },
  };
  executeGoogleAnalyticsBootstrap(context, {
    config: { allow_google_signals: false, send_page_view: true },
  });

  assert.equal(harness.appended.length, 1);
  const script = harness.appended[0] ?? {};
  assert.equal(script.id, GOOGLE_ANALYTICS_SCRIPT_ID);
  assert.equal(script.src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123");
  assert.equal(script.async, true);
  assert.deepEqual(script.attributes, {
    "data-cwl-astro-analytics": "google-analytics-v1",
    "data-measurement-id": "G-TEST123",
  });
  assert.equal(
    Object.prototype.toString.call(context.dataLayer[0]),
    "[object Arguments]",
  );
  const beforeLoad = (context.dataLayer as Array<ArrayLike<unknown>>).map(
    serializeGtagCommand,
  );
  assert.deepEqual(beforeLoad[0], ["consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  }]);
  assert.equal(beforeLoad[1]?.[0], "js");
  assert.deepEqual(beforeLoad[2], ["config", "G-TEST123", {
    allow_google_signals: false,
    send_page_view: false,
  }]);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    "google-analytics": "adapter-not-loaded",
  });

  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    "google-analytics": "ready",
  });
  assert.deepEqual(serializeGtagCommand(context.dataLayer.at(-1)), [
    "event", "page_view", {
      page_location: "https://example.test/landing/",
      page_title: "Landing",
      page_referrer: "https://search.example/",
      send_to: "G-TEST123",
    },
  ]);

  const result = vm.runInNewContext(
    'astroAnalytics.track("journey", { step: 2, complete: true })',
    context,
  );
  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    ok: true,
    providers: { "google-analytics": { ok: true } },
  });
  assert.deepEqual(serializeGtagCommand(context.dataLayer.at(-1)), [
    "event", "journey", { step: 2, complete: true, send_to: "G-TEST123" },
  ]);

  context.location.href = "https://example.test/next/";
  context.document.title = "Next";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(serializeGtagCommand(context.dataLayer.at(-1)), [
    "event", "page_view", {
      page_location: "https://example.test/next/",
      page_title: "Next",
      page_referrer: "https://example.test/landing/",
      send_to: "G-TEST123",
    },
  ]);
  const callCount = context.dataLayer.length;
  context.document.title = "Next refreshed";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(context.dataLayer.length, callCount + 1);
  assert.deepEqual(serializeGtagCommand(context.dataLayer.at(-1)), [
    "event", "page_view", {
      page_location: "https://example.test/next/",
      page_title: "Next refreshed",
      page_referrer: "https://example.test/next/",
      send_to: "G-TEST123",
    },
  ]);
});

test("Google Analytics deferred consent fails closed without loading Google", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(context, { consentMode: "deferred" });
  assert.equal(harness.appended.length, 0);
  assert.equal(context.gtag, undefined);
  assert.equal(context.dataLayer, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    "google-analytics": "consent-pending",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("blocked"))), {
    ok: false,
    providers: { "google-analytics": { ok: false, reason: "consent-pending" } },
    reason: "consent-pending",
  });
});

test("Google Analytics refuses occupied globals and bounds provider event parameters", () => {
  const occupiedHarness = createDocumentHarness();
  const occupiedContext: vm.Context = {
    dataLayer: [],
    document: occupiedHarness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(occupiedContext);
  assert.equal(occupiedHarness.appended.length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(occupiedContext.astroAnalytics.status())), {
    "google-analytics": "adapter-not-loaded",
  });

  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  const properties = Object.fromEntries(Array.from({ length: 26 }, (_, index) => [`p${index}`, index]));
  context.properties = properties;
  assert.deepEqual(JSON.parse(JSON.stringify(
    vm.runInNewContext('astroAnalytics.track("too_many", properties)', context),
  )), {
    ok: false,
    providers: { "google-analytics": { ok: false, reason: "invalid-event" } },
    reason: "invalid-event",
  });
  for (const expression of [
    'astroAnalytics.track("contains spaces")',
    'astroAnalytics.track("123_starts_numeric")',
    'astroAnalytics.track("abcdefghijklmnopqrstuvwxyz_12345678901234")',
    'astroAnalytics.track("valid_name", { "invalid-key": true })',
    'astroAnalytics.track("valid_name", { send_to: "G-OTHER" })',
    'astroAnalytics.track("valid_name", { value: "x".repeat(101) })',
    'astroAnalytics.track("ga_reserved")',
    'astroAnalytics.track("Google_reserved")',
    'astroAnalytics.track("valid_name", { firebase_reserved: true })',
  ]) {
    assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext(expression, context))), {
      ok: false,
      providers: { "google-analytics": { ok: false, reason: "invalid-event" } },
      reason: "invalid-event",
    });
  }
  assert.deepEqual(JSON.parse(JSON.stringify(
    vm.runInNewContext('astroAnalytics.track("étape_二", { durée_秒: 2 })', context),
  )), {
    ok: true,
    providers: { "google-analytics": { ok: true } },
  });
});

test("Google Analytics stale callbacks cannot affect a retry generation", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(context);
  const firstScript = harness.appended[0] ?? {};
  (firstScript.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(context.gtag, undefined);
  assert.equal(context.dataLayer, undefined);

  executeGoogleAnalyticsBootstrap(context);
  const secondScript = harness.appended[1] ?? {};
  const secondGtag = context.gtag;
  const secondDataLayer = context.dataLayer;
  (firstScript.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  (firstScript.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(context.gtag, secondGtag);
  assert.equal(context.dataLayer, secondDataLayer);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    "google-analytics": "adapter-not-loaded",
  });

  (secondScript.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    "google-analytics": "ready",
  });
});

test("Google Analytics setup and asynchronous failures are contained and cleaned up", () => {
  const setupHarness = createDocumentHarness();
  setupHarness.document.head = {
    appendChild() { throw new Error("append failed"); },
  };
  const setupContext: vm.Context = {
    document: setupHarness.document,
    location: { href: "https://example.test/" },
  };
  assert.doesNotThrow(() => executeGoogleAnalyticsBootstrap(setupContext));
  assert.equal(setupContext.gtag, undefined);
  assert.equal(setupContext.dataLayer, undefined);
  assert.equal(setupHarness.documentListeners.get("astro:page-load")?.length, 0);

  const loadHarness = createDocumentHarness();
  const loadContext: vm.Context = {
    document: loadHarness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(loadContext);
  const script = loadHarness.appended[0] ?? {};
  Object.defineProperty(loadContext, "gtag", {
    configurable: true,
    get() { throw new Error("hostile gtag"); },
  });
  assert.doesNotThrow(() => {
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  });
  assert.equal(script.isConnected, false);
  assert.equal(loadHarness.documentListeners.get("astro:page-load")?.length, 0);
});

test("Fathom waits for an observed completion after page-load observer recovery", () => {
  const harness = createDocumentHarness();
  const originalAddEventListener = harness.document.addEventListener;
  harness.document.addEventListener = undefined;
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackEvent() {}, trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/start/" },
  };

  executeFathomBootstrap(context);
  assert.equal(harness.appended.length, 0);
  assert.equal(context.astroAnalytics.status().fathom, "adapter-not-loaded");

  harness.document.addEventListener = originalAddEventListener;
  context.location.href = "https://example.test/missed/";
  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(calls, []);

  context.location.href = "https://example.test/observed/";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(calls, ["https://example.test/observed/"]);
});

test("Plausible fails closed without a page-load observer and recovers on an observed completion", () => {
  const harness = createDocumentHarness();
  const originalAddEventListener = harness.document.addEventListener;
  harness.document.addEventListener = undefined;
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/start/" },
  };

  executePlausibleBootstrap(context);
  assert.equal(harness.appended.length, 0);
  assert.equal(context.plausible, undefined);
  assert.equal(context.astroAnalytics.status().plausible, "adapter-not-loaded");

  harness.document.addEventListener = originalAddEventListener;
  context.location.href = "https://example.test/missed/";
  executePlausibleBootstrap(context);
  const calls = activatePlausible(context, harness.appended[0] ?? {});
  assert.deepEqual(calls, []);

  context.location.href = "https://example.test/observed/";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["pageview", { url: "https://example.test/observed/" }],
  ]);
});

test("Google Analytics fails closed without a page-load observer and recovers on an observed completion", () => {
  const harness = createDocumentHarness();
  const originalAddEventListener = harness.document.addEventListener;
  harness.document.addEventListener = undefined;
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/start/" },
  };

  executeGoogleAnalyticsBootstrap(context);
  assert.equal(harness.appended.length, 0);
  assert.equal(context.gtag, undefined);
  assert.equal(context.dataLayer, undefined);
  assert.equal(context.astroAnalytics.status()["google-analytics"], "adapter-not-loaded");

  harness.document.addEventListener = originalAddEventListener;
  context.location.href = "https://example.test/missed/";
  executeGoogleAnalyticsBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  const dataLayer = context.dataLayer as unknown as Array<ArrayLike<unknown>>;
  assert.equal(
    dataLayer.map(serializeGtagCommand)
      .some((command) => command[0] === "event" && command[1] === "page_view"),
    false,
  );

  context.location.href = "https://example.test/observed/";
  context.document.title = "Observed";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(serializeGtagCommand(dataLayer.at(-1)!), [
    "event", "page_view", {
      page_location: "https://example.test/observed/",
      page_referrer: "",
      page_title: "Observed",
      send_to: "G-TEST123",
    },
  ]);
});

test("Fathom retains a synchronously rejected pageview for matching reentry", () => {
  const harness = createDocumentHarness();
  let attempts = 0;
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent() {},
      trackPageview() {
        attempts += 1;
        if (attempts === 1) throw new Error("transient Fathom failure");
        calls.push(context.location.href);
      },
    },
    location: { href: "https://example.test/" },
  };

  executeFathomBootstrap(context);
  (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(attempts, 1);
  assert.deepEqual(calls, []);
  executeFathomBootstrap(context);
  assert.equal(attempts, 2);
  assert.deepEqual(calls, ["https://example.test/"]);
});

test("Plausible retains a synchronously rejected pageview for matching reentry", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(context);
  const script = harness.appended[0] ?? {};
  let attempts = 0;
  const calls: unknown[][] = [];
  const plausible = (...args: unknown[]) => {
    attempts += 1;
    if (attempts === 1) throw new Error("transient Plausible failure");
    calls.push(args);
  };
  Object.defineProperty(plausible, "l", { value: true });
  context.document.currentScript = script;
  context.plausible = plausible;
  context.document.currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(attempts, 1);
  executePlausibleBootstrap(context);
  assert.equal(attempts, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["pageview", { url: "https://example.test/" }],
  ]);
});

test("Google Analytics retains a synchronously rejected pageview for matching reentry", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeGoogleAnalyticsBootstrap(context);
  const script = harness.appended[0] ?? {};
  const dataLayer = context.dataLayer as unknown as unknown[] & { push: (...values: unknown[]) => number };
  const originalPush = dataLayer.push;
  dataLayer.push = () => { throw new Error("transient Google queue failure"); };
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  dataLayer.push = originalPush;
  executeGoogleAnalyticsBootstrap(context);
  assert.deepEqual(serializeGtagCommand((dataLayer as Array<ArrayLike<unknown>>).at(-1)!), [
    "event", "page_view", {
      page_location: "https://example.test/",
      page_referrer: "",
      send_to: "G-TEST123",
    },
  ]);
});

test("disabled analytics injects no runtime even with events true", () => {
  const injected: string[] = [];
  runSetup(astroAnalytics({ provider: false, events: true }), "build", injected);
  assert.deepEqual(injected, []);
});

test("events true injects once under the selected environment policy", () => {
  const integration = astroAnalytics({
    provider: { name: "fathom", siteId: "ABCDEFG" },
    events: true,
  });
  const injected: string[] = [];
  runSetup(integration, "dev", injected);
  runSetup(integration, "preview", injected);
  assert.equal(injected.length, 0);
  runSetup(integration, "build", injected);
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /^page:/);
});

test("Fathom injects even when the package event helper is disabled", () => {
  const integration = astroAnalytics({
    provider: { name: "fathom", siteId: "ABCDEFG" },
    events: false,
  });
  const injected: string[] = [];
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);
  assert.match(injected[0] ?? "", /cdn\.usefathom\.com/);
  assert.match(injected[0] ?? "", /ABCDEFG/);
});

test("multi-provider runtime exposes independent adapter outcomes", () => {
  const integration = astroAnalytics({
    providers: [
      { name: "fathom", siteId: "ABCDEFG" },
      { name: "plausible", scriptSrc: "https://plausible.example/script.js" },
      {
        name: "matomo",
        trackerUrl: "https://analytics.example/matomo.php",
        siteId: "1",
        eventCategory: "Sandbox",
      },
    ],
    events: true,
  });
  const injected: string[] = [];
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);

  const harness = createDocumentHarness();
  const calls: string[] = [];
  const fathom = {
    trackEvent(name: string) { calls.push(name); },
    trackPageview() {},
  };
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/analytics/" },
  };
  vm.runInNewContext(injected[0]?.slice("page:".length) ?? "", context);
  assert.deepEqual(Array.from(context.astroAnalytics.providers), ["fathom", "plausible", "matomo"]);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "adapter-not-loaded",
    plausible: "adapter-not-loaded",
    matomo: "adapter-not-loaded",
  });
  assert.equal(context.astroAnalytics.track("journey").reason, "adapter-not-loaded");

  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track(" ", { unsafe: {} }))),
    {
      ok: false,
      providers: {
        fathom: { ok: false, reason: "invalid-event" },
        plausible: { ok: false, reason: "invalid-event" },
        matomo: { ok: false, reason: "invalid-event" },
      },
      reason: "invalid-event",
    },
  );
  assert.deepEqual(calls, []);

  const script = harness.appended[0] ?? {};
  context.document.currentScript = script;
  context.fathom = fathom;
  context.document.currentScript = undefined;
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "adapter-not-loaded",
    matomo: "adapter-not-loaded",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("journey"))),
    {
      ok: false,
      providers: {
        fathom: { ok: true },
        plausible: { ok: false, reason: "adapter-not-loaded" },
        matomo: { ok: false, reason: "adapter-not-loaded" },
      },
    },
  );
  assert.deepEqual(calls, ["journey"]);

  const plausibleScript = harness.appended[1] ?? {};
  const plausibleCalls = activatePlausible(context, plausibleScript);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "ready",
    matomo: "adapter-not-loaded",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("both-ready"))),
    {
      ok: false,
      providers: {
        fathom: { ok: true },
        plausible: { ok: true },
        matomo: { ok: false, reason: "adapter-not-loaded" },
      },
    },
  );
  assert.deepEqual(calls, ["journey", "both-ready"]);
  assert.deepEqual(plausibleCalls.at(-1), ["both-ready"]);

  const matomoScript = harness.appended[2] ?? {};
  const matomoCommands = activateMatomo(context, matomoScript);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "ready",
    matomo: "ready",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("all-ready"))),
    {
      ok: true,
      providers: {
        fathom: { ok: true },
        plausible: { ok: true },
        matomo: { ok: true },
      },
    },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(matomoCommands.at(-1))), [
    "trackEvent",
    "Sandbox",
    "all-ready",
  ]);
  const matomoPush = context._paq.push;
  context._paq.push = () => { throw new Error("transient"); };
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("matomo-broken"))), {
    ok: false,
    providers: {
      fathom: { ok: true },
      plausible: { ok: true },
      matomo: { ok: false, reason: "adapter-not-loaded" },
    },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "ready",
    matomo: "adapter-not-loaded",
  });
  context._paq.push = matomoPush;
  vm.runInNewContext(injected[0]?.slice("page:".length) ?? "", context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.track("all-recovered"))), {
    ok: true,
    providers: {
      fathom: { ok: true },
      plausible: { ok: true },
      matomo: { ok: true },
    },
  });
});

test("Plausible initializes manual Astro pageviews and forwards event properties", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/landing/" },
  };
  executePlausibleBootstrap(context, {
    captureOnLocalhost: true,
    endpoint: "https://plausible.example/api/event",
  });

  assert.equal(harness.appended.length, 1);
  const script = harness.appended[0] ?? {};
  assert.equal(script.id, PLAUSIBLE_SCRIPT_ID);
  assert.equal(script.src, "https://plausible.example/js/pa-TEST.js");
  assert.equal(script.async, true);
  assert.deepEqual(script.attributes, {
    "data-cwl-astro-analytics": "plausible-v1",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.plausible.o)), {
    autoCapturePageviews: false,
    captureOnLocalhost: true,
    endpoint: "https://plausible.example/api/event",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "adapter-not-loaded",
  });

  const plausibleCalls = activatePlausible(context, script);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "ready",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(plausibleCalls)), [
    ["pageview", { url: "https://example.test/landing/" }],
  ]);
  assert.deepEqual(
    JSON.parse(JSON.stringify(vm.runInNewContext(
      'astroAnalytics.track("signup", { plan: "pro", seats: 3, annual: true })',
      context,
    ))),
    { ok: true, providers: { plausible: { ok: true } } },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(plausibleCalls[1])), [
    "signup",
    { props: { plan: "pro", seats: "3", annual: "true" } },
  ]);
  const oversized = vm.runInNewContext(
    'astroAnalytics.track("oversized", Object.fromEntries(Array.from({ length: 31 }, (_, index) => ["key" + index, index])))',
    context,
  );
  assert.equal(oversized.providers.plausible.reason, "invalid-event");
  assert.equal(plausibleCalls.length, 2);

  context.location.href = "https://example.test/next/";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(plausibleCalls[2])), [
    "pageview",
    { url: "https://example.test/next/" },
  ]);
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(plausibleCalls[3])), [
    "pageview",
    { url: "https://example.test/next/" },
  ]);
});

test("Plausible runtime reentry deduplicates and script failure revokes owned state", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(context);
  executePlausibleBootstrap(context);
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);

  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(script.isConnected, false);
  assert.equal(context.plausible, undefined);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "adapter-not-loaded",
  });

  executePlausibleBootstrap(context);
  assert.equal(harness.appended.length, 2);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
  const replacement = harness.appended[1] ?? {};
  const calls = activatePlausible(context, replacement);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "ready",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["pageview", { url: "https://example.test/" }],
  ]);

  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  (script.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "ready",
  });
  assert.equal(replacement.isConnected, true);
});

test("Plausible load without its initialized marker fails closed", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(context);
  const script = harness.appended[0] ?? {};
  assert.doesNotThrow(() => {
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  });
  assert.equal(context.plausible, undefined);
  assert.equal(script.isConnected, false);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "adapter-not-loaded",
  });
});

test("Plausible retries after a nonconforming script replacement without deleting later globals", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(context);
  const failedScript = harness.appended[0] ?? {};
  const nonconformingReplacement = {};
  context.plausible = nonconformingReplacement;
  (failedScript.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(context.plausible, nonconformingReplacement);
  assert.equal(failedScript.isConnected, false);

  vm.runInNewContext("delete globalThis.plausible", context);
  executePlausibleBootstrap(context);
  assert.equal(harness.appended.length, 2);
  const retryScript = harness.appended[1] ?? {};
  const calls = activatePlausible(context, retryScript);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "ready",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["pageview", { url: "https://example.test/" }],
  ]);

  const unrelated = () => undefined;
  context.plausible = unrelated;
  (failedScript.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
  assert.equal(context.plausible, unrelated);
});

test("Plausible retries after an exception before cleanup is installed", () => {
  const harness = createDocumentHarness();
  const originalGetElementById = harness.document.getElementById as (id: string) => unknown;
  let throws = true;
  harness.document.getElementById = (id: string) => {
    if (throws) throw new Error("hostile lookup");
    return originalGetElementById(id);
  };
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  assert.doesNotThrow(() => executePlausibleBootstrap(context));
  assert.equal(harness.appended.length, 0);
  throws = false;
  executePlausibleBootstrap(context);
  assert.equal(harness.appended.length, 1);
  activatePlausible(context, harness.appended[0] ?? {});
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    plausible: "ready",
  });
});

test("Plausible consent and occupied-global states fail closed", () => {
  const pendingHarness = createDocumentHarness();
  const pendingContext: vm.Context = {
    document: pendingHarness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(pendingContext, { consentMode: "external" });
  assert.equal(pendingHarness.appended.length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(pendingContext.astroAnalytics.status())), {
    plausible: "consent-pending",
  });
  assert.equal(pendingContext.astroAnalytics.track("signup").reason, "consent-pending");

  const occupiedHarness = createDocumentHarness();
  const original = () => undefined;
  const occupiedContext: vm.Context = {
    document: occupiedHarness.document,
    location: { href: "https://example.test/" },
    plausible: original,
  };
  executePlausibleBootstrap(occupiedContext);
  assert.equal(occupiedHarness.appended.length, 0);
  assert.equal(occupiedContext.plausible, original);
  assert.deepEqual(JSON.parse(JSON.stringify(occupiedContext.astroAnalytics.status())), {
    plausible: "adapter-not-loaded",
  });
});

test("Plausible pageview and event switches remain independent", () => {
  const pageviewHarness = createDocumentHarness();
  const pageviewContext: vm.Context = {
    document: pageviewHarness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(pageviewContext, { events: false });
  const pageviewScript = pageviewHarness.appended[0] ?? {};
  const pageviewCalls = activatePlausible(pageviewContext, pageviewScript);
  assert.equal(pageviewContext.astroAnalytics, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(pageviewCalls)), [
    ["pageview", { url: "https://example.test/" }],
  ]);

  const eventHarness = createDocumentHarness();
  const eventContext: vm.Context = {
    document: eventHarness.document,
    location: { href: "https://example.test/" },
  };
  executePlausibleBootstrap(eventContext, { pageviews: "none" });
  const eventScript = eventHarness.appended[0] ?? {};
  const eventCalls = activatePlausible(eventContext, eventScript);
  assert.deepEqual(eventCalls, []);
  assert.equal(eventContext.astroAnalytics.track("event-only").ok, true);
  assert.deepEqual(eventCalls, [["event-only"]]);
});

test("client coordinator rejects a conflicting provider set on reentry", () => {
  const context: vm.Context = {};
  vm.runInNewContext(createBootstrapScript({
    events: true,
    providers: ["fathom", "plausible"],
    runtimeToken: "shared-runtime",
  }), context);
  const client = context.astroAnalytics;

  vm.runInNewContext(createBootstrapScript({
    events: true,
    providers: ["google-analytics"],
    runtimeToken: "shared-runtime",
  }), context);

  assert.equal(context.astroAnalytics, client);
  assert.deepEqual(Array.from(context.astroAnalytics.providers), ["fathom", "plausible"]);
});

test("matching Fathom integrations share runtime proof and load one vendor", () => {
  const config = { provider: { name: "fathom" as const, siteId: "ABCDEFG" } };
  const firstInjected: string[] = [];
  const secondInjected: string[] = [];
  runSetup(astroAnalytics(config), "build", firstInjected);
  runSetup(astroAnalytics(config), "build", secondInjected);
  assert.equal(firstInjected.length, 1);
  assert.deepEqual(secondInjected, firstInjected);

  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  vm.runInNewContext(firstInjected[0]?.slice("page:".length) ?? "", context);
  vm.runInNewContext(secondInjected[0]?.slice("page:".length) ?? "", context);
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
});

test("reentry cannot infer owned-script readiness from an unrelated Fathom global", () => {
  const harness = createDocumentHarness();
  const eventCalls: string[] = [];
  const pageviewCalls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { eventCalls.push(name); },
      trackPageview() { pageviewCalls.push(context.location.href); },
    },
    location: { href: "https://example.test/" },
  };

  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  const loadListeners = (script.listeners as Map<string, Array<() => void>>).get("load") ?? [];
  assert.equal(loadListeners.length, 1);

  executeFathomBootstrap(context);
  assert.equal(harness.appended.length, 1);
  assert.equal((script.listeners as Map<string, Array<() => void>>).get("load")?.length, 1);
  assert.equal(context.astroAnalytics.track("before-owned-load").reason, "adapter-not-loaded");
  assert.deepEqual(eventCalls, []);
  assert.deepEqual(pageviewCalls, []);

  loadListeners[0]?.();
  assert.equal(context.astroAnalytics.track("after-current-load").ok, true);
  assert.deepEqual(eventCalls, ["after-current-load"]);
  assert.deepEqual(pageviewCalls, ["https://example.test/"]);
});

test("Fathom event status requires trackEvent even when pageviews are ready", () => {
  const harness = createDocumentHarness();
  const pageviews: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackPageview() { pageviews.push(context.location.href); },
    },
    location: { href: "https://example.test/" },
  };
  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(pageviews, ["https://example.test/"]);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "adapter-not-loaded",
  });
  assert.equal(context.astroAnalytics.track("event").reason, "adapter-not-loaded");
});

test("substituted public readiness cannot activate or suppress owned-script reuse", () => {
  {
    const harness = createDocumentHarness();
    const eventCalls: string[] = [];
    const pageviewCalls: string[] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: {
        trackEvent(name: string) { eventCalls.push(name); },
        trackPageview() { pageviewCalls.push(context.location.href); },
      },
      location: { href: "https://example.test/loading" },
    };
    executeFathomBootstrap(context);
    const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
    const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
    const forged = Object.freeze({ ...legitimate, readiness: Object.freeze({ ready: true }) });
    Reflect.defineProperty(harness.document, stateKey, {
      configurable: true,
      value: forged,
      writable: true,
    });
    assert.equal(Reflect.defineProperty(harness.appended[0] ?? {}, stateKey, {
      configurable: true,
      value: forged,
      writable: true,
    }), false);

    executeFathomBootstrap(context);

    assert.equal(harness.appended.length, 1);
    assert.equal(Reflect.get(harness.document, stateKey), legitimate);
    assert.equal(context.astroAnalytics.track("forged-ready").reason, "adapter-not-loaded");
    assert.deepEqual(eventCalls, []);
    assert.deepEqual(pageviewCalls, []);
  }

  {
    const harness = createDocumentHarness();
    const pageviewCalls: string[] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackPageview() { pageviewCalls.push(context.location.href); } },
      location: { href: "https://example.test/loaded" },
    };
    executeFathomBootstrap(context);
    const first = harness.appended[0] ?? {};
    (first.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
    const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
    const forged = Object.freeze({ ...legitimate, readiness: Object.freeze({ ready: false }) });
    Reflect.defineProperty(harness.document, stateKey, {
      configurable: true,
      value: forged,
      writable: true,
    });
    assert.equal(Reflect.defineProperty(first, stateKey, {
      configurable: true,
      value: forged,
      writable: true,
    }), false);

    executeFathomBootstrap(context);

    assert.equal(harness.appended.length, 1);
    assert.equal(Reflect.get(harness.document, stateKey), legitimate);
    assert.equal(first.isConnected, true);
    context.location.href = "https://example.test/after-recovery";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    assert.deepEqual(pageviewCalls, [
      "https://example.test/loaded",
      "https://example.test/after-recovery",
    ]);
  }
});

test("a copied immutable binding on a new lookalike script is never authoritative", () => {
  for (const loaded of [false, true]) {
    for (const events of [false, true]) {
      const attributes: Record<string, string> = {
        "data-auto": "false",
        "data-cwl-astro-analytics": "fathom-v1",
        "data-cwl-pageviews": "provider",
        "data-site": "ABCDEFG",
      };
      const lookalike: Record<string, unknown> = {
        async: false,
        defer: true,
        id: `${FATHOM_SCRIPT_ID}-owned`,
        isConnected: true,
        noModule: false,
        src: "https://cdn.usefathom.com/script.js",
        tagName: "SCRIPT",
        type: "",
        getAttribute(name: string) { return attributes[name] ?? null; },
        remove() { this.isConnected = false; },
      };
      const existingElements: Record<string, unknown>[] = [];
      const harness = createDocumentHarness(existingElements);
      const eventCalls: string[] = [];
      const pageviewCalls: string[] = [];
      const context: vm.Context = {
        document: harness.document,
        fathom: {
          trackEvent(name: string) { eventCalls.push(name); },
          trackPageview() { pageviewCalls.push(context.location.href); },
        },
        location: { href: "https://example.test/start" },
      };
      executeFathomBootstrap(context, { events });
      const original = harness.appended[0] ?? {};
      existingElements.push(lookalike);
      if (loaded) {
        (original.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
      }
      const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
      const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
      const forged = Object.freeze({
        ...legitimate,
        readiness: Object.freeze({ ready: true }),
        script: lookalike,
      });
      assert.equal(Reflect.defineProperty(lookalike, stateKey, {
        configurable: false,
        value: forged,
        writable: false,
      }), true);
      Reflect.defineProperty(harness.document, stateKey, {
        configurable: true,
        value: forged,
        writable: true,
      });

      executeFathomBootstrap(context, { events });

      assert.equal(Reflect.get(harness.document, stateKey), legitimate);
      assert.equal(original.isConnected, true);
      assert.equal(lookalike.isConnected, true);
      assert.equal(harness.appended.length, 1);
      if (!loaded) {
        assert.equal(context.astroAnalytics?.track("before-load").reason, events ? "adapter-not-loaded" : undefined);
        (original.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
      }
      if (events) assert.equal(context.astroAnalytics.track("after-load").ok, true);
      assert.deepEqual(eventCalls, events ? ["after-load"] : []);
      assert.deepEqual(pageviewCalls, ["https://example.test/start"]);
    }
  }
});

test("temporary inspection-state replacement cannot consume terminal script outcomes", () => {
  {
    const harness = createDocumentHarness();
    const pageviewCalls: string[] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackPageview() { pageviewCalls.push(context.location.href); } },
      location: { href: "https://example.test/start" },
    };
    executeFathomBootstrap(context);
    const script = harness.appended[0] ?? {};
    const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
    const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
    Reflect.defineProperty(harness.document, stateKey, {
      configurable: true,
      value: Object.freeze({ ...legitimate, readiness: Object.freeze({ ready: false }) }),
      writable: true,
    });

    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    executeFathomBootstrap(context);
    context.location.href = "https://example.test/next";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();

    assert.equal(Reflect.get(harness.document, stateKey), legitimate);
    assert.deepEqual(pageviewCalls, ["https://example.test/start", "https://example.test/next"]);
  }

  {
    const harness = createDocumentHarness();
    const pageviewCalls: string[] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackPageview() { pageviewCalls.push(context.location.href); } },
      location: { href: "https://example.test/retry" },
    };
    executeFathomBootstrap(context, { events: false });
    const first = harness.appended[0] ?? {};
    const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
    const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
    Reflect.defineProperty(harness.document, stateKey, {
      configurable: true,
      value: Object.freeze({ ...legitimate }),
      writable: true,
    });

    (first.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();
    executeFathomBootstrap(context, { events: false });
    const replacement = harness.appended[1] ?? {};
    (replacement.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

    assert.equal(first.isConnected, false);
    assert.equal(replacement.isConnected, true);
    assert.deepEqual(pageviewCalls, ["https://example.test/retry"]);
  }
});

test("reentry preserves the in-flight navigation guard until Astro page-load", () => {
  for (const pageviews of ["provider", "astro"] as const) {
    const harness = createDocumentHarness();
    const calls: Array<{ canonical: string; href: string }> = [];
    const context: vm.Context = {
      canonical: "https://example.test/start",
      document: harness.document,
      fathom: {
        trackPageview() {
          calls.push({ canonical: context.canonical, href: context.location.href });
        },
      },
      location: { href: "https://example.test/start" },
    };
    harness.document.querySelector = () => ({ href: context.canonical });
    executeFathomBootstrap(context, { pageviews });
    const script = harness.appended[0] ?? {};
    context.location.href = "https://example.test/next";
    executeFathomBootstrap(context, { pageviews });

    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    assert.deepEqual(calls, []);
    context.canonical = "https://example.test/next";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    assert.deepEqual(calls, [{
      canonical: "https://example.test/next",
      href: "https://example.test/next",
    }]);
  }
});

test("reentry preserves a completed pending navigation through readiness and prerender", () => {
  for (const pageviews of ["provider", "astro"] as const) {
    for (const prerendering of [false, true]) {
      const harness = createDocumentHarness();
      const calls: string[] = [];
      harness.document.prerendering = prerendering;
      const context: vm.Context = {
        document: harness.document,
        fathom: { trackPageview() { calls.push(context.location.href); } },
        location: { href: "https://example.test/start" },
      };
      executeFathomBootstrap(context, { pageviews });
      const script = harness.appended[0] ?? {};
      context.location.href = "https://example.test/next";
      for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();

      executeFathomBootstrap(context, { pageviews });
      assert.equal(harness.appended.length, 1);
      assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
      (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

      if (prerendering) {
        assert.deepEqual(calls, []);
        harness.document.prerendering = false;
        for (const listener of harness.documentListeners.get("prerenderingchange") ?? []) listener();
      }
      assert.deepEqual(calls, ["https://example.test/next"]);
    }
  }
});

test("Fathom runtime installs the official embed and connects track", () => {
  const harness = createDocumentHarness();
  const calls: unknown[][] = [];
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context, { canonical: false, honorDnt: true });

  assert.equal(harness.appended.length, 1);
  const script = harness.appended[0] ?? {};
  assert.equal(script.id, FATHOM_SCRIPT_ID);
  assert.equal(script.src, "https://cdn.usefathom.com/script.js");
  assert.equal(script.async, false);
  assert.equal(script.defer, true);
  assert.deepEqual(script.attributes, {
    "data-auto": "false",
    "data-canonical": "false",
    "data-cwl-astro-analytics": "fathom-v1",
    "data-cwl-pageviews": "provider",
    "data-honor-dnt": "true",
    "data-site": "ABCDEFG",
  });
  const unloaded = context.astroAnalytics.track("signup");
  assert.equal(unloaded.ok, false);
  assert.equal(unloaded.reason, "adapter-not-loaded");
  assert.equal(
    (vm.runInNewContext('astroAnalytics.track("purchase", { _value: -1 })', context) as { reason: string }).reason,
    "adapter-not-loaded",
  );

  context.document.currentScript = script;
  context.fathom = {
    trackEvent(...args: unknown[]) {
      calls.push(args);
    },
    trackPageview() {},
  };
  context.document.currentScript = undefined;
  assert.equal(context.astroAnalytics.track("preexisting-api").reason, "adapter-not-loaded");
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(context.astroAnalytics.track("").reason, "invalid-event");
  assert.equal(context.astroAnalytics.track("x".repeat(129)).reason, "invalid-event");
  assert.equal((vm.runInNewContext('astroAnalytics.track("bad", [])', context) as { reason: string }).reason, "invalid-event");
  assert.equal(
    (vm.runInNewContext(
      'astroAnalytics.track("bad", Object.setPrototypeOf(() => {}, Object.prototype))',
      context,
    ) as { reason: string }).reason,
    "invalid-event",
  );
  assert.equal((vm.runInNewContext('astroAnalytics.track("bad", { value: Number.NaN })', context) as { reason: string }).reason, "invalid-event");
  assert.equal(context.astroAnalytics.track(" signup ").ok, true);
  assert.equal((vm.runInNewContext('astroAnalytics.track("purchase", { _value: 9900 })', context) as { ok: boolean }).ok, true);
  assert.equal(
    (vm.runInNewContext('astroAnalytics.track("purchase", { _value: 1.5 })', context) as { reason: string }).reason,
    "invalid-event",
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.[0], "signup");
  assert.equal(calls[0]?.length, 1);
  assert.equal(calls[1]?.[0], "purchase");
  assert.equal((calls[1]?.[1] as { _value?: number })._value, 9900);
});

test("a later validation-only fallback cannot replace the Fathom event client", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { calls.push(name); },
      trackPageview() {},
    },
  };
  executeFathomBootstrap(context);
  const fathomClient = context.astroAnalytics;
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  executeBootstrap(context);

  assert.equal(context.astroAnalytics, fathomClient);
  assert.equal(context.astroAnalytics.track("mixed-provider").ok, true);
  assert.deepEqual(calls, ["mixed-provider"]);
});

test("Fathom consent modes fail closed without loading the vendor", () => {
  for (const consentMode of ["deferred", "external"] as const) {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document };
    executeFathomBootstrap(context, { consentMode });
    assert.equal(harness.appended.length, 0);
    assert.equal(context.astroAnalytics.track("view").reason, "consent-pending");
    assert.equal(
      (vm.runInNewContext('astroAnalytics.track("purchase", { _value: -1 })', context) as { reason: string }).reason,
      "consent-pending",
    );
  }
});

test("a pending consent reconfiguration is rejected after immediate loading begins", () => {
  const harness = createDocumentHarness();
  const eventCalls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { eventCalls.push(name); },
      trackPageview() {},
    },
  };

  executeFathomBootstrap(context);
  const first = harness.appended[0] ?? {};
  (first.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  executeFathomBootstrap(context, { consentMode: "deferred" });

  assert.equal(first.isConnected, true);
  assert.equal(harness.appended.length, 1);
  assert.equal(context.astroAnalytics.track("still-immediate").ok, true);
  assert.deepEqual(eventCalls, ["still-immediate"]);
});

test("a conflicting owned Fathom configuration cannot append a second vendor", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context);
  executeFathomBootstrap(context, { siteId: "DIFFERENT" });
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
});

test("events false invalidates an earlier event client without stopping pageviews", () => {
  const harness = createDocumentHarness();
  const eventCalls: string[] = [];
  const pageCalls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { eventCalls.push(name); },
      trackPageview() { pageCalls.push(context.location.href); },
    },
    location: { href: "https://example.test/" },
  };

  executeFathomBootstrap(context, { events: true });
  const retainedClient = context.astroAnalytics;
  const first = harness.appended[0] ?? {};
  (first.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  const scriptListeners = first.listeners as Map<string, Array<() => void>>;
  executeFathomBootstrap(context, { events: false });
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
  assert.equal(scriptListeners.get("load")?.length, 1);
  assert.equal(scriptListeners.get("error")?.length, 1);

  assert.equal(retainedClient.track("disabled").reason, "adapter-not-loaded");
  assert.deepEqual(eventCalls, []);
  context.location.href = "https://example.test/next";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  assert.deepEqual(pageCalls, ["https://example.test/", "https://example.test/next"]);
});

test("events true enables the client on a later matching bootstrap", () => {
  const harness = createDocumentHarness();
  const eventCalls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { eventCalls.push(name); },
      trackPageview() {},
    },
    location: { href: "https://example.test/" },
  };

  executeFathomBootstrap(context, { events: false });
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.equal(context.astroAnalytics, undefined);

  executeFathomBootstrap(context, { events: true });

  const enabledClient = (context as {
    astroAnalytics?: { track(name: string): { ok: boolean } };
  }).astroAnalytics;
  assert.notEqual(enabledClient, undefined);
  assert.equal(enabledClient?.track("enabled").ok, true);
  assert.deepEqual(eventCalls, ["enabled"]);
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
});

test("a fresh pending configuration can be replaced before vendor loading begins", () => {
  for (const consentMode of ["deferred", "external"] as const) {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document };
    executeFathomBootstrap(context, { consentMode });
    assert.equal(harness.appended.length, 0);
    assert.equal(context.astroAnalytics.track("pending").reason, "consent-pending");

    executeFathomBootstrap(context);
    assert.equal(harness.appended.length, 1);
    assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
  }
});

test("a replaced pending-consent client is invalidated when events are disabled", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context, { consentMode: "external", events: true });
  const retainedClient = context.astroAnalytics;
  assert.equal(retainedClient.track("pending").reason, "consent-pending");

  executeFathomBootstrap(context, { consentMode: "external", events: false });

  assert.equal(retainedClient.track("superseded").reason, "adapter-not-loaded");
  assert.equal(harness.appended.length, 0);
});

test("Fathom pageviews still load when optional client installation fails", () => {
  const harness = createDocumentHarness();
  const target = { document: harness.document, Symbol };
  const substitutedRoot = new Proxy(target, {
    getOwnPropertyDescriptor(innerTarget, property) {
      if (property === "astroAnalytics") throw new Error("hostile client descriptor");
      return Reflect.getOwnPropertyDescriptor(innerTarget, property);
    },
  });
  const context: vm.Context = { globalThis: substitutedRoot };

  assert.doesNotThrow(() => executeFathomBootstrap(context));
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.appended[0]?.src, "https://cdn.usefathom.com/script.js");
});

test("Fathom preserves an unrelated colliding DOM element", () => {
  const unrelated = { id: FATHOM_SCRIPT_ID, tagName: "DIV" };
  const harness = createDocumentHarness(unrelated);
  executeFathomBootstrap({ document: harness.document });

  assert.equal(harness.appended.length, 1);
  assert.equal(harness.appended[0]?.id, `${FATHOM_SCRIPT_ID}-owned`);
  assert.equal(unrelated.tagName, "DIV");
});

test("Fathom selects and rediscovers an unused fallback after multiple ID collisions", () => {
  const unrelated = [
    { id: FATHOM_SCRIPT_ID, tagName: "DIV" },
    { id: `${FATHOM_SCRIPT_ID}-owned`, tagName: "DIV" },
  ];
  const harness = createDocumentHarness(unrelated);
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context);
  executeFathomBootstrap(context);

  assert.equal(harness.appended.length, 1);
  assert.equal(harness.appended[0]?.id, `${FATHOM_SCRIPT_ID}-owned-2`);
});

test("an inert matching script cannot suppress Fathom initialization", () => {
  const attributes = {
    "data-auto": "false",
    "data-cwl-astro-analytics": "fathom-v1",
    "data-cwl-pageviews": "provider",
    "data-site": "ABCDEFG",
  };
  const inert = {
    defer: true,
    getAttribute(name: string) { return attributes[name as keyof typeof attributes] ?? null; },
    id: FATHOM_SCRIPT_ID,
    isConnected: true,
    noModule: false,
    src: "https://cdn.usefathom.com/script.js",
    tagName: "SCRIPT",
    type: "application/json",
  };
  const harness = createDocumentHarness(inert);
  executeFathomBootstrap({ document: harness.document });
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.appended[0]?.id, `${FATHOM_SCRIPT_ID}-owned`);
});

test("Fathom reentry reuses a proven detached script without duplicating its pageview", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/" },
  };

  executeFathomBootstrap(context, { pageviews: "astro" });
  const first = harness.appended[0] ?? {};
  const firstLoad = (first.listeners as Map<string, Array<() => void>>).get("load")?.[0];
  firstLoad?.();
  assert.deepEqual(calls, ["https://example.test/"]);

  (first.remove as () => void)();
  executeFathomBootstrap(context, { pageviews: "astro" });
  assert.equal(harness.appended.length, 1);
  context.location.href = "https://example.test/next";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();

  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 1);
  assert.deepEqual(calls, [
    "https://example.test/",
    "https://example.test/next",
  ]);
});

test("untrusted disconnected state is replaced without invoking saved cleanup", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context);
  const first = harness.appended[0] ?? {};
  (first.remove as () => void)();
  harness.document.removeEventListener = () => { throw new Error("cleanup failed"); };

  assert.doesNotThrow(() => executeFathomBootstrap(context));
  assert.equal(harness.appended.length, 2);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 2);
});

test("a superseded pending script cannot send after its replacement becomes current", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/" },
  };
  executeFathomBootstrap(context);
  const first = harness.appended[0] ?? {};
  const firstLoad = (first.listeners as Map<string, Array<() => void>>).get("load")?.[0];
  (first.remove as () => void)();
  executeFathomBootstrap(context);
  const second = harness.appended[1] ?? {};
  const secondLoad = (second.listeners as Map<string, Array<() => void>>).get("load")?.[0];

  secondLoad?.();
  firstLoad?.();
  assert.deepEqual(calls, ["https://example.test/"]);

  context.location.href = "https://example.test/next";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  assert.deepEqual(calls, ["https://example.test/", "https://example.test/next"]);
});

test("Fathom retries after a failed script and reuses a valid live script", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context);
  executeFathomBootstrap(context);
  assert.equal(harness.appended.length, 1);

  const first = harness.appended[0] ?? {};
  for (const error of (first.listeners as Map<string, Array<() => void>>).get("error") ?? []) error();
  assert.equal(harness.documentListeners.get("astro:page-load")?.length ?? 0, 0);
  executeFathomBootstrap(context);
  assert.equal(harness.appended.length, 2);
});

test("Fathom error cleanup survives a frozen exposed lifecycle", () => {
  const harness = createDocumentHarness();
  const context: vm.Context = { document: harness.document };
  executeFathomBootstrap(context);
  const first = harness.appended[0] ?? {};
  const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
  const state = Reflect.get(harness.document, stateKey) as { lifecycle: object };
  Object.freeze(state.lifecycle);

  (first.listeners as Map<string, Array<() => void>>).get("error")?.[0]?.();

  assert.equal(first.isConnected, false);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length ?? 0, 0);
  executeFathomBootstrap(context);
  assert.equal(harness.appended.length, 2);
});

test("a loaded script without the Fathom pageview API fails and can retry", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/" },
  };
  executeFathomBootstrap(context);
  const first = harness.appended[0] ?? {};

  (first.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(first.isConnected, false);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length ?? 0, 0);
  executeFathomBootstrap(context);
  const second = harness.appended[1] ?? {};
  activateFathom(context, second, { trackPageview() { calls.push(context.location.href); } });
  assert.deepEqual(calls, ["https://example.test/"]);
});

test("provider pageviews wait for Astro's post-swap page-load event", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/old" },
  };
  executeFathomBootstrap(context, { pageviews: "provider" });
  const script = harness.appended[0] ?? {};
  const load = (script.listeners as Map<string, Array<() => void>>).get("load")?.[0];
  load?.();

  context.location.href = "https://example.test/new";
  assert.deepEqual(calls, ["https://example.test/old"]);
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  assert.deepEqual(calls, ["https://example.test/old", "https://example.test/new"]);
});

test("delayed Fathom load cannot consume an in-flight navigation before Astro swaps", () => {
  for (const pageviews of ["provider", "astro"] as const) {
    const harness = createDocumentHarness();
    const calls: Array<{ canonical: string; href: string }> = [];
    const context: vm.Context = {
      canonical: "https://example.test/old",
      document: harness.document,
      fathom: {
        trackPageview() {
          calls.push({ canonical: context.canonical, href: context.location.href });
        },
      },
      location: { href: "https://example.test/old" },
    };
    executeFathomBootstrap(context, { pageviews });
    const script = harness.appended[0] ?? {};
    const load = (script.listeners as Map<string, Array<() => void>>).get("load")?.[0];

    context.location.href = "https://example.test/new";
    load?.();
    assert.deepEqual(calls, []);
    context.canonical = "https://example.test/new";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    assert.deepEqual(calls, [{
      canonical: "https://example.test/new",
      href: "https://example.test/new",
    }]);
  }
});

test("page-load before Fathom readiness is sent once after the delayed load", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/old" },
  };
  executeFathomBootstrap(context);
  context.location.href = "https://example.test/new";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  assert.deepEqual(calls, []);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(calls, ["https://example.test/new"]);
});

test("multiple page-loads before Fathom readiness coalesce to the current page", () => {
  const harness = createDocumentHarness();
  const calls: unknown[][] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview(...args: unknown[]) { calls.push(args); } },
    location: { href: "https://example.test/start" },
  };

  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  context.location.href = "https://example.test/one";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  context.location.href = "https://example.test/two";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), [{ referrer: "https://example.test/one" }]);
});

test("stalled vendor readiness retains only one current navigation", () => {
  const harness = createDocumentHarness();
  const calls: unknown[][] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview(...args: unknown[]) { calls.push(args); } },
    location: { href: "https://example.test/start" },
  };
  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  for (let index = 0; index < 105; index += 1) {
    context.location.href = `https://example.test/page-${index}`;
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  }

  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), [{ referrer: "https://example.test/page-103" }]);
});

test("pre-ready navigation uses only the current canonical and query context", () => {
  const harness = createDocumentHarness();
  const calls: Array<{ args: unknown[]; canonical: string }> = [];
  const context: vm.Context = {
    canonical: "https://example.test/start-canonical",
    document: harness.document,
    fathom: {
      trackPageview(...args: unknown[]) {
        calls.push({ args, canonical: context.canonical });
      },
    },
    location: { href: "https://example.test/start?ref=one" },
  };
  harness.document.querySelector = () => ({ href: context.canonical });

  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  context.location.href = "https://example.test/one?ref=two";
  context.canonical = "https://example.test/one";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  context.location.href = "https://example.test/two?ref=three";
  context.canonical = "https://example.test/two";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0]?.args)), [{ referrer: "https://example.test/one?ref=two" }]);
  assert.equal(calls[0]?.canonical, "https://example.test/two");
});

test("ready completed navigations are not URL-deduplicated and pre-ready routes coalesce", () => {
  for (const readyBeforeNavigation of [true, false]) {
    const harness = createDocumentHarness();
    const calls: unknown[][] = [];
    const context: vm.Context = {
      canonical: "https://example.test/shared",
      document: harness.document,
      fathom: { trackPageview(...args: unknown[]) { calls.push(args); } },
      location: { href: "https://example.test/start" },
    };
    harness.document.querySelector = () => ({ href: context.canonical });
    executeFathomBootstrap(context);
    const script = harness.appended[0] ?? {};
    const load = (script.listeners as Map<string, Array<() => void>>).get("load")?.[0];
    if (readyBeforeNavigation) load?.();

    context.location.href = "https://example.test/one?variant=a";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    context.location.href = "https://example.test/two?variant=b";
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
    if (!readyBeforeNavigation) load?.();

    assert.equal(calls.length, readyBeforeNavigation ? 3 : 1);
  }
});

test("canonical false coalesces to the current browser navigation", () => {
  const harness = createDocumentHarness();
  const calls: Array<{ args: unknown[]; href: string }> = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackPageview(...args: unknown[]) {
        calls.push({ args, href: context.location.href });
      },
    },
    location: { href: "https://example.test/start" },
  };
  harness.document.querySelector = () => ({ href: "https://example.test/ignored" });
  executeFathomBootstrap(context, { canonical: false });
  const script = harness.appended[0] ?? {};
  context.location.href = "https://example.test/one?variant=a";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  context.location.href = "https://example.test/two?variant=b";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0]?.args)), [{ referrer: "https://example.test/one?variant=a" }]);
  assert.equal(calls[0]?.href, "https://example.test/two?variant=b");
});

test("Fathom waits for prerender activation before sending a pageview", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  harness.document.prerendering = true;
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push("pageview"); } },
    location: { href: "https://example.test/prerendered" },
  };

  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(calls, []);

  harness.document.prerendering = false;
  for (const listener of harness.documentListeners.get("prerenderingchange") ?? []) listener();
  assert.deepEqual(calls, ["pageview"]);
});

test("prerender activation listener failures cannot escape the load callback", () => {
  for (const addEventListener of [undefined, () => { throw new Error("hostile listener registration"); }]) {
    const harness = createDocumentHarness();
    harness.document.prerendering = true;
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackPageview() {} },
      location: { href: "https://example.test/prerendered" },
    };

    executeFathomBootstrap(context);
    const script = harness.appended[0] ?? {};
    harness.document.addEventListener = addEventListener;
    assert.doesNotThrow(() => {
      (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    });
  }
});

test("forged document state cannot suppress loading or substitute callbacks", () => {
  const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
  for (const forged of [
    { brand: RUNTIME_CLIENT_BRAND, pageviews: "provider", script: {}, scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG", status: "loaded" },
    { brand: RUNTIME_CLIENT_BRAND, pageviews: "provider", script: {}, scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG", status: "failed", trackPageview() { throw new Error("forged callback"); } },
  ]) {
    const harness = createDocumentHarness();
    Object.defineProperty(harness.document, stateKey, { configurable: true, value: forged });
    assert.doesNotThrow(() => executeFathomBootstrap({ document: harness.document }));
    assert.equal(harness.appended.length, 1);
  }
});

test("forged state tied to a matching connected script is preserved but cannot claim package ownership", () => {
  const attributes: Record<string, string> = {
    "data-auto": "false",
    "data-cwl-astro-analytics": "fathom-v1",
    "data-cwl-pageviews": "provider",
    "data-site": "ABCDEFG",
  };
  const lookalike: Record<string, unknown> = {
    async: false,
    defer: true,
    id: FATHOM_SCRIPT_ID,
    isConnected: true,
    noModule: false,
    src: "https://cdn.usefathom.com/script.js",
    tagName: "SCRIPT",
    type: "",
    getAttribute(name: string) { return attributes[name] ?? null; },
    remove() { this.isConnected = false; },
  };
  const harness = createDocumentHarness(lookalike);
  const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
  Reflect.defineProperty(harness.document, stateKey, {
    configurable: true,
    value: Object.freeze({
      dedupState: {},
      events: true,
      lifecycle: { active: true },
      pageLoadListener() {},
      readiness: Object.freeze({ ready: false }),
      runtimeToken: "forged-runtime-token",
      script: lookalike,
    }),
    writable: true,
  });

  executeFathomBootstrap({ document: harness.document });

  assert.equal(lookalike.isConnected, true);
  assert.equal(harness.appended.length, 1);
  assert.equal(harness.appended[0]?.id, `${FATHOM_SCRIPT_ID}-owned`);
});

test("copied document state is replaced by the immutable script-bound generation", () => {
  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: { trackPageview() { calls.push(context.location.href); } },
    location: { href: "https://example.test/" },
  };
  executeFathomBootstrap(context);
  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  const stateKey = Symbol.for("codeworkslabs.astro-analytics:fathom:v1");
  const legitimate = Reflect.get(harness.document, stateKey) as Record<string, unknown>;
  let untrustedCallbackCalls = 0;
  const copiedState = Object.freeze({
    dedupState: legitimate.dedupState,
    events: legitimate.events,
    lifecycle: { active: true },
    pageLoadListener() { untrustedCallbackCalls += 1; },
    readiness: legitimate.readiness,
    runtimeToken: legitimate.runtimeToken,
    script: legitimate.script,
  });
  Reflect.defineProperty(harness.document, stateKey, {
    configurable: true,
    value: copiedState,
    writable: true,
  });

  executeFathomBootstrap(context);
  assert.notEqual(Reflect.get(harness.document, stateKey), copiedState);
  assert.equal(Reflect.get(harness.document, stateKey), legitimate);
  assert.equal(harness.appended.length, 1);
  assert.equal(script.isConnected, true);
  context.location.href = "https://example.test/next";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();
  assert.deepEqual(calls, [
    "https://example.test/",
    "https://example.test/next",
  ]);
  assert.equal(untrustedCallbackCalls, 0);
});

test("rejected document state publication leaves no script or listener side effects", () => {
  const harness = createDocumentHarness();
  Object.preventExtensions(harness.document);
  const context: vm.Context = { document: harness.document };
  assert.doesNotThrow(() => executeFathomBootstrap(context));
  assert.doesNotThrow(() => executeFathomBootstrap(context));
  assert.equal(context.astroAnalytics.track("unavailable").reason, "adapter-not-loaded");
  assert.equal(harness.appended.length, 0);
  assert.equal(harness.documentListeners.get("astro:page-load")?.length ?? 0, 0);
});

test("hostile, unavailable, or malformed Symbol.for cannot escape Fathom bootstrap", () => {
  for (const symbolValue of [
    undefined,
    {},
    { for() { throw new Error("hostile Symbol.for"); } },
    { for() { return "head"; } },
    { for() { return null; } },
    { for() { return {}; } },
  ]) {
    const harness = createDocumentHarness();
    const target = { document: harness.document, Symbol: symbolValue };
    const context: vm.Context = { globalThis: target };
    assert.doesNotThrow(() => executeFathomBootstrap(context));
    assert.equal(harness.appended.length, 0);
  }

  const harness = createDocumentHarness();
  const target = { document: harness.document };
  Object.defineProperty(target, "Symbol", { get() { throw new Error("hostile Symbol"); } });
  assert.doesNotThrow(() => executeFathomBootstrap({ globalThis: target }));
  assert.equal(harness.appended.length, 0);
});

test("Fathom pageview modes disable vendor auto-tracking", () => {
  const providerHarness = createDocumentHarness();
  executeFathomBootstrap(
    { document: providerHarness.document },
    { pageviews: "provider" },
  );
  assert.equal(
    providerHarness.appended[0]?.attributes &&
      (providerHarness.appended[0].attributes as Record<string, string>)["data-auto"],
    "false",
  );

  for (const pageviews of ["none", "astro"] as const) {
    const harness = createDocumentHarness();
    const calls: string[] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackPageview() { calls.push("pageview"); } },
      location: { href: "https://example.test/" },
    };
    executeFathomBootstrap(context, { pageviews });
    assert.equal(
      harness.appended[0]?.attributes &&
        (harness.appended[0].attributes as Record<string, string>)["data-auto"],
      "false",
    );
    assert.equal(
      harness.documentListeners.get("astro:page-load")?.length ?? 0,
      pageviews === "none" ? 0 : 1,
    );
    if (pageviews === "none") {
      const script = harness.appended[0] ?? {};
      (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
      assert.deepEqual(calls, []);
    }
  }
});

test("bootstrap creates an exact frozen owned client", () => {
  const context: vm.Context = {};
  executeBootstrap(context);
  assert.equal(context.astroAnalytics.__astroAnalyticsBrand, RUNTIME_CLIENT_BRAND);
  assert.equal(typeof context.astroAnalytics.track, "function");
  assert.equal(Object.isFrozen(context.astroAnalytics), true);
  const result = context.astroAnalytics.track("view");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "adapter-not-loaded");
});

test("repeat bootstrap preserves the coordinator-owned client", () => {
  const context: vm.Context = {};
  executeBootstrap(context);
  const client = context.astroAnalytics;
  executeBootstrap(context);
  assert.equal(context.astroAnalytics, client);
  assert.equal(context.astroAnalytics.__astroAnalyticsBrand, RUNTIME_CLIENT_BRAND);
  assert.equal(Object.isFrozen(context.astroAnalytics), true);
});

test("unrelated and malformed state is replaced", () => {
  for (const context of [
    { __astroAnalyticsRuntime: "someone-else", astroAnalytics: { track() {} } },
    { __astroAnalyticsRuntime: "old-marker", astroAnalytics: null },
    {
      __astroAnalyticsRuntime: "old-marker",
      astroAnalytics: { __astroAnalyticsBrand: RUNTIME_CLIENT_BRAND, track() {} },
    },
    {
      __astroAnalyticsRuntime: "old-marker",
      astroAnalytics: Object.freeze({
        __astroAnalyticsBrand: RUNTIME_CLIENT_BRAND,
        track() {},
        extra: true,
      }),
    },
    {
      __astroAnalyticsRuntime: "old-marker",
      astroAnalytics: Object.freeze({
        __astroAnalyticsBrand: RUNTIME_CLIENT_BRAND,
        track() { return { ok: true }; },
      }),
    },
  ] as vm.Context[]) {
    const previous = context.astroAnalytics;
    const previousMarker = context.__astroAnalyticsRuntime;
    executeBootstrap(context);
    assert.notEqual(context.astroAnalytics, previous);
    assert.equal(context.__astroAnalyticsRuntime, previousMarker);
    assert.equal(context.astroAnalytics.__astroAnalyticsBrand, RUNTIME_CLIENT_BRAND);
    assert.equal(Object.isFrozen(context.astroAnalytics), true);
  }
});

test("hostile globals cannot make bootstrap throw", () => {
  const hostileGlobalThis: vm.Context = {};
  Object.defineProperty(hostileGlobalThis, "globalThis", {
    configurable: true,
    get() {
      throw new Error("hostile globalThis");
    },
  });
  assert.doesNotThrow(() => executeBootstrap(hostileGlobalThis));

  const throwingGetter: vm.Context = {};
  Object.defineProperty(throwingGetter, "astroAnalytics", {
    configurable: false,
    get() {
      throw new Error("hostile getter");
    },
  });
  assert.doesNotThrow(() => executeBootstrap(throwingGetter));

  const nonWritable: vm.Context = {};
  Object.defineProperty(nonWritable, "astroAnalytics", {
    configurable: false,
    value: "hostile",
    writable: false,
  });
  Object.defineProperty(nonWritable, "__astroAnalyticsRuntime", {
    configurable: false,
    value: "hostile",
    writable: false,
  });
  assert.doesNotThrow(() => executeBootstrap(nonWritable));
  assert.equal(nonWritable.astroAnalytics, "hostile");
  assert.equal(nonWritable.__astroAnalyticsRuntime, "hostile");
});

test("a substituted root proxy cannot create a partial two-global installation", () => {
  const target = {
    __astroAnalyticsRuntime: "old-marker",
    astroAnalytics: Object.freeze({ old: true }),
    Symbol,
  };
  let definedKey: PropertyKey | undefined;
  const substitutedRoot = new Proxy(target, {
    defineProperty(innerTarget, key, descriptor) {
      definedKey = key;
      return Reflect.defineProperty(innerTarget, key, descriptor);
    },
  });
  Object.defineProperty(target, "globalThis", {
    configurable: true,
    value: substitutedRoot,
    writable: true,
  });
  const context: vm.Context = { globalThis: substitutedRoot };

  assert.doesNotThrow(() => executeBootstrap(context));
  assert.equal(definedKey, "astroAnalytics");
  assert.equal(target.__astroAnalyticsRuntime, "old-marker");
  assert.equal(
    Reflect.get(target.astroAnalytics, "__astroAnalyticsBrand"),
    RUNTIME_CLIENT_BRAND,
  );
  assert.equal(Object.isFrozen(target.astroAnalytics), true);
});

test("a rejected client installation leaves the sole reserved global unchanged", () => {
  const context: vm.Context = {};
  Object.defineProperty(context, "astroAnalytics", {
    configurable: false,
    value: "hostile",
    writable: false,
  });

  assert.doesNotThrow(() => executeBootstrap(context));
  assert.equal(context.astroAnalytics, "hostile");
});

test("an unsafe accessor global preserves its original descriptor", () => {
  const context: vm.Context = {};
  const existingClient = Object.freeze({ track() { return { ok: true }; } });
  const getter = () => existingClient;
  const setter = () => { throw new Error("hostile setter"); };
  Object.defineProperty(context, "astroAnalytics", {
    configurable: false,
    enumerable: false,
    get: getter,
    set: setter,
  });
  const clientDescriptor = Object.getOwnPropertyDescriptor(context, "astroAnalytics");

  assert.doesNotThrow(() => executeBootstrap(context));
  assert.deepEqual(
    Object.getOwnPropertyDescriptor(context, "astroAnalytics"),
    clientDescriptor,
  );
});

test("a self-referential proxy that rejects installation preserves the client", () => {
  const existingClient = Object.freeze({ old: true });
  const target = {
    __astroAnalyticsRuntime: "old-marker",
    astroAnalytics: existingClient,
  };
  const substitutedRoot = new Proxy(target, {
    defineProperty(_innerTarget, key) {
      assert.equal(key, "astroAnalytics");
      return false;
    },
  });
  Object.defineProperty(target, "globalThis", {
    configurable: true,
    value: substitutedRoot,
    writable: true,
  });
  const context: vm.Context = { globalThis: substitutedRoot };

  assert.doesNotThrow(() => executeBootstrap(context));
  assert.equal(target.astroAnalytics, existingClient);
  assert.equal(target.__astroAnalyticsRuntime, "old-marker");
});

test("pageview none remains event-only across matching runtime reentry", () => {
  {
    const harness = createDocumentHarness();
    const pageviews: unknown[][] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackEvent() {}, trackPageview(...args: unknown[]) { pageviews.push(args); } },
      location: { href: "https://example.test/" },
    };
    executeFathomBootstrap(context, { pageviews: "none" });
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    executeFathomBootstrap(context, { pageviews: "none" });
    assert.deepEqual(pageviews, []);
    assert.equal(context.astroAnalytics.track("event-only").ok, true);
  }
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executePlausibleBootstrap(context, { pageviews: "none" });
    const calls = activatePlausible(context, harness.appended[0] ?? {});
    executePlausibleBootstrap(context, { pageviews: "none" });
    assert.deepEqual(calls, []);
    assert.equal(context.astroAnalytics.track("event-only").ok, true);
  }
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executeGoogleAnalyticsBootstrap(context, { pageviews: "none" });
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    executeGoogleAnalyticsBootstrap(context, { pageviews: "none" });
    const commands = (context.dataLayer as Array<ArrayLike<unknown>>).map(serializeGtagCommand);
    assert.equal(commands.some((command) => command[0] === "event" && command[1] === "page_view"), false);
    assert.equal(context.astroAnalytics.track("event_only").ok, true);
  }
});

test("ClientRouter startup waits for its first completed route across every provider", () => {
  const markClientRouter = (document: Record<string, unknown>) => {
    document.querySelector = (selector: string) => selector.includes("astro-view-transitions-enabled") ? {} : null;
  };
  {
    const harness = createDocumentHarness();
    markClientRouter(harness.document);
    const calls: unknown[][] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackEvent() {}, trackPageview(...args: unknown[]) { calls.push(args); } },
      location: { href: "https://example.test/start" },
    };
    executeFathomBootstrap(context);
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    assert.deepEqual(calls, []);
    context.location.href = "https://example.test/ready";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.equal(calls.length, 1);
  }
  {
    const harness = createDocumentHarness();
    markClientRouter(harness.document);
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/start" } };
    executePlausibleBootstrap(context);
    const calls = activatePlausible(context, harness.appended[0] ?? {});
    assert.deepEqual(calls, []);
    context.location.href = "https://example.test/ready";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.equal(calls.length, 1);
  }
  {
    const harness = createDocumentHarness();
    markClientRouter(harness.document);
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/start" } };
    executeGoogleAnalyticsBootstrap(context);
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    const commands = context.dataLayer as Array<ArrayLike<unknown>>;
    assert.equal(commands.map(serializeGtagCommand).some((command) => command[1] === "page_view"), false);
    context.location.href = "https://example.test/ready";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.equal(commands.map(serializeGtagCommand).filter((command) => command[1] === "page_view").length, 1);
  }
  {
    const harness = createDocumentHarness();
    markClientRouter(harness.document);
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/start" } };
    executeMatomoBootstrap(context);
    const commands = activateMatomo(context, harness.appended[0] ?? {});
    assert.equal(commands.some((command) => command[0] === "trackPageView"), false);
    context.location.href = "https://example.test/ready";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.equal(commands.filter((command) => command[0] === "trackPageView").length, 1);
  }
});

test("Fathom and Plausible preserve the preceding completed route as virtual referrer", () => {
  {
    const harness = createDocumentHarness();
    harness.document.referrer = "https://search.example/";
    const calls: unknown[][] = [];
    const context: vm.Context = {
      document: harness.document,
      fathom: { trackEvent() {}, trackPageview(...args: unknown[]) { calls.push(args); } },
      location: { href: "https://example.test/first" },
    };
    executeFathomBootstrap(context);
    (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    context.location.href = "https://example.test/second";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
      [{ referrer: "https://search.example/" }],
      [{ referrer: "https://example.test/first" }],
    ]);
  }
  {
    const harness = createDocumentHarness();
    harness.document.referrer = "https://search.example/";
    const payloads: Array<Record<string, unknown>> = [];
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/first" } };
    executePlausibleBootstrap(context);
    const script = harness.appended[0] ?? {};
    const stub = context.plausible as { o: { transformRequest(payload: Record<string, unknown>): Record<string, unknown> } };
    const plausible = () => { payloads.push(stub.o.transformRequest({ r: "document-default" })); };
    Object.defineProperty(plausible, "l", { value: true });
    context.document.currentScript = script;
    context.plausible = plausible;
    context.document.currentScript = undefined;
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    context.location.href = "https://example.test/second";
    harness.documentListeners.get("astro:page-load")?.[0]?.();
    assert.deepEqual(JSON.parse(JSON.stringify(payloads)), [
      { r: "https://search.example/" },
      { r: "https://example.test/first" },
    ]);
  }
});

test("GA4 pre-ready coalescing retains the completed-route title and immediate virtual referrer", () => {
  const harness = createDocumentHarness();
  harness.document.querySelector = (selector: string) => selector.includes("astro-view-transitions-enabled") ? {} : null;
  const context: vm.Context = {
    document: harness.document,
    location: { href: "https://example.test/a" },
  };
  executeGoogleAnalyticsBootstrap(context);
  harness.document.title = "A";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  context.location.href = "https://example.test/b";
  harness.document.title = "B first";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  harness.document.title = "B second";
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  (harness.appended[0]?.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  const pageviews = (context.dataLayer as Array<ArrayLike<unknown>>)
    .map(serializeGtagCommand)
    .filter((command) => command[0] === "event" && command[1] === "page_view");
  assert.deepEqual(JSON.parse(JSON.stringify(pageviews)), [["event", "page_view", {
    page_location: "https://example.test/b",
    page_referrer: "https://example.test/b",
    page_title: "B second",
    send_to: "G-TEST123",
  }]]);
});

test("mutated provider scripts and unrelated global replacements never qualify as owned vendors", () => {
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executeFathomBootstrap(context);
    const script = harness.appended[0] ?? {};
    script.src = "https://attacker.example/fathom.js";
    const unrelated = { trackEvent() {}, trackPageview() {} };
    context.document.currentScript = script;
    context.fathom = unrelated;
    context.document.currentScript = undefined;
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    assert.equal(context.fathom, unrelated);
    assert.equal(context.astroAnalytics.status().fathom, "adapter-not-loaded");
  }
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executePlausibleBootstrap(context);
    const script = harness.appended[0] ?? {};
    script.src = "https://attacker.example/plausible.js";
    const unrelated = () => undefined;
    Object.defineProperty(unrelated, "l", { value: true });
    context.document.currentScript = script;
    context.plausible = unrelated;
    context.document.currentScript = undefined;
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    assert.equal(context.plausible, unrelated);
    assert.equal(context.astroAnalytics.status().plausible, "adapter-not-loaded");
  }
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executeGoogleAnalyticsBootstrap(context);
    const script = harness.appended[0] ?? {};
    script.src = "https://attacker.example/gtag.js";
    (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
    assert.equal(context.gtag, undefined);
    assert.equal(context.dataLayer, undefined);
    assert.equal(context.astroAnalytics.status()["google-analytics"], "adapter-not-loaded");
  }
  {
    const harness = createDocumentHarness();
    const context: vm.Context = { document: harness.document, location: { href: "https://example.test/" } };
    executeMatomoBootstrap(context);
    const script = harness.appended[0] ?? {};
    script.src = "https://attacker.example/matomo.js";
    activateMatomo(context, script);
    assert.equal(context._paq, undefined);
    assert.equal(context.Matomo, undefined);
    assert.equal(context.astroAnalytics.status().matomo, "adapter-not-loaded");
  }
});
