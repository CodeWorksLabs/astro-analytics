import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { AstroAnalyticsConfig } from "#config";
import astroAnalytics from "#core";

export function starlightAnalytics(
  config: AstroAnalyticsConfig,
): StarlightPlugin {
  return {
    name: "@codeworkslabs/astro-analytics/starlight",
    hooks: {
      "config:setup"({ addIntegration }) {
        addIntegration(astroAnalytics(config));
      },
    },
  };
}
