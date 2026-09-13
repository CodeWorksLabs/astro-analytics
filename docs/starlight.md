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

Milestone 2 loads Fathom, Plausible, immediate-consent Google Analytics 4, or Matomo
and tracks Astro-lifecycle-owned pageviews in production output.

Matomo uses this same wrapper and configuration contract. The planned Umami
adapter will use it after implementation and qualification; alpha.8 does not
accept Umami configuration.
