# Runtime and safety model

## Current boundary

Milestone 2 provides a strict configuration boundary, a bounded event helper,
and real vendor adapters for Fathom, Plausible, Google Analytics 4, Matomo, and Umami. It has
no event queue, storage layer, credential store, authentication system, or
runtime consent-transition API.

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
carries the last successfully sent completion identity as non-executable
deduplication state, separately from the canonical payload sent to Fathom;
the replaceable document copy and immutable script copy are never authoritative
for callbacks, readiness, or activity. Matching reentry restores the authentic
closure-held state and retains its
existing listener and callback generation. This preserves both its original
completion guard and its latest completed pending post-swap navigation across
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
`trackPageview()` API, its generation is deactivated, pending pageviews are
cleared, its Astro page-load listener is removed, and the script is disconnected
before retry is permitted. Deactivation uses private closure state, so freezing
the inspection-only lifecycle object cannot prevent cleanup. A pageview that
throws synchronously remains pending for bounded matching-bootstrap retry.

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
current destination. Every ready observed completion is sent even when its URL
matches the preceding completion; pre-ready completions coalesce to the latest.
A missing or throwing page-load observer keeps readiness closed. Custom events are sent synchronously through
`plausible(name, { props })`; success means the vendor call accepted the event,
not that Plausible's server confirmed delivery. Property bags over Plausible's
30-property limit fail before the vendor call, and numeric or boolean values are
serialized to strings for Plausible's custom-property contract. A pageview that
throws synchronously remains pending for bounded matching-bootstrap retry.

The Google Analytics 4 adapter refuses pre-existing `gtag` or `dataLayer`
globals instead of adopting unrelated state. It emits configured Consent Mode
defaults before the one `config` command, forces `send_page_view: false`, and
marks the adapter ready only after its owned gtag.js script loads while both
owned globals remain intact. Astro lifecycle pageviews include current location
and title plus the preceding virtual URL as referrer. Consecutive same-URL
completions remain distinct and use that URL as the exact virtual edge. A
missing or throwing page-load observer keeps readiness closed. Custom events preserve up
to 25 validated primitive parameters and add the configured Measurement ID as
`send_to`; callers cannot override that routing field. A synchronous success
means the command entered the owned Google queue, not that Google's server has
confirmed delivery. A synchronously rejected pageview remains pending for
bounded matching-bootstrap retry. Sites must disable Enhanced Measurement's history-based
page changes to prevent duplicate SPA pageviews.

The Matomo adapter refuses a pre-existing `_paq` global or occupied package
script ID instead of adopting unrelated state. It creates the standard startup
queue, adopts Matomo's validated replacement command proxy, configures the exact
tracker endpoint and site ID, and loads the configured
Matomo script without an eager pageview. Script readiness activates Astro-owned
pageviews containing current URL and title plus the preceding virtual URL as
referrer. Each observed completion has its own identity, so same-URL completions
refresh title and referrer context instead of being suppressed. Completed-route history survives script failure and remains separate
from any pending pageview. A single coordinator-owned Astro page-load observer
continues recording completed routes while a vendor generation is inactive,
allowing retry and in-flight navigation to recover without losing the current
route or replaying an obsolete one. In events-only mode, completed Astro
navigation still updates Matomo's URL, title, and virtual referrer but never sends
an automatic pageview. Custom events use an explicit configured-category/event-action mapping
with optional `_name` and `_value`; unrelated properties are not translated into
invented Matomo fields. Matomo setup begins only after the singleton navigation
observer is registered; a missing or throwing registration API keeps readiness
closed and matching reentry retries it safely. After an observation gap, vendor
setup waits for the next real Astro page-load completion and does not infer a
route or referrer from the current location or original document referrer. It
explicitly clears Matomo's vendor referrer for that first supported route, then
restores known virtual edges on later observed navigation. This also applies
when navigation returns to the last known URL. Readiness also
requires prior successful script-load validation and the retained command proxy's `push`
API to remain callable. A matching bootstrap may requalify the exact retained,
load-proven Matomo identities after a transient command exception once that same
proxy is callable again. A never-validated startup array cannot qualify or
accept events; a rejected pageview completion remains pending through that
requalification attempt. Script failure removes the package script and only
global values assigned while that script was `document.currentScript`; unrelated
replacement globals are preserved regardless of whether they resemble Matomo.
The coordinator's navigation observer remains so a later retry has current route
history.
Deferred and external consent remain fail-closed and create no Matomo global or
network-loading element.

The Umami adapter refuses a pre-existing `umami` global or occupied package
script ID. Before loading, it owns a guarded accessor and records only the
tracker value assigned while its script is `document.currentScript`; a
lookalike value assigned by unrelated code cannot establish readiness. At
execution, load, and every later use it revalidates the original package script's
exact source, website ID, optional host, automatic-pageview control, and
classic-script mode. While connected, that exact element must own the package
DOM ID. After Astro's ClientRouter legitimately removes the loaded head element,
the original exact element remains valid only while no replacement owns the ID.
Script load additionally requires a stable callable `track` method. A foreign
script binding, global, method, or attribute replacement immediately closes
readiness and event acceptance; restoring the exact proven state restores
readiness.

Umami automatic pageviews are disabled through `data-auto-pageview="false"`.
This requires Umami 3.2.0 or later.
The adapter calls `umami.track(payloadFactory)` after ordinary-document DOM
readiness or, when ClientRouter is present, Astro's post-swap page-load signal.
Once the tracker is ready, each observed ClientRouter completion is a distinct
pageview, even when two consecutive completions have the same URL.
Deduplication applies only when the same retained completion is retried through
matching bootstrap reentry. Completions observed before tracker readiness
coalesce to the latest confirmed route, which is sent when readiness is proven;
the adapter does not replay superseded route history.
The factory preserves Umami's default payload and replaces URL, title, and
referrer with the completed route context. Tracker load alone never invents a
completion. Missing or throwing navigation observer installation prevents the
tracker from loading. After observer recovery, setup waits for the next observed
completion and uses an empty referrer rather than inventing a route edge across
the observation gap.
`pageviews: "none"` sends no automatic pageview. When events are enabled it still
observes the same document or ClientRouter completion lifecycle so events use the
last completed route rather than the vendor's potentially stale private history
state.

Custom events use `umami.track(payloadFactory)` only while the exact load-proven
tracker and method remain installed. The payload supplies the event name/data
and the same completed URL/title/referrer context as pageviews. Per-provider
limits enforce Umami's
50-character name, 50-property data, 500-character string, and four-decimal
number boundaries. Delivery remains vendor-controlled after synchronous
acceptance. Script failure removes owned state and permits a clean retry. A
synchronous pageview exception or a later in-flight URL retains that completed
pageview for bounded matching-bootstrap retry. A subsequently completed route
supersedes the retained record. Unrelated replacement state
is preserved. Deferred and external consent load
no Umami script or global and report `consent-pending`.
