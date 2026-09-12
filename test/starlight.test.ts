import assert from "node:assert/strict";
import test from "node:test";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import { starlightAnalytics } from "../src/starlight/index.ts";

type SetupHook = NonNullable<StarlightPlugin["hooks"]["config:setup"]>;
type SetupContext = Parameters<SetupHook>[0];

test("Starlight wrapper adds the core integration without overrides", () => {
  const integrations: unknown[] = [];
  const plugin: StarlightPlugin = starlightAnalytics({ providers: false });
  const setup = plugin.hooks["config:setup"];
  if (!setup) throw new Error("config:setup hook is missing");
  setup({
    addIntegration(integration) {
      integrations.push(integration);
    },
  } as SetupContext);
  assert.equal(integrations.length, 1);
  assert.equal(
    (integrations[0] as { name: string }).name,
    "@codeworkslabs/astro-analytics",
  );
  assert.equal("components" in plugin, false);
});
