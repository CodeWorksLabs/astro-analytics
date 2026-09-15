# Changelog

Analytics for Astro follows [Semantic Versioning](https://semver.org/). The
package is not currently published to npm.

## Unreleased

## 0.1.0-alpha.21

- Enforce one exact event-property record boundary for both the imported client
  helper and direct browser client. Symbol-keyed, non-enumerable, accessor, and
  branded property bags now fail closed instead of being accepted or silently
  reduced.

## 0.1.0-alpha.20

- Remove the unused `AnalyticsAdapter`, `AnalyticsEvent`, and
  `AdapterRuntimePlan` exports.
- Remove the unpublished singular `provider` and object-shaped `events`
  compatibility inputs; `providers` and boolean `events` now define the
  configuration contract.
- Replace five duplicated browser runtime state machines with shared lifecycle,
  route, consent, script, cleanup, and event coordination plus provider-specific
  adapters.
- Retain Fathom, Plausible, GA4, Matomo, and Umami, simultaneous-provider
  operation, ClientRouter completion tracking, blocked-query privacy, bounded
  events, provider status reporting, and the Starlight wrapper.
- Replace internal process chronology in public documentation with current
  behavior, limitations, compatibility, installation, and version facts.

## Earlier alpha development

Earlier alpha versions established the five provider integrations,
simultaneous-provider results, bounded custom events, Astro and ClientRouter
pageview lifecycles, virtual referrers, blocked-query privacy, Starlight support,
and reproducible package metadata. Those versions were development artifacts;
consult Git history when implementation-level provenance is required.
