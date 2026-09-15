import assert from "node:assert/strict";
import test from "node:test";
import { configuredProviders, providerStatuses, track } from "../src/events.ts";

const setClient = (value: unknown) => Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { astroAnalytics: value },
});
const clearClient = () => Reflect.deleteProperty(globalThis, "window");

test("SSR and an absent client return an explicit disabled result", () => {
  clearClient();
  assert.deepEqual(configuredProviders(), []);
  assert.deepEqual(providerStatuses(), {});
  assert.deepEqual(track("signup"), { ok: false, providers: {}, reason: "disabled" });
});

test("configured providers and statuses preserve the runtime contract", () => {
  setClient({
    providers: ["fathom", "plausible"],
    status: () => ({ fathom: "ready", plausible: "consent-pending" }),
  });
  assert.deepEqual(configuredProviders(), ["fathom", "plausible"]);
  assert.deepEqual(providerStatuses(), { fathom: "ready", plausible: "consent-pending" });
  clearClient();
});

test("invalid provider lists and status maps fail closed", () => {
  setClient({ providers: ["fathom", "fathom"], status: () => ({ fathom: "ready" }) });
  assert.deepEqual(configuredProviders(), []);
  assert.deepEqual(providerStatuses(), {});
  setClient({ providers: ["fathom"], status: () => ({ fathom: "unknown" }) });
  assert.deepEqual(providerStatuses(), {});
  clearClient();
});

test("event names and property bounds are enforced before dispatch", () => {
  let calls = 0;
  setClient({ providers: ["fathom"], track: () => { calls += 1; return { ok: true, providers: { fathom: { ok: true } } }; } });
  for (const result of [
    track("   "),
    track("x".repeat(129)),
    track("valid", { bad: Number.NaN }),
    track("valid", { bad: { nested: true } } as never),
  ]) {
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "invalid-event");
  }
  assert.equal(calls, 0);
  clearClient();
});

test("valid events normalize names and expose every provider result", () => {
  let received: unknown[] = [];
  setClient({
    providers: ["fathom", "plausible"],
    track(name: string, properties: unknown) {
      received = [name, properties];
      return { ok: false, providers: { fathom: { ok: true }, plausible: { ok: false, reason: "adapter-not-loaded" } } };
    },
  });
  assert.deepEqual(track("  signup  ", { plan: "pro" }), {
    ok: false,
    providers: { fathom: { ok: true }, plausible: { ok: false, reason: "adapter-not-loaded" } },
  });
  assert.deepEqual(received, ["signup", { plan: "pro" }]);
  clearClient();
});

test("malformed aggregate results fail closed without throwing", () => {
  setClient({ providers: ["fathom"], track: () => ({ ok: true, providers: {} }) });
  assert.deepEqual(track("signup"), {
    ok: false,
    providers: { fathom: { ok: false, reason: "adapter-not-loaded" } },
  });
  clearClient();
});
