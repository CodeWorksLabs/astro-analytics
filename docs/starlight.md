# Starlight integration

The Starlight entry point wraps the core Astro integration as a Starlight plugin.

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import {
  starlightAnalytics,
} from "@codeworkslabs/astro-analytics/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "My documentation",
      plugins: [
        starlightAnalytics({
          providers: [
            {
              name: "fathom",
              siteId: "YOUR-SITE-ID",
            },
          ],
          events: true,
        }),
      ],
    }),
  ],
});
```

Place `starlightAnalytics()` in Starlight's `plugins` array, not Astro's top-level
`integrations` array. The wrapper calls Starlight's `addIntegration()` with the
core Analytics for Astro integration and does not override Starlight components.

The same [configuration reference](configuration.md) applies to Astro and
Starlight.

Milestone 2 loads Fathom, Plausible, or immediate-consent Google Analytics 4
and tracks Astro-lifecycle-owned pageviews in production output.

The planned Matomo and Umami adapters will use this same Starlight wrapper after
they are implemented and qualified. Alpha.7 does not accept either provider.
