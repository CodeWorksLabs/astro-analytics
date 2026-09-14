# Analytics for Astro

`@codeworkslabs/astro-analytics` is an experimental reusable analytics
integration for Astro. The current source candidate is
`0.1.0-alpha.18` and is not published to npm.

> [!IMPORTANT]
> Milestone 2 includes real Fathom, Plausible, Google Analytics 4, Matomo, and
> Umami adapters. Deferred/external consent activation is not
> implemented, and this alpha is not yet a
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
      blockedQueryParameters: ["cwl_journey"],
    }),
  ],
});
```

`blockedQueryParameters` is an optional fail-closed privacy boundary. When the
current URL contains any listed name, Analytics for Astro initializes neither
its event client nor any provider runtime on that document.

This example validates the Fathom configuration, loads Fathom's deferred embed
during production builds, tracks provider-owned pageviews, and connects the
bounded event helper to `fathom.trackEvent()`.

## Current contract

The package currently provides:

- strict runtime normalization for disabled, Google Analytics, Plausible,
  Fathom, Matomo, and Umami provider configuration;
- explicit production, preview, and development enablement;
- HTTPS-only validation for configurable script and event endpoints;
- real Fathom, Plausible, Google Analytics 4, Matomo, and Umami pageview and event adapters;
- completion-identity pageviews that preserve consecutive Astro lifecycle
  completions even when their URLs are identical;
- an optional event client enabled only by `events: true`;
- a provider registry for simultaneous analytics sources;
- a non-throwing `track()` helper with bounded event names, properties, and
  exact per-provider return values;
- `configuredProviders()` and `providerStatuses()` helpers for operator-facing
  diagnostics; and
- a Starlight plugin wrapper that adds the core Astro integration without
  component overrides.

`events: false` and an omitted `events` option install no package event global,
but enabled Fathom, Plausible, immediate-consent GA4, immediate-consent
Matomo, and immediate-consent Umami providers still load for pageview analytics.
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

Matomo maps the configured event category and package event name to Matomo's
category/action pair. Optional `_name` and `_value` properties fill Matomo's
event-name and event-value positions; other validated properties are not sent
to Matomo. With `pageviews: "none"`, Astro navigation still refreshes Matomo's
URL, title, and virtual-referrer context so later events are attributed to the
last completed route, but no automatic pageview is sent.

Across all five providers, each ready Astro lifecycle completion is a distinct
pageview even when consecutive completions share a URL. Completions observed
before vendor readiness coalesce to the latest confirmed route. Provider
readiness remains closed when the required Astro page-load observer cannot be
installed.

Umami loads its public tracker with automatic pageviews disabled and sends
an ordinary document's initial pageview after DOM readiness and ClientRouter
pageviews after Astro's page-load completion signal. Once the tracker is ready,
consecutive completions at the same URL remain distinct; before readiness,
completed routes coalesce to the latest confirmed route. Pageviews and custom events
use payload factories so URL, title, and referrer always come from the same
completed Astro route, including `pageviews: "none"`. At most 50 custom
properties are forwarded. Umami's 50-character event-name, 500-character
string-value, and four-decimal numeric boundaries are enforced per provider.

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

The source repository is
`https://github.com/CodeWorksLabs/astro-analytics`.
