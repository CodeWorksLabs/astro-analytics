import type { AstroAnalyticsConfig } from "../config.ts";
import astroAnalytics from "../index.ts";

interface StarlightPlugin {
  name: string;
  hooks: {
    "config:setup": (context: {
      addIntegration: (integration: ReturnType<typeof astroAnalytics>) => void;
    }) => void;
  };
}

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
