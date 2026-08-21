import assert from "node:assert/strict";
import test from "node:test";
import astroAnalytics from "../src/index.ts";

function runSetup(
  integration: ReturnType<typeof astroAnalytics>,
  command: "dev" | "build" | "preview" | "sync",
  injected: string[],
) {
  integration.hooks["astro:config:setup"]?.({
    command,
    injectScript(stage: string, content: string) {
      injected.push(`${stage}:${content}`);
    },
  } as never);
}

test("disabled analytics injects no runtime", () => {
  const injected: string[] = [];
  runSetup(astroAnalytics({ provider: false }), "build", injected);
  assert.deepEqual(injected, []);
});

test("default environment policy injects only during build", () => {
  const integration = astroAnalytics({
    provider: { name: "fathom", siteId: "ABCDEFG" },
  });
  const injected: string[] = [];
  runSetup(integration, "dev", injected);
  runSetup(integration, "preview", injected);
  assert.equal(injected.length, 0);
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);
  assert.match(injected[0], /^page:/);
});

test("config restarts do not inject the bootstrap twice", () => {
  const integration = astroAnalytics({
    provider: { name: "fathom", siteId: "ABCDEFG" },
  });
  const injected: string[] = [];
  runSetup(integration, "build", injected);
  runSetup(integration, "build", injected);
  assert.equal(injected.length, 1);
});

test("bootstrap itself is guarded by a stable runtime sentinel", () => {
  const integration = astroAnalytics({
    provider: { name: "fathom", siteId: "ABCDEFG" },
  });
  const injected: string[] = [];
  runSetup(integration, "build", injected);
  assert.match(injected[0], /if \(!globalThis\.__astroAnalyticsRuntime\)/);
  assert.match(injected[0], /adapter-not-loaded/);
});
