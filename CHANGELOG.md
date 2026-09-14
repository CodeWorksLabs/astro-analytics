# Changelog

Analytics for Astro follows [Semantic Versioning](https://semver.org/). Git tags,
matching GitHub Releases, and any authorized npm artifact identify published
versions. Until those actions occur, an entry is a candidate record, not a
release claim.

## Unreleased

## 0.1.0-alpha.14 - Candidate

- Preserve GA4 configuration as parsed data through generated inline bootstrap
  code, including reserved own property names such as `__proto__`.
- Escape inline-script terminators in serialized runtime options and add a
  runtime regression proving both properties.
- Correct repository-visibility and current-candidate documentation after the
  alpha.13 complete-family review.

## 0.1.0-alpha.13 - Candidate

- Bind Fathom readiness and event acceptance to the exact load-proven vendor
  object and exact retained methods across matching runtime reentry.
- Prevent Fathom, Plausible, and GA4 from replaying pageviews captured before a
  script-failure observation gap; Fathom also waits through same-URL in-flight
  navigation before reading live canonical and query state.
- Avoid passing an explicit empty Fathom referrer, and fully clean partial
  Fathom listener or append setup before a retry generation.
- Add focused regressions for provider substitution, observation-gap replay,
  same-URL navigation, empty-referrer behavior, and partial setup recovery.
- Add pinned product CI and an LF repository policy so an exact committed
  candidate can produce platform-independent package bytes.

## 0.1.0-alpha.12 - Candidate

- Remove synthetic initial pageview fallback: ordinary documents establish the
  initial route at document readiness, while Astro ClientRouter documents wait
  for their first completed `astro:page-load` lifecycle.
- Keep `pageviews: "none"` event-only across matching bootstrap reentry and
  recover from observer gaps only on a newly observed completion.
- Preserve Fathom and Plausible virtual referrers and GA4's completed-route
  title/referrer when pre-readiness navigations coalesce.
- Revalidate exact configured provider-script identity at readiness and send
  boundaries, and preserve unrelated DOM elements and global replacements
  during failure cleanup.
- Replace the process-random runtime token with a deterministic cooperative
  coordinator protocol identifier and expand lifecycle/provenance regression
  coverage from 146 to 151 tests.

## 0.1.0-alpha.11 - Candidate

- Track each completed Astro lifecycle as a distinct pageview across Fathom,
  Plausible, Google Analytics 4, Matomo, and Umami, including consecutive
  completions at the same URL while retaining pre-readiness coalescing.
- Preserve the immediately preceding completed URL as GA4 and Matomo's virtual
  referrer for same-URL completions and refresh Matomo's event-only title and
  route context for every completion.
- Keep Fathom, Plausible, and GA4 readiness closed when their Astro page-load
  observer cannot be installed, and recover without inventing a completion
  across the observation gap.
- Retain a pageview rejected synchronously by a vendor boundary for bounded
  matching-bootstrap retry instead of silently losing that completion.

## 0.1.0-alpha.10 - Candidate

- Once Umami is ready, track each completed Astro ClientRouter lifecycle as a
  distinct pageview, including consecutive completions whose URLs are
  identical, while retaining completion-identity deduplication for matching
  bootstrap reentry. Completions observed before readiness continue to
  coalesce to the latest confirmed route.
- Preserve the updated title and completed-route context for same-URL
  navigations instead of treating URL equality as proof that the lifecycle was
  already sent.
- Attribute a same-URL completion to the immediately preceding completed URL,
  retaining an exact virtual route edge rather than an older referrer.

## 0.1.0-alpha.9 - Candidate

- Add strict Umami Cloud and self-hosted configuration using a website UUID,
  tracker script URL, optional host URL, pageview mode, and consent mode.
- Add a package-owned Umami runtime that disables vendor automatic pageviews,
  sends ordinary-document pageviews after DOM readiness and ClientRouter
  pageviews after Astro's post-swap signal,
  and exposes independently reported readiness and event results.
- Map package events through Umami's payload-factory form with completed Astro
  route context while enforcing documented event-name, property-count,
  string-length, and numeric-precision limits.
- Fail closed on pending consent, occupied globals, script collisions,
  unproven tracker assignment, missing navigation observation, and tracker
  replacement; preserve unrelated replacement state during cleanup and allow
  a clean retry after terminal failure.
- Bind pageviews and events to the same completed Astro route context, including
  browser-history traversal, delayed tracker readiness, and event-only mode.
- Revalidate the exact script source, website, host, automatic-pageview setting,
  executable mode, and connected or legitimately detached DOM identity at
  execution, load, and every later use.
- Retain confirmed pageviews through synchronous rejection and in-flight
  navigation for bounded matching-bootstrap retry.

## 0.1.0-alpha.8 - Candidate

- Add strict Matomo Cloud and self-hosted configuration using an exact public
  tracker endpoint, site ID, optional script URL, pageview mode, and consent mode.
- Add a package-owned Matomo `_paq` runtime with Astro-lifecycle pageviews,
  failure cleanup, readiness reporting, bounded event mapping, and retry-safe
  same-document coordination.
- Map the configured Matomo event category and package event name to Matomo's
  category/action pair, with optional `_name` and `_value` event fields.
- Preserve completed Astro navigation context across delayed Matomo readiness,
  in-flight routes, inactive failure-to-retry intervals, and failed-script retry
  without replaying stale pageviews.
- Keep Matomo event URL, title, and virtual-referrer context current when
  automatic pageviews are disabled.
- Fail readiness closed before load validation and when the retained Matomo
  command proxy becomes unusable, requalify the exact restored load-proven
  owned proxy on matching reentry, and preserve
  unrelated globals through script-assignment provenance while still cleaning
  attributable partial Matomo initialization.
- Require successful singleton Astro navigation-observer registration before
  Matomo setup, retry registration safely after a transient host failure, and
  wait for the next observed completion rather than infer routes or referrers
  across an unobserved interval, explicitly clear Matomo's vendor referrer for
  that first supported route, and restore known virtual edges afterward.

## 0.1.0-alpha.7 - Candidate

- Correct the GA4 `gtag()` queue contract to push the canonical JavaScript
  `arguments` object expected by Google's loader rather than an ordinary array.
- Add a regression assertion for the command object's runtime identity after
  live sandbox testing showed that alpha.6 loaded gtag.js but sent no data.

## 0.1.0-alpha.6 - Candidate

- Add the Google Analytics 4 adapter with explicit Consent Mode configuration,
  an owned `gtag`/`dataLayer` bootstrap, and isolated Measurement ID routing.
- Force `send_page_view: false` and send initial and client-navigation
  `page_view` events from Astro's post-swap lifecycle with current location,
  title, and virtual referrer data.
- Forward bounded custom event parameters to GA4 and report loading,
  ready, consent-pending, and per-event outcomes through the shared client.
- Fail closed on occupied Google globals, script collisions, deferred or
  external consent, script failure, and reserved `send_to` event parameters.

## 0.1.0-alpha.5 - Candidate

- Add the Plausible adapter using its current site-specific script and
  `plausible.init()` contract with automatic pageviews disabled.
- Send initial and client-navigation Plausible pageviews from Astro's
  post-swap lifecycle and forward up to 30 custom event properties.
- Add `providerStatuses()` so operator surfaces can distinguish configured
  event adapters from verified runtime readiness without sending probe events
  when `events: true` installs the shared client.
- Report Fathom and Plausible loading, ready, and consent-pending states through
  the shared client while preserving independent multi-provider outcomes.

## 0.1.0-alpha.4 - Candidate

- Add plural `providers` configuration for simultaneous analytics sources while
  retaining singular `provider` as a deprecated compatibility input.
- Add a runtime provider registry that isolates adapter readiness and event
  failures instead of allowing one adapter to overwrite another.
- Return exact per-provider results from `track()` and expose
  `configuredProviders()` for operator-facing diagnostics.
- Preserve a top-level failure reason only when every configured provider fails
  for the same reason; mixed outcomes remain explicitly visible.
- Reject empty provider arrays, duplicate provider names, and simultaneous use
  of the singular and plural configuration fields.
- Retain the legacy `events` options object as deprecated enabled input while
  keeping the current event client queue-free and fixed at `astroAnalytics`.

## 0.1.0-alpha.3 - Candidate

- Narrow peer eligibility to Astro `>=7.3.2 <8` and Starlight
  `>=0.41.11 <0.43` after the latest Astro 5 and 6 patch lines failed the
  production dependency audit with critical upstream advisories.
- Qualify clean stock Astro 7.3.2 and stock Starlight 0.41.11 and 0.42.0
  consumers on Node.js 22.22.2.
- Record successful live Fathom pageview, installation, and public `track()`
  event verification on the dedicated Astro and Starlight sandboxes.

## 0.1.0-alpha.2 - Candidate

- Add the first real provider adapter for Fathom Analytics.
- Trigger Fathom pageviews from Astro's post-swap page-load lifecycle so initial,
  client-side, and browser-history navigation use current canonical metadata.
- Defer delayed vendor readiness during an in-flight navigation until Astro has
  emitted the destination's post-swap lifecycle signal.
- Replace forgeable runtime-state reuse with DOM-verified script reuse and
  fail-closed state publication before listener or script side effects.
- Select and rediscover a genuinely unused bounded script ID when unrelated DOM
  elements occupy the primary or fallback IDs.
- Preserve non-executable URL deduplication across verified same-script reuse and
  reject inert or configuration-incompatible script reuse. Recovery from a
  disconnected or untrusted script may repeat the current pageview, and failed
  best-effort listener removal leaves the superseded callback inert rather than
  preventing the replacement generation.
- Require guarded `Symbol.for()` lookup to return a symbol before any document
  coordination property is read or written.
- Explicitly disable dynamic-script force-async behavior and ignore late load or
  error callbacks from a superseded runtime generation.
- Load Fathom's deferred embed for enabled production builds and connect the
  package event helper to `fathom.trackEvent()` after the vendor API is ready.
- Map Fathom DNT, canonical, automatic, and Astro-owned pageview settings.
- Fail closed for deferred or externally managed consent until a future consent
  activation API is implemented.
- Publish and verify revocable runtime state before exposing the event client,
  and retain the latest post-swap pageview while Fathom is still loading.
- Reject same-document changes from an already-started immediate runtime to a
  pending consent mode because browser script execution cannot be reliably undone.
- Delay manual pageviews during browser prerendering until activation.
- Treat a loaded script without Fathom's pageview API as a failed generation and
  keep failure cleanup independent of externally frozen lifecycle state.
- Bind reusable document coordination state to an unpredictable per-module proof
  so lookalikes cannot suppress startup and matching integrations deduplicate.
- Avoid replaying historical pre-ready routes with incorrect live query
  attribution; coalesce them to the latest current navigation instead.
- Retain the authenticated callback generation when reusing a matching live
  script, without trusting replaceable document lifecycle or readiness fields.
- Deduplicate repeated lifecycle signals by browser navigation rather than by
  canonical reporting payload, preserving distinct canonicalized visits.
- Bound delayed-vendor state to one pending current navigation.
- Reuse the authenticated document and script listeners on matching reentry
  rather than attaching duplicate load, error, or page-load listeners.
- Invalidate superseded pending-consent clients before reporting consent state.
- Enforce the documented event name and property limits at the declared global
  client boundary as well as in the imported helper.
- Prevent validation-only provider fallbacks from overwriting an active
  package-branded Fathom event client.
- Gate event dispatch on this integration generation's verified vendor readiness
  so a preexisting unrelated Fathom API cannot receive events.
- Carry a closure-backed verified-load proof across matching bootstrap reentry so
  a still-downloading owned script cannot inherit readiness from an unrelated API.
- Keep authoritative generation identity in a non-replaceable coordinator
  closure, treating document and script records as inspection-only; preserve the
  original navigation guard and latest completed pending page across reentry;
  recover terminal callbacks through temporary inspection-state replacement;
  and align direct callable-property rejection.

## 0.1.0-alpha.1 - Candidate

- Add strict runtime normalization for disabled, Google Analytics, Plausible,
  and Fathom provider configuration.
- Add explicit production, preview, and development enablement.
- Add the opt-in, non-networking event fallback and bounded `track()` helper.
- Add the core Astro integration and Starlight plugin wrapper.
- Add hostile-global, configuration, integration, event, and type coverage.
- Add package-consumer documentation for setup, configuration, events,
  Starlight, runtime safety, development, API coverage, verification, and
  versioning.
- Use private package import maps for consumer-compatible internal module
  resolution in the published TypeScript source package.

This candidate does not load analytics vendors, send events or pageviews,
queue data, or make external requests.
