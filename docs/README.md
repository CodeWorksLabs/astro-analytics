# Analytics for Astro documentation

These documents describe the npm-unpublished `0.1.0-alpha.21` source of
`@codeworkslabs/astro-analytics`.

The package provides Fathom, Plausible, Google Analytics 4, Matomo, and Umami
adapters for completed-page lifecycle tracking and bounded custom events. It
supports simultaneous providers, per-provider outcomes, blocked-query privacy,
and a Starlight wrapper. It does not provide event queueing or runtime consent
activation.

## Guides

1. [Getting started](getting-started.md)
2. [Configuration](configuration.md)
3. [API reference](api-reference.md)
4. [Event client](events.md)
5. [Starlight](starlight.md)
6. [Runtime behavior](runtime-and-safety.md)
7. [Development](development.md)
8. [Versioning and releases](versioning-and-releases.md)
9. [Changelog](../CHANGELOG.md)

## Package entry points

| Entry point | Purpose |
| --- | --- |
| `@codeworkslabs/astro-analytics` | Astro integration and configuration types |
| `@codeworkslabs/astro-analytics/client` | Browser-safe event and status helpers |
| `@codeworkslabs/astro-analytics/starlight` | Starlight plugin wrapper |

The source repository is public. The npm package is unpublished and retains its
publication safeguard.
