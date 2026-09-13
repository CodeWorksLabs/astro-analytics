# Analytics for Astro documentation

These documents describe the public-source, npm-unpublished
`0.1.0-alpha.10` Milestone 2 correction candidate of
`@codeworkslabs/astro-analytics`.

Milestone 2 provides real Fathom, Plausible, Google Analytics 4, Matomo, and Umami adapters for
pageviews and bounded custom events. The runtime provides simultaneous-provider
coordination, exact per-provider outcomes, and provider readiness diagnostics.
No event queue or runtime consent-transition API is implemented.

All five accepted first-stable providers have implementations. Alpha.9 passed
its package, repository-driven sandbox, browser-runtime, and provider-side live
gates, but a later full committed review found that Umami suppressed a genuine
ClientRouter completion when its URL matched the preceding completion.
Alpha.10 corrects that behavior and must repeat the applicable deployment and
live gates before it replaces alpha.9. Its R4 artifact passed clean Astro and
Starlight consumer qualification and localized documentation closure review on
September 13, 2026. R5 and later documentation-only archives inherit only the
unchanged-runtime relevance of that evidence; the exact source-tag archive must
still be installed by the repository-driven sandboxes.

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
