# Event client

Import the public event helper from the client entry point:

```ts
import {
  configuredProviders,
  providerStatuses,
  track,
  type EventProperties,
  type ProviderTrackFailureReason,
  type TrackResult,
} from "@codeworkslabs/astro-analytics/client";
```

## Track an event

```ts
const result = track("checkout", {
  total: 12.5,
  currency: "USD",
  member: true,
});
```

`track()` is synchronous and does not throw for malformed browser globals,
clients, or adapter results. It validates and
copies the event before invoking `window.astroAnalytics.track()`.

The current package connects the client to Fathom's `trackEvent()`, Plausible's
`plausible()`, Google Analytics 4's `gtag()`, Matomo's `_paq`, and Umami's
`umami.track()` APIs. Calls made before an integration's script load is verified return `adapter-not-loaded`; they are not
queued or retried. Unrelated preexisting vendor globals are not treated as
package readiness.

`configuredProviders()` returns the ordered provider names owned by the current
runtime. It is intended for diagnostics and operator-facing test surfaces; it
does not select or activate a provider.

`providerStatuses()` returns an exact status for every configured provider:
`ready`, `adapter-not-loaded`, or `consent-pending`. It performs no tracking and
is the appropriate readiness signal for controls that must not fire probe
events. Like `track()`, it is available only when `events: true` installs the
shared browser client; pageview-only configurations return an empty status map.

## Input limits

| Input | Limit |
| --- | --- |
| Event name | Non-empty after trimming; at most 128 characters |
| Property count | At most 100 own properties |
| Property key | Non-empty string; at most 128 characters |
| String value | At most 1,024 characters |
| Number value | Must be finite |
| Other values | Booleans are accepted; objects, arrays, `null`, symbols, and functions are rejected |

Property bags must be ordinary or null-prototype records containing only
enumerable string-keyed data properties. Symbol-keyed, non-enumerable, and
accessor properties are rejected, as are branded objects such as `Map`, `Date`,
`Set`, boxed primitives, and regular expressions.

## Results

```ts
type TrackResult =
  | { ok: true; providers: ProviderTrackResults }
  | {
      ok: false;
      providers: ProviderTrackResults;
      reason?: TrackFailureReason;
    };

type ProviderTrackResults = Partial<Record<ProviderName,
  | { ok: true }
  | { ok: false; reason: ProviderTrackFailureReason }
>>;
```

Every configured provider receives an independent result. `ok` is true only
when every configured provider accepts the event. Mixed results intentionally
omit the top-level `reason`; a top-level reason is present only for generic
pre-dispatch failures or when every configured provider fails for that same
reason.

| Reason | Meaning |
| --- | --- |
| `disabled` | No usable browser client exists, including during SSR |
| `adapter-not-loaded` | That provider API is not ready or its client boundary failed |
| `consent-pending` | A provider is configured for deferred or external consent and is not loaded |
| `invalid-event` | The event name or properties failed validation |

Input validation runs before environment and client lookup. Therefore,
`invalid-event` takes precedence over `disabled` or `adapter-not-loaded` for a
malformed call, including during SSR. A valid call with no browser client returns
`disabled`.

That ordering describes the public helper's generic event validation. Fathom's
provider-specific `_value` rule is evaluated only after consent permits tracking
and the Fathom API is ready. Consequently, a negative or fractional `_value`
returns `consent-pending` while consent is pending, `adapter-not-loaded` before
Fathom loads, and `invalid-event` once `fathom.trackEvent()` is callable.

Unexpected adapter results are converted to per-provider `adapter-not-loaded`
failures rather than escaping the public result union or hiding another
provider's success.

## Browser global

When configuration, environment policy, and `events: true` all permit injection,
the bootstrap defines a frozen `window.astroAnalytics` client with a frozen,
ordered `providers` list. The coordinator preserves its client across matching
page bootstraps and leaves unrelated occupied globals unchanged.
Provider adapters register independently, so one adapter cannot overwrite or
suppress another by integration order. Direct calls to this declared public
client receive the same event name and property validation as the imported
helper; they cannot bypass the limits above.

Fathom supports an optional monetary event value in cents. The adapter forwards
only a non-negative safe-integer `_value` property. An invalid supplied `_value`
returns `invalid-event`; other validated properties are not transmitted by this
provider adapter.

Plausible receives validated properties as `props`; numeric and boolean values
are serialized to strings to match its current tracker contract. Its current
service limit is 30 properties per event, so a larger otherwise-valid property
bag returns a Plausible `invalid-event` result without calling the vendor API.

Google Analytics 4 receives up to 25 validated event parameters. Caller-supplied
`send_to` is rejected because the adapter owns routing to its Measurement ID.

Matomo receives `trackEvent(eventCategory, action, name?, value?)`. The provider's
configured `eventCategory` supplies the category and the package event name
supplies the action. Optional `_name` and finite numeric `_value` properties
supply Matomo's third and fourth arguments. Other validated properties are not
sent to Matomo, allowing another configured provider to consume them without
inventing Matomo semantics. An empty or non-string `_name` produces Matomo's
per-provider `invalid-event` result. When Matomo uses `pageviews: "none"`, its
Astro page-load listener still applies the URL, title, and preceding virtual URL
of each completed route before later events; it does not send `trackPageView`.

Umami receives a payload-factory call containing the event name and data plus
the last completed Astro route's URL, title, and referrer. This keeps events
aligned with package pageviews after browser-history traversal and delayed
tracker readiness. Provider-specific validation limits event names to 50
characters, property bags to 50 entries, strings to 500 characters, and numbers
to four decimal places. The shared client currently accepts primitive values
only, even though Umami itself can accept arrays and nested objects. An accepted
synchronous call produces Umami's independent `{ ok: true }` result; it does not
prove server delivery.

The browser client and its metadata are not a security boundary against other
same-origin JavaScript.
