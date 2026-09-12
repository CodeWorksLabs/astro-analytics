# Runtime and safety model

## Current boundary

Milestone 2 provides a strict configuration boundary, a bounded event helper,
and real vendor adapters for Fathom, Plausible, and Google Analytics 4. It has
no event queue, storage layer, credential store, authentication system, or
runtime consent-transition API.

Matomo and Umami are planned providers, not dormant alpha.7 adapters. No code
path recognizes their provider names, creates their globals, loads their
scripts, or sends data to them.

## Injection policy

During Astro configuration setup, the integration requests runtime injection
only when all of these are true:

1. `enabled` is `true`.
2. `providers` is not `false`.
3. The current Astro command is enabled by `environments`.
4. The integration instance has not already injected during configuration setup.

Enabled immediate-consent providers load for pageview analytics even when `events` is false. That flag only
controls installation of `globalThis.astroAnalytics`.

The default Fathom pageview mode disables Fathom's eager automation and calls
Fathom after Astro's page-load lifecycle. This records initial loads and
`ClientRouter` navigation only after Astro has swapped canonical page metadata,
including during browser history traversal. If the vendor becomes ready while a
navigation is in flight, the load callback waits for the destination's next
post-swap page-load signal instead of recording against stale canonical data.
When multiple post-swap page-load signals arrive before vendor readiness, only
the latest current navigation is retained. Earlier destinations are not replayed:
Fathom derives campaign query attribution from the live location even when given
an older explicit URL, so replay would misattribute those historical visits. This
single pending slot also bounds memory and recovery traffic during a stalled
vendor request. The eventual current send uses Fathom's normal live canonical and
query lookup.
Browser prerenders retain pageviews until `prerenderingchange`; abandoned
prerenders send nothing, while activation flushes the current generation once.

The generated bootstrap catches hostile global access and definition failures so
analytics cannot break page execution.
Optional event-client installation is isolated from provider script installation;
a client-boundary failure does not suppress otherwise enabled pageview loading.

The resulting script is part of built output. Environment flags do not evaluate
again in the browser, and previewing existing output does not add or remove the
script. Build with the intended policy before previewing or serving an artifact.

## Provider coordinator and single-global design

The public bootstrap uses only `globalThis.astroAnalytics`. An authenticated,
symbol-keyed coordinator retains the configured provider order and private
adapter registry. Each provider registers independently; the public client's
`track()` method fans out to every configured provider and returns every result.
One missing, blocked, or consent-pending adapter cannot hide another adapter's
success.

When events are enabled, the coordinator creates a frozen client with a frozen
ordered provider list and attempts one property definition when the current
descriptor permits replacement. Matching page bootstraps retain the authentic
coordinator-owned client.

The `__astroAnalyticsBrand` string is descriptive metadata. It is public and
forgeable and must not be used as authentication or authorization evidence.

Fathom listener cleanup uses document-scoped coordination state. Public fields
in that state never authorize callback execution or establish script ownership.
An already connected script is reused only after its DOM identity, source, and
executable classic-script settings and package-owned attributes match the current
configuration. Inert data-block types and mismatched pageview, DNT, canonical, or
automatic settings are not accepted as initialized vendor scripts. Created
scripts explicitly disable force-async behavior so their execution settings match
the reuse predicate. A replacement state
must be published and read back successfully before the runtime adds a listener
or appends a script; rejected publication therefore fails closed without leaving
repeatable untracked side effects. If unrelated DOM elements occupy the normal
script ID, the loader chooses the first unused ID from a bounded fallback set and
uses the same set to rediscover an already connected package script.
Package ownership is detected separately from configuration compatibility. If a
connected package script has different provider settings, the later bootstrap is
rejected instead of appending a second Fathom runtime.

Authoritative coordination lives in a non-configurable, non-writable coordinator
whose closure retains the current package-created generation. The document and
script state records remain inspection surfaces; even an exact copied token,
attribute set, descriptor shape, and self-reference on another script cannot add
that script to the retained generation. Identical integration instances call the
coordinator, which validates its closure-held script against the current DOM and
configuration before reuse. The inspection state
carries the last successfully sent browser-navigation URL as non-executable
deduplication state, separately from the canonical payload sent to Fathom;
the replaceable document copy and immutable script copy are never authoritative
for callbacks, readiness, or activity. Matching reentry restores the authentic
closure-held state and retains its
existing listener and callback generation. This preserves both its original
browser URL guard and its latest completed pending post-swap navigation across
reentry while the vendor is loading or the document is prerendering. Verified
readiness remains closure-backed in that retained generation; an unrelated
ambient Fathom API and substituted public readiness fields cannot establish or
suppress it. Load/error callbacks also consult the coordinator-held generation,
so temporary replacement of the inspection record cannot consume and strand a
terminal script outcome.
If outside code disconnects the verified script first, its saved cleanup objects
are no longer trusted or invoked. Publishing a replacement state makes that old
listener generation inert even if the browser retains the callback registration.
Load and error callbacks also confirm that their generation is still the current
document state; a late callback from a removed, superseded script is ignored.
Runtime state is published and read back before a new event client is exposed, so
a failed publication cannot leave an untracked client outside later revocation.
If the vendor script fails, or reports `load` without exposing Fathom's
`trackPageview()` API, its generation is deactivated, pending page URLs are
cleared, its Astro page-load listener is removed, and the script is disconnected
before retry is permitted. Deactivation uses private closure state, so freezing
the inspection-only lifecycle object cannot prevent cleanup.

Consent mode is a build-time choice and is immutable after an immediate runtime
has begun loading Fathom in a document. A later conflicting pending-consent
bootstrap is rejected because browsers cannot reliably cancel or undo an already
prepared third-party classic script. Sites that require deferred or external
consent must select that mode before the first vendor load attempt; this candidate
does not provide a runtime consent-transition API.

## Existing property behavior

- A configurable property can be converted to the client data property.
- A writable data property can receive the client while retaining its existing
  descriptor flags.
- A non-configurable accessor is left unchanged.
- A data property is left unchanged only when it is both non-configurable and
  non-writable; configurability alone permits replacement.
- A non-extensible root with no existing property is left unchanged.
- Exceptions are contained by the bootstrap.

JavaScript cannot prevent arbitrary side effects performed inside a caller-owned
Proxy trap. The package guarantee is limited to its own one-property installation
algorithm and non-throwing boundary.

## Event data handling

The public `track()` helper trims and bounds event names, validates plain property
records, copies accepted primitive values into a new object, preserves the client
method receiver, and normalizes the returned result to the exact public union.

The Fathom adapter invokes the vendor's synchronous `trackEvent()` boundary and
returns success once that invocation is accepted. Delivery is controlled by
Fathom and is not synchronously confirmed. No event is queued or persisted by
this package. Only a non-negative safe-integer `_value` is forwarded as Fathom
event metadata.

The Plausible adapter installs the vendor's documented pre-load queue and calls
`plausible.init()` with `autoCapturePageviews: false` before appending the
site-specific script. It rejects an occupied `plausible` global rather than
adopting unrelated state. Script load marks the adapter ready; script failure or
partial setup revokes its listener and owned queue. Pageviews are sent through
`plausible("pageview", { url })` only after Astro's lifecycle identifies the
current destination. Custom events are sent synchronously through
`plausible(name, { props })`; success means the vendor call accepted the event,
not that Plausible's server confirmed delivery. Property bags over Plausible's
30-property limit fail before the vendor call, and numeric or boolean values are
serialized to strings for Plausible's custom-property contract.

The Google Analytics 4 adapter refuses pre-existing `gtag` or `dataLayer`
globals instead of adopting unrelated state. It emits configured Consent Mode
defaults before the one `config` command, forces `send_page_view: false`, and
marks the adapter ready only after its owned gtag.js script loads while both
owned globals remain intact. Astro lifecycle pageviews include current location
and title plus the preceding virtual URL as referrer. Custom events preserve up
to 25 validated primitive parameters and add the configured Measurement ID as
`send_to`; callers cannot override that routing field. A synchronous success
means the command entered the owned Google queue, not that Google's server has
confirmed delivery. Sites must disable Enhanced Measurement's history-based
page changes to prevent duplicate SPA pageviews.
