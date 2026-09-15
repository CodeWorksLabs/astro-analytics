# Astro Analytics successor checkpoint

Updated: 2026-09-14

## Authority and boundary

New Bridge Boss coordinates recovery. This task received one exact local-only
cleanup assignment for `C:\CodeProjects\Products\Astro Analytics` on `main`.
No push, tag, release, publication, GitHub/Actions/settings/secrets change,
Cloudflare/provider action, consumer edit, deployment, or product-scope change
was authorized or performed.

## Starting identity

- Before HEAD: `ad21a6a5eed91b6bf0f692ec49db9a19bbbcdaec`
- Before tree: `24605001591423f3d0977bb62497b844cc3a8206`
- Remote-tracking `origin/main` remained at
  `c4680c80d0697271f505bdf6f43401811d527498` during this assignment.

## Local cleanup candidate

- Version: `0.1.0-alpha.20`
- `providers` is now the only provider input; `events` is boolean.
- Removed unused `AnalyticsAdapter`, `AnalyticsEvent`, and
  `AdapterRuntimePlan` exports and their source module.
- Replaced the five duplicated provider runtime state machines with shared
  client, lifecycle, route, consent, script, error-cleanup, and event
  infrastructure plus five provider-specific adapters.
- Retained Fathom, Plausible, GA4, Matomo, and Umami; simultaneous providers;
  Astro/ClientRouter completed-route behavior; blocked-query privacy;
  deferred/external consent fail-closed behavior; bounded events; independent
  statuses/results; and the Starlight wrapper.
- Reorganized tests around current configuration, provider, lifecycle, privacy,
  failure-containment, integration, and Starlight contracts.
- Replaced public recovery chronology with concise current product,
  compatibility, installation, limitation, and version facts.

## Verification

- `npm run typecheck`: passed.
- `npm test`: 30 passed, 0 failed.
- `npm pack --dry-run --json`: passed; 18 package members, 27,344-byte proposed
  archive, 103,077 bytes unpacked. No tarball was written.
- `git diff --check`: passed (Git reported only expected CRLF-to-LF normalization
  notices under the repository's LF policy).

## Handoff

The cleanup is intended to be one local commit whose parent is the starting
HEAD above. Read the current `HEAD`, tree, and `git status` for its final local
identity. Do not infer authority for any remote, consumer, provider, or
deployment action from this checkpoint.
