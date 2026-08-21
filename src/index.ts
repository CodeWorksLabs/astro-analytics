import type { AstroIntegration } from "astro";
import {
  isEnabledForCommand,
  normalizeConfig,
  type AstroAnalyticsConfig,
} from "./config.ts";
import { createBootstrapScript } from "./runtime.ts";

export * from "./config.ts";
export type * from "./adapters/types.ts";

export default function astroAnalytics(
  input: AstroAnalyticsConfig,
): AstroIntegration {
  const config = normalizeConfig(input);
  let injected = false;

  return {
    name: "@codeworkslabs/astro-analytics",
    hooks: {
      "astro:config:setup"({ command, injectScript }) {
        if (injected || !isEnabledForCommand(config, command)) return;
        injectScript("page", createBootstrapScript());
        injected = true;
      },
    },
  };
}
