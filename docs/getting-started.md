# Getting started

Analytics for Astro is currently `0.1.0-alpha.20` and is not published to npm.
Use an authorized local package artifact or workspace dependency.

## Requirements

- Node.js 22.18.0 or later
- Astro 7.3.2 or later within Astro 7
- Starlight 0.41.11 through 0.42 when using the Starlight entry point

These are manifest eligibility ranges, not a claim that every matching version
has been tested. The package ships Astro-native TypeScript source and should be
loaded through Astro or another TypeScript-aware build pipeline.

## Configure Astro

```js
import { defineConfig } from "astro/config";
import analytics from "@codeworkslabs/astro-analytics";

export default defineConfig({
  integrations: [
    analytics({
      providers: [
        { name: "fathom", siteId: "YOUR-SITE-ID" },
      ],
      events: true,
    }),
  ],
});
```

Production builds are enabled by default. Development and preview setup are
disabled unless selected through `environments`.

```js
analytics({
  providers: [{ name: "fathom", siteId: "YOUR-SITE-ID" }],
  environments: { development: true },
  events: true,
});
```

## Use the client helper

```ts
import { configuredProviders, providerStatuses, track }
  from "@codeworkslabs/astro-analytics/client";

const result = track("purchase", { value: 25 });
console.log(result.providers);
console.log(configuredProviders(), providerStatuses());
```

Before an adapter is ready, its result is `adapter-not-loaded`. Deferred and
external consent configurations return `consent-pending` and load no vendor.

## Self-hosted providers

Matomo requires its public `trackerUrl`, numeric `siteId`, and an event category.
Umami requires its public website UUID and tracker script URL; `hostUrl` is
optional. These are browser tracking values, not administrative credentials.
Umami 3.2.0 or later is required for package-owned pageviews.

Continue with [Configuration](configuration.md), [Event client](events.md), and
[Runtime behavior](runtime-and-safety.md).
