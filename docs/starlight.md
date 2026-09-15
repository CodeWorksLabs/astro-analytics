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

The current package loads Fathom, Plausible, immediate-consent Google Analytics 4, Matomo, or Umami
and tracks Astro-lifecycle-owned pageviews in production output.

Matomo and Umami use this same wrapper and configuration contract. Umami's
tracker attributes and browser runtime are injected by the core Astro
integration; the Starlight wrapper adds no provider-specific component override.
