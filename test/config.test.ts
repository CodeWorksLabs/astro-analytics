import assert from "node:assert/strict";
import test from "node:test";
import {
  isEnabledForCommand,
  normalizeConfig,
} from "../src/config.ts";

test("false is the canonical disabled provider", () => {
  const config = normalizeConfig({ provider: false });
  assert.equal(config.provider, false);
  assert.equal(isEnabledForCommand(config, "build"), false);
});

test("production is enabled by default while dev and preview are opt-in", () => {
  const config = normalizeConfig({
    provider: {
      name: "fathom",
      siteId: "ABCDEFG",
    },
  });
  assert.equal(isEnabledForCommand(config, "build"), true);
  assert.equal(isEnabledForCommand(config, "dev"), false);
  assert.equal(isEnabledForCommand(config, "preview"), false);
  assert.equal(isEnabledForCommand(config, "sync"), false);
});

test("environment opt-ins are independent", () => {
  const config = normalizeConfig({
    environments: { production: false, preview: true, development: true },
    provider: {
      name: "fathom",
      siteId: "ABCDEFG",
    },
  });
  assert.equal(isEnabledForCommand(config, "build"), false);
  assert.equal(isEnabledForCommand(config, "dev"), true);
  assert.equal(isEnabledForCommand(config, "preview"), true);
});

test("GA4 requires an explicit consent mode", () => {
  assert.throws(
    () =>
      normalizeConfig({
        provider: {
          name: "google-analytics",
          measurementId: "G-TEST123",
        } as never,
      }),
    /explicit consent\.mode/,
  );
});

test("provider-owned pageviews are the provider defaults", () => {
  const plausible = normalizeConfig({
    provider: {
      name: "plausible",
      scriptSrc: "https://example.com/js/script.js",
    },
  });
  const fathom = normalizeConfig({
    provider: { name: "fathom", siteId: "ABCDEFG" },
  });
  assert.equal(plausible.provider && plausible.provider.pageviews, "provider");
  assert.equal(fathom.provider && fathom.provider.pageviews, "provider");
});

test("custom script and endpoint URLs reject unsafe protocols and credentials", () => {
  assert.throws(
    () =>
      normalizeConfig({
        provider: {
          name: "plausible",
          scriptSrc: "javascript:alert(1)",
        },
      }),
    /absolute HTTPS URL/,
  );
  assert.throws(
    () =>
      normalizeConfig({
        provider: {
          name: "plausible",
          scriptSrc: "https://user:pass@example.com/script.js",
        },
      }),
    /without credentials/,
  );
});

test("event queueing is explicit and bounded", () => {
  assert.throws(
    () =>
      normalizeConfig({
        provider: false,
        events: { queue: { maxSize: 101 } },
      }),
    /integer from 1 to 100/,
  );
  assert.deepEqual(normalizeConfig({ provider: false, events: true }).events, {
    globalName: "astroAnalytics",
    queue: false,
  });
});
