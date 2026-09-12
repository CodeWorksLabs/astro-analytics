# Analytics for Astro

`@codeworkslabs/astro-analytics` is an experimental reusable analytics
integration for Astro. It is currently a private `0.1.0-alpha.7` candidate and
is not published to npm.

> [!IMPORTANT]
> Milestone 2 includes real Fathom, Plausible, and Google Analytics 4 adapters.
> Deferred/external consent activation is not implemented, and this private alpha is not yet a
> general production analytics release.

## Quick start

After obtaining an authorized local package artifact, add the integration to an
Astro project:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import analytics from "@codeworkslabs/astro-analytics";

export default defineConfig({
  integrations: [
    analytics({
      providers: [
        {
          name: "fathom",
          siteId: "YOUR-SITE-ID",
        },
      ],
      events: true,
    }),
  ],
});
```

This example validates the Fathom configuration, loads Fathom's deferred embed
during production builds, tracks provider-owned pageviews, and connects the
bounded event helper to `fathom.trackEvent()`.

## Current contract

The package currently provides:

- strict runtime normalization for disabled, Google Analytics, Plausible, and
  Fathom provider configuration;
- explicit production, preview, and development enablement;
- HTTPS-only validation for configurable script and event endpoints;
- real Fathom, Plausible, and Google Analytics 4 pageview and event adapters;
- an optional event client enabled only by `events: true`;
- a provider registry for simultaneous analytics sources;
- a non-throwing `track()` helper with bounded event names, properties, and
  exact per-provider return values;
- `configuredProviders()` and `providerStatuses()` helpers for operator-facing
  diagnostics; and
- a Starlight plugin wrapper that adds the core Astro integration without
  component overrides.

`events: false` and an omitted `events` option install no package event global,
but enabled Fathom, Plausible, and immediate-consent GA4 providers still load for pageview analytics.
`events: true` installs a frozen, package-owned client. Each configured provider
returns its own result. Fathom returns `adapter-not-loaded` until its verified
browser API is ready, then dispatches through `fathom.trackEvent()` without
hiding another provider's independent state.

Milestone 2 does not implement event queueing or a runtime consent-transition API.
Fathom event properties other than a non-negative safe-integer `_value` are
validated by the public helper but are not sent to Fathom. Plausible receives
up to 30 validated custom properties through its `props` option. GA4 receives
up to 25 validated parameters and reserves `send_to` for package-controlled
Measurement ID routing.

## Documentation

- [Getting started](docs/getting-started.md)
- [Configuration reference](docs/configuration.md)
- [API reference](docs/api-reference.md)
- [Event client](docs/events.md)
- [Starlight integration](docs/starlight.md)
- [Runtime and safety model](docs/runtime-and-safety.md)
- [Development and verification](docs/development.md)
- [Versioning and releases](docs/versioning-and-releases.md)
- [Changelog](CHANGELOG.md)

## Verification

Install the pinned development dependencies and run both gates:

```powershell
npm ci
npm run verify
```

`npm run verify` runs strict TypeScript compilation against the installed
Astro and Starlight types, followed by the Node test suite.

Astro site implementations belong under `C:\CodeProjects\Sites`; reusable
Astro operating knowledge belongs under `C:\CodeProjects\Platforms\Astro`.
Repository rules are in `AGENTS.md`, and recovery state is maintained in
`SUCCESSOR_CHECKPOINT.md`.

The private development remote is
`https://github.com/CodeWorksLabs/astro-analytics`.
