# Analytics for Astro documentation

These documents describe the public-source, source-tagged, npm-unpublished
`0.1.0-alpha.8` Milestone 2 candidate of
`@codeworkslabs/astro-analytics`.

Milestone 2 provides real Fathom, Plausible, Google Analytics 4, and Matomo adapters for
pageviews and bounded custom events. The runtime provides simultaneous-provider
coordination, exact per-provider outcomes, and provider readiness diagnostics.
No event queue or runtime consent-transition API is implemented.

Umami is the remaining approved roadmap provider for the first stable release.
It is a placeholder only in alpha.8: its provider name is not accepted by the
configuration schema, injected into a page, or exposed by the event client.

## Guides

1. [Getting started](getting-started.md)
2. [Configuration reference](configuration.md)
3. [API reference](api-reference.md)
4. [Event client](events.md)
5. [Starlight integration](starlight.md)
6. [Runtime and safety model](runtime-and-safety.md)
7. [Development and verification](development.md)
8. [Versioning and releases](versioning-and-releases.md)
9. [Changelog](../CHANGELOG.md)

## Package entry points

| Entry point | Purpose |
| --- | --- |
| `@codeworkslabs/astro-analytics` | Astro integration and configuration types |
| `@codeworkslabs/astro-analytics/client` | Browser-safe `track()` helper and event types |
| `@codeworkslabs/astro-analytics/starlight` | Starlight plugin wrapper |

The source repository is public. The npm package is currently unpublished and
retains its publication safeguard. Installation, release, site integration, and
deployment remain separate authorized activities.
