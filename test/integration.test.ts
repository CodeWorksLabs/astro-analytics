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
} from "../src/runtime.ts";

type SetupHook = NonNullable<AstroIntegration["hooks"]["astro:config:setup"]>;
type SetupContext = Parameters<SetupHook>[0];

function injectedBy(integration: ReturnType<typeof astroAnalytics>, command: SetupContext["command"] = "build"): string[] {
  const injected: string[] = [];
  integration.hooks["astro:config:setup"]?.({
    command,
    injectScript(stage, content) { injected.push(`${stage}:${content}`); },
  } as SetupContext);
  return injected;
}

function harness(router = false) {
  const appended: Record<string, any>[] = [];
  const listeners = new Map<string, Array<() => void>>();
  const document = {
    title: "Home",
    referrer: "https://referrer.example/start",
    prerendering: false,
    addEventListener(name: string, listener: () => void) {
      listeners.set(name, [...(listeners.get(name) ?? []), listener]);
    },
    removeEventListener(name: string, listener: () => void) {
      listeners.set(name, (listeners.get(name) ?? []).filter((candidate) => candidate !== listener));
    },
    querySelector(selector: string) {
      return router && selector === '[name="astro-view-transitions-enabled"]' ? {} : null;
    },
    createElement(tag: string) {
      assert.equal(tag, "script");
      const attributes: Record<string, string> = {};
      const scriptListeners = new Map<string, Array<() => void>>();
      return {
        async: true, defer: false, id: "", src: "", isConnected: false,
        addEventListener(name: string, listener: () => void) {
          scriptListeners.set(name, [...(scriptListeners.get(name) ?? []), listener]);
        },
        dispatch(name: string) { for (const listener of scriptListeners.get(name) ?? []) listener(); },
        getAttribute(name: string) { return attributes[name] ?? null; },
        setAttribute(name: string, value: string) { attributes[name] = value; },
        remove() { this.isConnected = false; },
        attributes,
      };
    },
    getElementById(id: string) { return appended.find((item) => item.id === id && item.isConnected) ?? null; },
    head: { appendChild(script: Record<string, any>) { script.isConnected = true; appended.push(script); } },
  };
  const context = vm.createContext({
    URL,
    console,
    document,
    location: { href: "https://example.test/" },
  });
  const emit = (name: string) => { for (const listener of [...(listeners.get(name) ?? [])]) listener(); };
  return { appended, context, document, emit, listeners };
}

const run = (script: string, context: vm.Context) => vm.runInContext(script, context, { timeout: 1_000 });

test("Astro integration injects once with all five providers", () => {
  const integration = astroAnalytics({
    providers: [
      { name: "fathom", siteId: "ABCDEFG" },
      { name: "plausible", scriptSrc: "https://plausible.example/script.js" },
      { name: "google-analytics", measurementId: "G-TEST123", consent: { mode: "immediate" } },
      { name: "matomo", trackerUrl: "https://analytics.example/matomo.php", siteId: "1", eventCategory: "Astro" },
      { name: "umami", websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2", scriptSrc: "https://analytics.example/script.js" },
    ],
    events: true,
  });
  const injected = injectedBy(integration);
  assert.equal(injected.length, 1);
  assert.match(injected[0]!, /fathom/);
  assert.match(injected[0]!, /plausible/);
  assert.match(injected[0]!, /google-analytics/);
  assert.match(injected[0]!, /matomo/);
  assert.match(injected[0]!, /umami/);
  assert.equal(injectedBy(integration).length, 0);
});

test("environment and disabled-provider policy suppress injection", () => {
  assert.deepEqual(injectedBy(astroAnalytics({ providers: false })), []);
  assert.deepEqual(injectedBy(astroAnalytics({ providers: [{ name: "fathom", siteId: "ABCDEFG" }] }), "dev"), []);
});

test("blocked initial routes do not create a client or provider script", () => {
  const h = harness(true);
  h.context.location.href = "https://example.test/?preview=yes";
  const injected = injectedBy(astroAnalytics({
    providers: [{ name: "fathom", siteId: "ABCDEFG" }],
    events: true,
    blockedQueryParameters: ["preview"],
  }))[0]!.slice(5);
  run(injected, h.context);
  assert.equal(h.context.astroAnalytics, undefined);
  assert.equal(h.appended.length, 0);
  h.context.location.href = "https://example.test/clean";
  h.emit("astro:page-load");
  assert.equal(h.appended.length, 1);
  assert.deepEqual(Array.from((h.context.astroAnalytics as any).providers), ["fathom"]);
});

test("Fathom loads official attributes and tracks completed routes and events", () => {
  const h = harness();
  const pageviews: unknown[] = [];
  const events: unknown[] = [];
  run(createBootstrapScript({ events: true, providers: ["fathom"], runtimeToken: "token" }), h.context);
  run(createFathomBootstrapScript({ events: true, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  const script = h.appended[0]!;
  assert.equal(script.id, FATHOM_SCRIPT_ID);
  assert.equal(script.attributes["data-site"], "ABCDEFG");
  h.context.fathom = { trackPageview(value: unknown) { pageviews.push(value); }, trackEvent(...args: unknown[]) { events.push(args); } };
  script.dispatch("load");
  assert.equal(pageviews.length, 1);
  assert.equal(h.context.astroAnalytics.track("signup", { _value: 250 }).providers.fathom.ok, true);
  assert.equal(events.length, 1);
  h.context.location.href = "https://example.test/next";
  h.document.title = "Next";
  h.emit("astro:page-load");
  assert.equal(pageviews.length, 2);
});

test("ClientRouter pageviews wait for Astro page-load and preserve virtual referrers", () => {
  const h = harness(true);
  const pageviews: any[] = [];
  run(createFathomBootstrapScript({ events: false, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  h.context.fathom = { trackPageview(value: unknown) { pageviews.push(value); } };
  h.appended[0]!.dispatch("load");
  assert.equal(pageviews.length, 0);
  h.emit("astro:page-load");
  h.context.location.href = "https://example.test/next";
  h.emit("astro:before-preparation");
  assert.equal(pageviews.length, 1);
  h.emit("astro:page-load");
  assert.equal(pageviews[1].referrer, "https://example.test/");
});

test("deferred and external consent load no vendor and report pending", () => {
  for (const consentMode of ["deferred", "external"] as const) {
    const h = harness();
    run(createBootstrapScript({ events: true, providers: ["fathom"], runtimeToken: "token" }), h.context);
    run(createFathomBootstrapScript({ consentMode, events: true, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
    assert.equal(h.appended.length, 0);
    assert.equal(h.context.astroAnalytics.status().fathom, "consent-pending");
    assert.equal(h.context.astroAnalytics.track("signup").reason, "consent-pending");
  }
});

test("Plausible configures manual pageviews and bounded props", () => {
  const h = harness();
  run(createBootstrapScript({ events: true, providers: ["plausible"], runtimeToken: "token" }), h.context);
  run(createPlausibleBootstrapScript({ events: true, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://plausible.example/script.js" }), h.context);
  const script = h.appended[0]!;
  const options = h.context.plausible.o;
  const queue = h.context.plausible.q;
  const plausible: any = (...args: unknown[]) => queue.push(args);
  plausible.l = true;
  h.context.plausible = plausible;
  script.dispatch("load");
  assert.equal(options.autoCapturePageviews, false);
  assert.equal(h.context.astroAnalytics.track("signup", { plan: "pro" }).ok, true);
  assert.equal(queue.some((call: unknown[]) => call[0] === "pageview"), true);
});

test("Plausible does not accept its bootstrap queue as loaded vendor readiness", () => {
  const h = harness();
  run(createBootstrapScript({ events: true, providers: ["plausible"], runtimeToken: "token" }), h.context);
  run(createPlausibleBootstrapScript({ events: true, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://plausible.example/script.js" }), h.context);
  h.appended[0]!.dispatch("load");
  assert.equal(h.appended[0]!.isConnected, false);
  assert.equal(h.context.astroAnalytics.status().plausible, "adapter-not-loaded");
});

test("GA4 initializes consent/config and emits pageviews and events", () => {
  const h = harness();
  run(createBootstrapScript({ events: true, providers: ["google-analytics"], runtimeToken: "token" }), h.context);
  run(createGoogleAnalyticsBootstrapScript({ consentInitial: { analyticsStorage: "granted", adStorage: "denied" }, consentMode: "immediate", events: true, measurementId: "G-TEST123", pageviews: "provider", runtimeToken: "token", scriptSrc: "https://www.googletagmanager.com/gtag/js?id=G-TEST123" }), h.context);
  h.appended[0]!.dispatch("load");
  const consentCommand = h.context.dataLayer.find((call: ArrayLike<unknown>) => call[0] === "consent");
  assert.equal(Array.isArray(consentCommand), false);
  assert.equal(Object.prototype.toString.call(consentCommand), "[object Arguments]");
  assert.equal(consentCommand[1], "default");
  assert.equal(h.context.dataLayer.some((call: any[]) => call[0] === "config" && call[2].send_page_view === false), true);
  assert.equal(h.context.astroAnalytics.track("signup", { plan: "pro" }).ok, true);
});

test("Matomo maintains route context in pageview-none mode", () => {
  const h = harness();
  run(createBootstrapScript({ events: true, providers: ["matomo"], runtimeToken: "token" }), h.context);
  run(createMatomoBootstrapScript({ eventCategory: "Astro", events: true, pageviews: "none", runtimeToken: "token", scriptSrc: "https://analytics.example/matomo.js", siteId: "1", trackerUrl: "https://analytics.example/matomo.php" }), h.context);
  h.appended[0]!.dispatch("load");
  assert.equal(h.context._paq.some((command: unknown[]) => command[0] === "trackPageView"), false);
  assert.equal(h.context._paq.some((command: unknown[]) => command[0] === "setCustomUrl"), true);
  assert.equal(h.context.astroAnalytics.track("signup", { _name: "Plan", _value: 2 }).ok, true);
  assert.equal(h.context._paq.some((command: unknown[]) => command[0] === "trackEvent"), true);
});

test("Umami disables automatic pageviews and receives route-aware payload factories", () => {
  const h = harness();
  const payloads: any[] = [];
  run(createBootstrapScript({ events: true, providers: ["umami"], runtimeToken: "token" }), h.context);
  run(createUmamiBootstrapScript({ events: true, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://analytics.example/script.js", websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2" }), h.context);
  const script = h.appended[0]!;
  assert.equal(script.attributes["data-auto-pageview"], "false");
  h.context.umami = { track(factory: (payload: object) => object) { payloads.push(factory({ hostname: "example.test" })); } };
  script.dispatch("load");
  assert.equal(payloads[0].url, "https://example.test/");
  assert.equal(h.context.astroAnalytics.track("signup", { plan: "pro" }).ok, true);
  assert.equal(payloads[1].name, "signup");
});

test("multi-provider client keeps independent outcomes", () => {
  const h = harness();
  run(createBootstrapScript({ events: true, providers: ["fathom", "plausible"], runtimeToken: "token" }), h.context);
  run(createFathomBootstrapScript({ consentMode: "deferred", events: true, pageviews: "none", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  run(createPlausibleBootstrapScript({ events: true, pageviews: "none", runtimeToken: "token", scriptSrc: "https://plausible.example/script.js" }), h.context);
  const plausible: any = (...args: unknown[]) => h.context.plausibleCalls = [...(h.context.plausibleCalls ?? []), args];
  plausible.l = true;
  h.context.plausible = plausible;
  h.appended[0]!.dispatch("load");
  const result = h.context.astroAnalytics.track("signup");
  assert.equal(result.ok, false);
  assert.equal(result.providers.fathom.ok, false);
  assert.equal(result.providers.fathom.reason, "consent-pending");
  assert.equal(result.providers.plausible.ok, true);
  assert.equal("reason" in result, false);
});

test("direct browser events enforce the same property-record boundary", () => {
  const h = harness();
  const received: unknown[] = [];
  run(createBootstrapScript({ events: true, providers: ["fathom"], runtimeToken: "token" }), h.context);
  run(createFathomBootstrapScript({ events: true, pageviews: "none", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  h.context.fathom = { trackEvent(...args: unknown[]) { received.push(args); } };
  h.appended[0]!.dispatch("load");

  const invalid = [new Date(), new Map(), new Set(), /value/, Object("value"), [], null];
  for (const properties of invalid) {
    assert.equal(h.context.astroAnalytics.track("event", properties).reason, "invalid-event");
  }
  const symbolBag = { [Symbol("hidden")]: "value" };
  const nonEnumerableBag = {};
  Object.defineProperty(nonEnumerableBag, "hidden", { enumerable: false, value: "value" });
  const accessorBag = {};
  Object.defineProperty(accessorBag, "value", { enumerable: true, get: () => "value" });
  const fakeObjectPrototype = Object.create(null);
  Object.defineProperty(fakeObjectPrototype, "constructor", {
    configurable: true,
    value: function Object() {},
    writable: true,
  });
  const customPrototypeBag = Object.assign(Object.create(fakeObjectPrototype), { plan: "pro" });
  for (const properties of [symbolBag, nonEnumerableBag, accessorBag, customPrototypeBag]) {
    assert.equal(h.context.astroAnalytics.track("event", properties).reason, "invalid-event");
  }
  const nullPrototype = Object.assign(Object.create(null), { plan: "pro" });
  assert.equal(h.context.astroAnalytics.track("event", nullPrototype).ok, true);
  assert.equal(h.context.astroAnalytics.track("event", { plan: "pro" }).ok, true);
  assert.equal(received.length, 2);
});

test("script errors clean owned state and permit a clean retry", () => {
  const h = harness();
  const options = { events: false, pageviews: "provider" as const, runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" };
  run(createFathomBootstrapScript(options), h.context);
  h.appended[0]!.dispatch("error");
  assert.equal(h.appended[0]!.isConnected, false);
  run(createFathomBootstrapScript(options), h.context);
  assert.equal(h.appended.length, 2);
  assert.equal(h.appended[1]!.isConnected, true);
});

test("vendor pageview exceptions are contained and the completed route is retried", () => {
  const h = harness();
  let attempts = 0;
  run(createFathomBootstrapScript({ events: false, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  h.context.fathom = { trackPageview() { attempts += 1; if (attempts === 1) throw new Error("temporary"); } };
  assert.doesNotThrow(() => h.appended[0]!.dispatch("load"));
  assert.equal(attempts, 1);
  run(createFathomBootstrapScript({ events: false, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  assert.equal(attempts, 2);
});

test("prerendered completions wait for activation", () => {
  const h = harness();
  h.document.prerendering = true;
  let calls = 0;
  run(createFathomBootstrapScript({ events: false, pageviews: "provider", runtimeToken: "token", scriptSrc: "https://cdn.usefathom.com/script.js", siteId: "ABCDEFG" }), h.context);
  h.context.fathom = { trackPageview() { calls += 1; } };
  h.appended[0]!.dispatch("load");
  assert.equal(calls, 0);
  h.document.prerendering = false;
  h.emit("prerenderingchange");
  assert.equal(calls, 1);
});
