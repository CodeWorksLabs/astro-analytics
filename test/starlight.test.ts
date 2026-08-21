import assert from "node:assert/strict";
import test from "node:test";
import { starlightAnalytics } from "../src/starlight/index.ts";

test("Starlight wrapper adds the core integration without component overrides", () => {
  const integrations: unknown[] = [];
  const plugin = starlightAnalytics({ provider: false });
  plugin.hooks["config:setup"]({
    addIntegration(integration) {
      integrations.push(integration);
    },
  });
  assert.equal(integrations.length, 1);
  assert.equal(
    (integrations[0] as { name: string }).name,
    "@codeworkslabs/astro-analytics",
  );
  assert.equal("components" in plugin, false);
});
