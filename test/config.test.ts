import assert from "node:assert/strict";
import test from "node:test";
import { isEnabledForCommand, normalizeConfig } from "../src/config.ts";

const google = {
  name: "google-analytics",
  measurementId: "G-TEST123",
  consent: { mode: "deferred" },
};
const plausible = {
  name: "plausible",
  scriptSrc: "https://example.com/js/script.js",
};
const fathom = { name: "fathom", siteId: "ABCDEFG" };
const matomo = {
  name: "matomo",
  trackerUrl: "https://analytics.example.com/matomo.php",
  siteId: "1",
  eventCategory: "Astro",
};
const umami = {
  name: "umami",
  websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
  scriptSrc: "https://analytics.example.com/script.js",
};

function rejects(value: unknown, pattern: RegExp): void {
  assert.throws(() => normalizeConfig(value), pattern);
}

test("disabled provider and defaults are explicit", () => {
  const disabled = normalizeConfig({ provider: false });
  assert.equal(disabled.provider, false);
  assert.equal(isEnabledForCommand(disabled, "build"), false);

  const config = normalizeConfig({ provider: fathom });
  assert.deepEqual(config.environments, {
    production: true,
    preview: false,
    development: false,
  });
  assert.equal(config.enabled, true);
  assert.equal(config.events, false);
  assert.deepEqual(config.blockedQueryParameters, []);
  assert.equal(config.debug, false);
  assert.equal(config.provider && config.provider.pageviews, "provider");
});

test("plural providers preserve order, reject duplicates, and cannot mix with legacy input", () => {
  const config = normalizeConfig({
    providers: [fathom, plausible, google],
    events: true,
  });
  assert.equal(config.provider, undefined);
  assert.deepEqual(
    config.providers && config.providers.map((provider) => provider.name),
    ["fathom", "plausible", "google-analytics"],
  );
  assert.equal(Object.isFrozen(config.providers), true);
  rejects({ providers: [] }, /must not be empty/);
  rejects({ providers: fathom }, /must be an array or false/);
  rejects(
    { providers: [fathom, { ...fathom }] },
    /duplicate provider "fathom"/,
  );
  rejects(
    { provider: fathom, providers: [fathom] },
    /cannot be used together/,
  );
});

test("legacy event options remain deprecated enabled compatibility input", () => {
  assert.equal(normalizeConfig({ provider: fathom, events: {} }).events, true);
  assert.equal(
    normalizeConfig({
      provider: fathom,
      events: { globalName: "astroAnalytics", queue: { maxSize: 25 } },
    }).events,
    true,
  );
  assert.equal(
    normalizeConfig({ provider: fathom, events: { queue: false } }).events,
    true,
  );
  rejects(
    { provider: fathom, events: { globalName: "other" } },
    /globalName must be "astroAnalytics"/,
  );
  rejects(
    { provider: fathom, events: { queue: { maxSize: 0 } } },
    /maxSize must be an integer from 1 to 100/,
  );
});

test("environment opt-ins are independent and sync fails closed", () => {
  const config = normalizeConfig({
    environments: { production: false, preview: true, development: true },
    provider: fathom,
  });
  assert.equal(isEnabledForCommand(config, "build"), false);
  assert.equal(isEnabledForCommand(config, "dev"), true);
  assert.equal(isEnabledForCommand(config, "preview"), true);
  assert.equal(isEnabledForCommand(config, "sync"), false);
});

test("root configuration rejects invalid shapes and extra fields", () => {
  rejects(null, /must be an object/);
  rejects([], /must be an object/);
  rejects("invalid", /must be an object/);
  rejects({}, /provider is required/);
  rejects({ provider: false, extra: true }, /configuration\.extra is not supported/);
  rejects(
    { provider: false, [Symbol("extra")]: true },
    /unsupported symbol key/,
  );
});

test("all root and environment values are runtime-validated", () => {
  rejects({ provider: false, enabled: "yes" }, /enabled must be a boolean/);
  rejects({ provider: false, debug: 1 }, /debug must be a boolean/);
  rejects({ provider: false, events: undefined }, /events must be an object/);
  rejects({ provider: false, environments: null }, /environments must be an object/);
  rejects(
    { provider: false, environments: { production: "yes" } },
    /production must be a boolean/,
  );
  rejects(
    { provider: false, environments: { staging: true } },
    /environments\.staging is not supported/,
  );
  for (const environments of [new Map(), new Date(), new Set(), /production/]) {
    rejects(
      { provider: false, environments },
      /plain or null-prototype record/,
    );
  }
});

test("provider discriminator is required and fail-closed", () => {
  rejects({ provider: null }, /provider must be an object/);
  rejects({ provider: true }, /provider must be an object/);
  rejects({ provider: {} }, /provider\.name must identify/);
  rejects({ provider: { name: "unknown" } }, /is not supported/);
});

test("every provider rejects unsupported pageview modes and extra fields", () => {
  for (const provider of [google, plausible, fathom, matomo, umami]) {
    rejects(
      { provider: { ...provider, pageviews: "bogus" } },
      /pageviews must be provider, astro, or none/,
    );
    rejects(
      { provider: { ...provider, extra: true } },
      /provider\.extra is not supported/,
    );
  }
});

test("GA4 validates identity, consent, initial state, and config", () => {
  rejects(
    { provider: { name: "google-analytics", consent: { mode: "deferred" } } },
    /measurementId is required/,
  );
  rejects(
    { provider: { name: "google-analytics", measurementId: "UA-OLD" } },
    /GA4 G- identifier/,
  );
  rejects(
    { provider: { name: "google-analytics", measurementId: "G-TEST123" } },
    /explicit consent\.mode/,
  );
  rejects(
    { provider: { ...google, consent: { mode: "bogus" } } },
    /must be immediate, deferred, or external/,
  );
  rejects(
    { provider: { ...google, consent: { mode: "deferred", extra: true } } },
    /consent\.extra is not supported/,
  );
  rejects(
    { provider: { ...google, consent: { mode: "deferred", initial: {} } } },
    /analyticsStorage is required/,
  );
  rejects(
    {
      provider: {
        ...google,
        consent: { mode: "deferred", initial: { analyticsStorage: "maybe" } },
      },
    },
    /must be granted or denied/,
  );
  rejects(
    { provider: { ...google, config: { send_page_view: null } } },
    /must be a string, finite number, or boolean/,
  );
  rejects(
    { provider: { ...google, config: { sample_rate: Number.NaN } } },
    /finite number/,
  );
  for (const config of [
    new Map(),
    new Date(),
    new Set(),
    /config/,
    new String("x"),
    new Number(1),
    new Boolean(true),
  ]) {
    rejects(
      { provider: { ...google, config } },
      /plain or null-prototype record/,
    );
  }
});

test("every record-shaped configuration branch rejects branded objects", () => {
  const branded = (): object[] => [
    new Map(),
    new Date(),
    new Set(),
    /record/,
    new String("x"),
    new Number(1),
    new Boolean(true),
  ];

  for (const root of branded()) {
    rejects(root, /plain or null-prototype record/);
  }
  for (const provider of branded()) {
    Object.assign(provider, fathom);
    rejects({ provider }, /plain or null-prototype record/);
  }
  for (const consent of branded()) {
    Object.assign(consent, { mode: "deferred" });
    rejects(
      { provider: { ...google, consent } },
      /plain or null-prototype record/,
    );
  }
  for (const initial of branded()) {
    Object.assign(initial, { analyticsStorage: "denied" });
    rejects(
      { provider: { ...google, consent: { mode: "deferred", initial } } },
      /plain or null-prototype record/,
    );
  }
});

test("null-prototype records remain supported", () => {
  const environments = Object.assign(Object.create(null), { production: false });
  const providerConfig = Object.assign(Object.create(null), { send_page_view: false });
  const config = normalizeConfig({
    environments,
    provider: { ...google, config: providerConfig },
  });
  assert.equal(config.environments.production, false);
  assert.deepEqual(
    config.provider && config.provider.name === "google-analytics"
      ? config.provider.config
      : undefined,
    { send_page_view: false },
  );
});

test("provider config safely preserves reserved property names", () => {
  const providerConfig = JSON.parse('{"__proto__":"literal"}') as unknown;
  const config = normalizeConfig({ provider: { ...google, config: providerConfig } });
  assert.equal(
    config.provider &&
      config.provider.name === "google-analytics" &&
      config.provider.config?.["__proto__"],
    "literal",
  );
});

test("Plausible validates required and optional branches", () => {
  rejects({ provider: { name: "plausible" } }, /scriptSrc is required/);
  rejects(
    { provider: { ...plausible, scriptSrc: "javascript:alert(1)" } },
    /absolute HTTPS URL/,
  );
  rejects(
    { provider: { ...plausible, endpoint: "https://user:pass@example.com/api" } },
    /without credentials/,
  );
  rejects(
    { provider: { ...plausible, consent: { mode: "bogus" } } },
    /must be immediate, deferred, or external/,
  );
  rejects(
    { provider: { ...plausible, consent: { mode: "external", extra: true } } },
    /consent\.extra is not supported/,
  );
  rejects(
    { provider: { ...plausible, captureOnLocalhost: "yes" } },
    /captureOnLocalhost must be a boolean/,
  );
});

test("Fathom validates required and optional branches", () => {
  rejects({ provider: { name: "fathom" } }, /siteId is required/);
  rejects({ provider: { ...fathom, siteId: " " } }, /must not be empty/);
  rejects(
    { provider: { ...fathom, scriptSrc: 42 } },
    /scriptSrc must be a string/,
  );
  rejects(
    { provider: { ...fathom, consent: { mode: "bogus" } } },
    /must be immediate, deferred, or external/,
  );
  rejects(
    { provider: { ...fathom, honorDnt: "yes" } },
    /honorDnt must be a boolean/,
  );
  rejects(
    { provider: { ...fathom, canonical: 1 } },
    /canonical must be a boolean/,
  );
});

test("blocked query parameters are bounded, unique, and frozen", () => {
  const config = normalizeConfig({ provider: fathom, blockedQueryParameters: ["cwl_journey", "preview"] });
  assert.deepEqual(config.blockedQueryParameters, ["cwl_journey", "preview"]);
  assert.equal(Object.isFrozen(config.blockedQueryParameters), true);
  rejects({ provider: fathom, blockedQueryParameters: "cwl_journey" }, /must be an array/);
  rejects({ provider: fathom, blockedQueryParameters: [""] }, /non-empty/);
  rejects({ provider: fathom, blockedQueryParameters: [" padded"] }, /unpadded/);
  rejects({ provider: fathom, blockedQueryParameters: ["same", "same"] }, /duplicates/);
  rejects({ provider: fathom, blockedQueryParameters: Array(1) }, /must not be sparse/);
  rejects({ provider: fathom, blockedQueryParameters: ["first", , "third"] }, /must not be sparse/);
  rejects({ provider: fathom, blockedQueryParameters: Array.from({ length: 33 }, (_, index) => `p${index}`) }, /at most 32/);
});

test("Matomo validates tracker identity, event category, and consent", () => {
  rejects({ provider: { name: "matomo" } }, /trackerUrl is required/);
  rejects(
    { provider: { ...matomo, trackerUrl: "https://analytics.example.com/" } },
    /must end with \/matomo\.php/,
  );
  rejects(
    { provider: { ...matomo, trackerUrl: "http://analytics.example.com/matomo.php" } },
    /absolute HTTPS URL/,
  );
  rejects(
    { provider: { ...matomo, siteId: "0" } },
    /positive integer string/,
  );
  rejects(
    { provider: { ...matomo, siteId: "site-one" } },
    /positive integer string/,
  );
  rejects(
    { provider: { ...matomo, eventCategory: " " } },
    /eventCategory must not be empty/,
  );
  rejects(
    { provider: { ...matomo, eventCategory: "x".repeat(129) } },
    /at most 128 characters/,
  );
  rejects(
    { provider: { ...matomo, trackerUrl: "https://analytics.example.com/matomo.php?x=1" } },
    /contain no query or fragment/,
  );
  rejects(
    { provider: { ...matomo, consent: { mode: "bogus" } } },
    /must be immediate, deferred, or external/,
  );
  const config = normalizeConfig({ provider: matomo });
  assert.deepEqual(config.provider, {
    ...matomo,
    scriptSrc: "https://analytics.example.com/matomo.js",
    pageviews: "provider",
  });
});

test("Umami validates website identity, tracker URLs, and consent", () => {
  rejects({ provider: { name: "umami" } }, /websiteId is required/);
  rejects(
    { provider: { ...umami, websiteId: "not-a-uuid" } },
    /websiteId must be a UUID string/,
  );
  rejects(
    { provider: { ...umami, scriptSrc: "http://analytics.example.com/script.js" } },
    /absolute HTTPS URL/,
  );
  rejects(
    { provider: { ...umami, hostUrl: "https://user:pass@analytics.example.com" } },
    /without credentials/,
  );
  rejects(
    { provider: { ...umami, hostUrl: "https://analytics.example.com/?source=x" } },
    /contain no query or fragment/,
  );
  rejects(
    { provider: { ...umami, consent: { mode: "bogus" } } },
    /must be immediate, deferred, or external/,
  );
  const config = normalizeConfig({
    provider: {
      ...umami,
      hostUrl: "https://analytics.example.com",
      consent: { mode: "immediate" },
    },
  });
  assert.deepEqual(config.provider, {
    ...umami,
    hostUrl: "https://analytics.example.com/",
    consent: { mode: "immediate" },
    pageviews: "provider",
  });
});

test("supported fields are copied only after validation", () => {
  const config = normalizeConfig({
    provider: {
      ...plausible,
      endpoint: "https://example.com/api/event",
      consent: { mode: "external" },
      captureOnLocalhost: true,
      pageviews: "astro",
    },
    events: true,
  });
  assert.deepEqual(config.provider, {
    name: "plausible",
    scriptSrc: "https://example.com/js/script.js",
    endpoint: "https://example.com/api/event",
    consent: { mode: "external" },
    captureOnLocalhost: true,
    pageviews: "astro",
  });
  assert.equal(config.events, true);
});
