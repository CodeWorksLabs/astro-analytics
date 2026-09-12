import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  configuredProviders,
  EVENT_NAME_MAX_LENGTH,
  EVENT_PROPERTY_COUNT_MAX,
  EVENT_PROPERTY_KEY_MAX_LENGTH,
  EVENT_PROPERTY_STRING_MAX_LENGTH,
  providerStatuses,
  track,
} from "../src/events.ts";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

function setWindow(value: unknown): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value,
    writable: true,
  });
}

function result(
  providers: Record<string, unknown>,
  reason?: string,
): Record<string, unknown> {
  const accepted = Object.values(providers).every(
    (provider) => (provider as { ok?: unknown }).ok === true,
  );
  return reason === undefined
    ? { ok: accepted, providers }
    : { ok: accepted, providers, reason };
}

afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", originalWindow);
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("SSR and absent clients return an explicit empty-provider failure", () => {
  Reflect.deleteProperty(globalThis, "window");
  assert.deepEqual(track("view"), {
    ok: false,
    providers: {},
    reason: "disabled",
  });
  assert.deepEqual(track(" "), {
    ok: false,
    providers: {},
    reason: "invalid-event",
  });
  setWindow({});
  assert.deepEqual(track("view"), {
    ok: false,
    providers: {},
    reason: "disabled",
  });
  assert.deepEqual(configuredProviders(), []);
});

test("configuredProviders returns only a unique supported provider list", () => {
  setWindow({ astroAnalytics: { providers: ["fathom", "plausible"], track() {} } });
  assert.deepEqual(configuredProviders(), ["fathom", "plausible"]);
  setWindow({ astroAnalytics: { providers: ["fathom", "fathom"], track() {} } });
  assert.deepEqual(configuredProviders(), []);
  setWindow({ astroAnalytics: { providers: ["unknown"], track() {} } });
  assert.deepEqual(configuredProviders(), []);
});

test("providerStatuses validates an exact status for every configured provider", () => {
  setWindow({ astroAnalytics: {
    providers: ["fathom", "plausible"],
    status() {
      return { fathom: "ready", plausible: "adapter-not-loaded" };
    },
  } });
  assert.deepEqual(providerStatuses(), {
    fathom: "ready",
    plausible: "adapter-not-loaded",
  });
  setWindow({ astroAnalytics: {
    providers: ["fathom"],
    status() { return { fathom: "unknown" }; },
  } });
  assert.deepEqual(providerStatuses(), {});
  setWindow({ astroAnalytics: {
    providers: ["fathom"],
    status() { return {}; },
  } });
  assert.deepEqual(providerStatuses(), {});
});

test("nonobject and malformed clients fail closed", () => {
  for (const astroAnalytics of [true, 42, "client", {}, { track: true }]) {
    setWindow({ astroAnalytics });
    assert.deepEqual(track("view"), {
      ok: false,
      providers: {},
      reason: "disabled",
    });
  }
});

test("throwing global, client, provider, track getter, and call never escape", () => {
  const expected = { ok: false, providers: {}, reason: "disabled" };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    get() { throw new Error("hostile window"); },
  });
  assert.deepEqual(track("view"), expected);

  setWindow(Object.defineProperty({}, "astroAnalytics", {
    get() { throw new Error("hostile client"); },
  }));
  assert.deepEqual(track("view"), expected);

  setWindow({ astroAnalytics: Object.defineProperty({}, "providers", {
    get() { throw new Error("hostile providers"); },
  }) });
  assert.deepEqual(track("view"), expected);

  setWindow({ astroAnalytics: Object.defineProperties({}, {
    providers: { value: ["fathom"] },
    track: { get() { throw new Error("hostile track"); } },
  }) });
  assert.deepEqual(track("view"), expected);

  setWindow({ astroAnalytics: {
    providers: ["fathom"],
    track() { throw new Error("hostile call"); },
  } });
  assert.deepEqual(track("view"), expected);
});

test("invalid event shapes are rejected before client invocation", () => {
  let calls = 0;
  setWindow({
    astroAnalytics: {
      providers: ["fathom"],
      track() {
        calls += 1;
        return result({ fathom: { ok: true } });
      },
    },
  });
  const invalidEvents: Array<[unknown, unknown]> = [
    ["", undefined],
    ["x".repeat(EVENT_NAME_MAX_LENGTH + 1), undefined],
    ["view", null],
    ["view", []],
    ["view", new Map([["value", true]])],
    ["view", new Date()],
    ["view", new Set(["value"])],
    ["view", /value/],
    ["view", new String("value")],
    ["view", new Number(1)],
    ["view", new Boolean(true)],
    ["view", { "": true }],
    ["view", { ["x".repeat(EVENT_PROPERTY_KEY_MAX_LENGTH + 1)]: true }],
    ["view", { value: "x".repeat(EVENT_PROPERTY_STRING_MAX_LENGTH + 1) }],
    ["view", { value: Number.NaN }],
    ["view", { value: null }],
    [
      "view",
      Object.fromEntries(
        Array.from({ length: EVENT_PROPERTY_COUNT_MAX + 1 }, (_, index) => [
          `key${index}`,
          true,
        ]),
      ),
    ],
  ];
  for (const [name, properties] of invalidEvents) {
    assert.deepEqual(
      track(
        name as string,
        properties as Record<string, string | number | boolean> | undefined,
      ),
      { ok: false, providers: {}, reason: "invalid-event" },
    );
  }
  assert.equal(calls, 0);
});

test("hostile and symbol-keyed property records remain non-throwing", () => {
  const hostile = new Proxy({}, {
    ownKeys() { throw new Error("hostile properties"); },
  });
  assert.deepEqual(track("view", hostile), {
    ok: false,
    providers: {},
    reason: "disabled",
  });
  assert.deepEqual(
    track("view", { [Symbol("extra")]: true } as Record<string, boolean>),
    { ok: false, providers: {}, reason: "invalid-event" },
  );
});

test("valid events preserve receiver, normalize names, and expose provider success", () => {
  const client = {
    providers: ["fathom"],
    calls: 0,
    track(name: string, properties: unknown) {
      assert.equal(this, client);
      assert.equal(name, "checkout");
      assert.deepEqual(properties, { total: 12.5, member: true });
      this.calls += 1;
      return result({ fathom: { ok: true } });
    },
  };
  setWindow({ astroAnalytics: client });
  assert.deepEqual(track(" checkout ", { total: 12.5, member: true }), {
    ok: true,
    providers: { fathom: { ok: true } },
  });
  assert.equal(client.calls, 1);
});

test("multi-provider partial failure remains visible without hiding success", () => {
  setWindow({
    astroAnalytics: {
      providers: ["fathom", "google-analytics", "plausible"],
      track() {
        return result({
          fathom: { ok: true },
          "google-analytics": { ok: false, reason: "consent-pending" },
          plausible: { ok: false, reason: "adapter-not-loaded" },
        });
      },
    },
  });
  assert.deepEqual(track("journey"), {
    ok: false,
    providers: {
      fathom: { ok: true },
      "google-analytics": { ok: false, reason: "consent-pending" },
      plausible: { ok: false, reason: "adapter-not-loaded" },
    },
  });
});

test("event properties safely preserve reserved names and null prototypes", () => {
  for (const properties of [
    JSON.parse('{"__proto__":"literal"}') as Record<string, string>,
    Object.assign(Object.create(null), { total: 12.5 }),
  ]) {
    setWindow({
      astroAnalytics: {
        providers: ["fathom"],
        track(_name: string, received: Record<string, unknown>) {
          assert.deepEqual(Object.entries(received), Object.entries(properties));
          assert.equal(
            Object.hasOwn(received, "__proto__"),
            Object.hasOwn(properties, "__proto__"),
          );
          return result({ fathom: { ok: true } });
        },
      },
    });
    assert.deepEqual(track("view", properties), {
      ok: true,
      providers: { fathom: { ok: true } },
    });
  }
});

test("malformed aggregate results fail closed for every configured provider", () => {
  const invalidResults: unknown[] = [
    undefined,
    true,
    { ok: true },
    { ok: true, providers: { fathom: { ok: true } }, reason: "disabled" },
    { ok: false, providers: {} },
    { ok: false, providers: { fathom: { ok: false, reason: "bogus" } } },
    { ok: true, providers: { fathom: { ok: false, reason: "disabled" } } },
    {
      ok: false,
      providers: { fathom: { ok: false, reason: "adapter-not-loaded" } },
      reason: "consent-pending",
    },
  ];
  for (const value of invalidResults) {
    setWindow({
      astroAnalytics: { providers: ["fathom"], track: () => value },
    });
    assert.deepEqual(track("view"), {
      ok: false,
      providers: { fathom: { ok: false, reason: "adapter-not-loaded" } },
    });
  }
});
