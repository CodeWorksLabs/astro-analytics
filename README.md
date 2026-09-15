# Analytics for Astro

`@codeworkslabs/astro-analytics` is an experimental Astro integration for
Fathom, Plausible, Google Analytics 4, Matomo, and Umami. The current source is
`0.1.0-alpha.20` and is not published to npm.

It supports multiple providers at once, Astro and ClientRouter pageview
lifecycle handling, bounded custom events, per-provider status/results, an
optional blocked-query privacy boundary, and a Starlight wrapper.

## Quick start

Install an authorized package artifact, then configure one or more providers:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import analytics from "@codeworkslabs/astro-analytics";

export default defineConfig({
  integrations: [
    analytics({
      providers: [
        { name: "fathom", siteId: "YOUR-SITE-ID" },
      ],
      events: true,
      blockedQueryParameters: ["preview"],
    }),
  ],
});
```

`providers` is required. Set it to `false` to disable the integration. The
singular `provider` input and object-shaped `events` compatibility input are not
part of the current contract.

The default environment policy injects analytics only during production builds.
Provider script URLs must use HTTPS. `blockedQueryParameters` prevents the
browser runtime from starting on matching URLs and excludes blocked URLs from
provider referrer context.

## Client events

```ts
import {
  configuredProviders,
  providerStatuses,
  track,
} from "@codeworkslabs/astro-analytics/client";

const result = track("purchase", { plan: "pro", value: 25 });
console.log(result.providers);
console.log(configuredProviders(), providerStatuses());
```

`events: true` installs the browser client. Each provider returns its own
`ready`, `adapter-not-loaded`, `consent-pending`, or `invalid-event` outcome;
one provider cannot hide another provider's result. Calls are synchronous and
confirm adapter acceptance, not server delivery.

## Current limitations

- Deferred and external consent modes fail closed and do not load their vendor;
  there is no runtime consent-transition API yet.
- Events are not queued before adapters become ready.
- Fathom forwards only `_value`; Matomo maps `_name` and `_value`; the other
  adapters apply their documented provider limits.
- The package ships TypeScript source and is intended for Astro or another
  TypeScript-aware build pipeline.
- The package remains npm-unpublished and retains `private: true`.

## Documentation

- [Getting started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [API reference](docs/api-reference.md)
- [Event client](docs/events.md)
- [Starlight](docs/starlight.md)
- [Runtime behavior](docs/runtime-and-safety.md)
- [Development](docs/development.md)
- [Versioning and releases](docs/versioning-and-releases.md)
- [Changelog](CHANGELOG.md)

## Local verification

```powershell
npm ci
npm run verify
```

`npm run verify` performs strict TypeScript checking and runs the Node test
suite. Repository guidance is in `AGENTS.md`.
