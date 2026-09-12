import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import type { AstroIntegration } from "astro";
import astroAnalytics from "../src/index.ts";
import {
  createBootstrapScript,
  createFathomBootstrapScript,
  createGoogleAnalyticsBootstrapScript,
  createPlausibleBootstrapScript,
  FATHOM_SCRIPT_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  PLAUSIBLE_SCRIPT_ID,
  RUNTIME_CLIENT_BRAND,
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

function executeFathomBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createFathomBootstrapScript>[0]> = {},
): void {
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
  vm.runInNewContext(
    createFathomBootstrapScript(options),
    context,
    { timeout: 1_000 },
  );
}

function executePlausibleBootstrap(
  context: vm.Context,
  overrides: Partial<Parameters<typeof createPlausibleBootstrapScript>[0]> = {},
): void {
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

function activatePlausible(
  context: vm.Context,
  script: Record<string, unknown>,
  calls: unknown[][] = [],
): unknown[][] {
  const plausible = (...args: unknown[]) => { calls.push(args); };
  Object.defineProperty(plausible, "l", { value: true });
  context.plausible = plausible;
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
  harness.documentListeners.get("astro:page-load")?.[0]?.();
  assert.equal(context.dataLayer.length, callCount);
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
    ],
    events: true,
  });
  const injected: string[] = [];
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);

  const harness = createDocumentHarness();
  const calls: string[] = [];
  const context: vm.Context = {
    document: harness.document,
    fathom: {
      trackEvent(name: string) { calls.push(name); },
      trackPageview() {},
    },
    location: { href: "https://example.test/analytics/" },
  };
  vm.runInNewContext(injected[0]?.slice("page:".length) ?? "", context);
  assert.deepEqual(Array.from(context.astroAnalytics.providers), ["fathom", "plausible"]);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "adapter-not-loaded",
    plausible: "adapter-not-loaded",
  });
  assert.equal(context.astroAnalytics.track("journey").reason, "adapter-not-loaded");

  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track(" ", { unsafe: {} }))),
    {
      ok: false,
      providers: {
        fathom: { ok: false, reason: "invalid-event" },
        plausible: { ok: false, reason: "invalid-event" },
      },
      reason: "invalid-event",
    },
  );
  assert.deepEqual(calls, []);

  const script = harness.appended[0] ?? {};
  (script.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "adapter-not-loaded",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("journey"))),
    {
      ok: false,
      providers: {
        fathom: { ok: true },
        plausible: { ok: false, reason: "adapter-not-loaded" },
      },
    },
  );
  assert.deepEqual(calls, ["journey"]);

  const plausibleScript = harness.appended[1] ?? {};
  const plausibleCalls = activatePlausible(context, plausibleScript);
  assert.deepEqual(JSON.parse(JSON.stringify(context.astroAnalytics.status())), {
    fathom: "ready",
    plausible: "ready",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.astroAnalytics.track("both-ready"))),
    {
      ok: true,
      providers: {
        fathom: { ok: true },
        plausible: { ok: true },
      },
    },
  );
  assert.deepEqual(calls, ["journey", "both-ready"]);
  assert.deepEqual(plausibleCalls.at(-1), ["both-ready"]);
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
  assert.equal(context.plausible, undefined);
  assert.equal(failedScript.isConnected, false);

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

  context.fathom = {
    trackEvent(...args: unknown[]) {
      calls.push(args);
    },
    trackPageview() {},
  };
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
    getOwnPropertyDescriptor() {
      throw new Error("hostile client descriptor");
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

test("Fathom reentry supersedes an externally disconnected script", () => {
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
  const second = harness.appended[1] ?? {};
  const secondLoad = (second.listeners as Map<string, Array<() => void>>).get("load")?.[0];
  secondLoad?.();
  context.location.href = "https://example.test/next";
  for (const listener of harness.documentListeners.get("astro:page-load") ?? []) listener();

  assert.equal(harness.documentListeners.get("astro:page-load")?.length, 2);
  assert.deepEqual(calls, [
    "https://example.test/",
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
  context.fathom = { trackPageview() { calls.push(context.location.href); } };
  executeFathomBootstrap(context);
  const second = harness.appended[1] ?? {};
  (second.listeners as Map<string, Array<() => void>>).get("load")?.[0]?.();
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
  assert.equal(calls[0]?.length, 0);
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
  assert.equal(calls[0]?.length, 0);
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
  assert.equal(calls[0]?.args.length, 0);
  assert.equal(calls[0]?.canonical, "https://example.test/two");
});

test("ready distinct canonicalized navigations are not deduplicated and pre-ready routes coalesce", () => {
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
  assert.equal(calls[0]?.args.length, 0);
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

test("forged state tied to a matching connected script cannot claim package ownership", () => {
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

  assert.equal(lookalike.isConnected, false);
  assert.equal(harness.appended.length, 1);
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
