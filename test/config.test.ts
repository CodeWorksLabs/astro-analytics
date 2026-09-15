import assert from "node:assert/strict";
import test from "node:test";
import { isEnabledForCommand, normalizeConfig } from "../src/config.ts";

const fathom = { name: "fathom" as const, siteId: "ABCDEFG" };
const plausible = { name: "plausible" as const, scriptSrc: "https://example.com/js/script.js" };
const google = { name: "google-analytics" as const, measurementId: "G-TEST123", consent: { mode: "deferred" as const } };
const matomo = { name: "matomo" as const, trackerUrl: "https://analytics.example.com/matomo.php", siteId: "1", eventCategory: "Astro" };
const umami = { name: "umami" as const, websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2", scriptSrc: "https://analytics.example.com/script.js" };

const rejects = (value: unknown, pattern: RegExp) => assert.throws(() => normalizeConfig(value), pattern);

test("providers are required and false disables the integration", () => {
  rejects({}, /providers is required/);
  const disabled = normalizeConfig({ providers: false });
  assert.equal(disabled.providers, false);
  assert.equal(isEnabledForCommand(disabled, "build"), false);
});

test("provider arrays preserve order, normalize defaults, and reject duplicates", () => {
  const config = normalizeConfig({ providers: [fathom, plausible, google, matomo, umami], events: true });
  assert.deepEqual(config.providers && config.providers.map(({ name }) => name),
    ["fathom", "plausible", "google-analytics", "matomo", "umami"]);
  assert.equal(config.providers && config.providers.every(({ pageviews }) => pageviews === "provider"), true);
  assert.equal(config.events, true);
  assert.equal(Object.isFrozen(config.providers), true);
  rejects({ providers: [] }, /must not be empty/);
  rejects({ providers: [fathom, fathom] }, /duplicate provider/);
});

test("the removed singular provider and event-object forms fail explicitly", () => {
  rejects({ provider: fathom }, /configuration\.provider is not supported/);
  rejects({ providers: [fathom], events: {} }, /configuration\.events must be a boolean/);
});

test("environment selection is explicit and sync stays disabled", () => {
  const config = normalizeConfig({
    providers: [fathom],
    environments: { production: false, preview: true, development: true },
  });
  assert.equal(isEnabledForCommand(config, "build"), false);
  assert.equal(isEnabledForCommand(config, "dev"), true);
  assert.equal(isEnabledForCommand(config, "preview"), true);
  assert.equal(isEnabledForCommand(config, "sync"), false);
});

test("root fields and blocked query parameters are strictly validated", () => {
  rejects(null, /must be an object/);
  rejects({ providers: false, extra: true }, /extra is not supported/);
  rejects({ providers: false, enabled: "yes" }, /enabled must be a boolean/);
  rejects({ providers: [fathom], blockedQueryParameters: [""] }, /non-empty/);
  rejects({ providers: [fathom], blockedQueryParameters: ["same", "same"] }, /duplicates/);
  const config = normalizeConfig({ providers: [fathom], blockedQueryParameters: ["preview", "token"] });
  assert.deepEqual(config.blockedQueryParameters, ["preview", "token"]);
  assert.equal(Object.isFrozen(config.blockedQueryParameters), true);
});

test("all five provider identities and required fields are validated", () => {
  rejects({ providers: [{ name: "unknown" }] }, /not supported/);
  rejects({ providers: [{ name: "fathom" }] }, /siteId is required/);
  rejects({ providers: [{ name: "plausible" }] }, /scriptSrc is required/);
  rejects({ providers: [{ name: "google-analytics", measurementId: "UA-OLD", consent: { mode: "immediate" } }] }, /GA4 G- identifier/);
  rejects({ providers: [{ name: "matomo", trackerUrl: "http://example.com/matomo.php", siteId: "1", eventCategory: "Astro" }] }, /absolute HTTPS/);
  rejects({ providers: [{ name: "umami", websiteId: "bad", scriptSrc: "https://example.com/script.js" }] }, /UUID/);
});

test("pageview and consent modes reject unsupported values", () => {
  rejects({ providers: [{ ...fathom, pageviews: "automatic" }] }, /provider, astro, or none/);
  rejects({ providers: [{ ...fathom, consent: { mode: "sometimes" } }] }, /immediate, deferred, or external/);
});

test("validated inputs are copied and frozen", () => {
  const provider = { ...fathom, pageviews: "none" as const };
  const config = normalizeConfig({ providers: [provider] });
  provider.siteId = "CHANGED";
  const normalized = config.providers && config.providers[0];
  assert.equal(normalized && normalized.name === "fathom" && normalized.siteId, "ABCDEFG");
});
