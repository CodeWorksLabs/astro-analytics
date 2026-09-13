# Configuration reference

The default export accepts one `AstroAnalyticsConfig` object. Configuration is
strictly checked at runtime: unknown fields, symbol keys, malformed values, and
non-record objects are rejected with `TypeError`.

Fathom, Plausible, Google Analytics 4, Matomo, and Umami settings drive implemented
Milestone 2 adapters.

## Root configuration

| Field | Type | Default | Current behavior |
| --- | --- | --- | --- |
| `providers` | `false` or non-empty provider array | Required | `false` disables the integration; an array enables one or more independently reported providers |
| `provider` | `false` or provider object | Deprecated | Compatibility input for one provider; cannot be combined with `providers` |
| `enabled` | `boolean` | `true` | Master integration switch |
| `environments` | object | Production only | Selects Astro config-setup commands that may inject analytics |
| `events` | `boolean` or deprecated options object | `false` | `true` installs the package event client; the legacy object form is accepted as enabled compatibility input |
| `debug` | `boolean` | `false` | Reserved normalized setting; Milestone 2 emits no debug output |

Only the listed keys are accepted.

Provider order is preserved. Duplicate provider names are rejected because one
runtime adapter owns each provider identity. An empty array is rejected; use
`providers: false` to disable analytics. Simultaneous sources belong in one
`providers` array so pageview, consent, readiness, and event outcomes remain
independent and observable.

## Environments

```ts
{
  production?: boolean;  // default true; Astro command: build
  preview?: boolean;     // default false; Astro command: preview
  development?: boolean; // default false; Astro command: dev
}
```

Each field is independent. The Astro `sync` command is always disabled.

This policy is evaluated by the integration during Astro configuration setup.
Injection becomes part of generated output; the flags are not runtime kill
switches. In particular, `astro preview` serves an existing build and does not
remove analytics that was included when that output was built.

## Pageview modes

Every provider accepts an optional `pageviews` field:

| Value | Intended ownership |
| --- | --- |
| `"provider"` | Package-owned pageviews after the applicable completed-page lifecycle; the default |
| `"astro"` | Explicitly selects the same package-owned lifecycle |
| `"none"` | No automatic pageviews |

All three modes are implemented for Fathom, Plausible, Google Analytics 4, Matomo,
and Umami.
For Matomo, `"none"` still maintains the last completed Astro route's URL,
title, and virtual-referrer context so custom events are attributed correctly;
it never calls `trackPageView`.

## Google Analytics 4

```js
analytics({
  providers: [
    {
      name: "google-analytics",
      measurementId: "G-EXAMPLE123",
      consent: {
        mode: "deferred",
        initial: {
          analyticsStorage: "denied",
          adStorage: "denied",
          adUserData: "denied",
          adPersonalization: "denied",
        },
      },
      pageviews: "provider",
    },
  ],
});
```

| Field | Requirement |
| --- | --- |
| `name` | Exactly `"google-analytics"` |
| `measurementId` | Required non-empty `G-` identifier containing letters or digits |
| `consent.mode` | Required: `"immediate"`, `"deferred"`, or `"external"` |
| `consent.initial.analyticsStorage` | Required when `initial` is present; `"granted"` or `"denied"` |
| Other initial consent fields | Optional `"granted"` or `"denied"` values |
| `scriptSrc` | Optional absolute HTTPS URL without credentials; defaults to the GA4 gtag URL |
| `config` | Optional plain record of strings, finite numbers, and booleans; `send_page_view` is always forced to `false` |
| `pageviews` | Optional pageview mode; default `"provider"` |

With `consent.mode: "immediate"`, the adapter creates package-owned `gtag` and
`dataLayer` globals, emits any configured consent default before `config`, and
loads gtag.js. `deferred` and `external` fail closed as `consent-pending` until a
future consent-transition API is implemented. When `initial` is supplied, set
all four Consent Mode v2 storage fields to the site's actual policy.

The adapter always disables the config command's eager pageview and sends
manual `page_view` events after Astro's post-swap `astro:page-load` signal. It
includes the current location and title and carries the preceding virtual URL as
the next pageview's referrer. In the GA4 web stream, also disable **Page changes
based on browser history events** under Enhanced Measurement; otherwise GA4 can
send duplicate SPA pageviews independently of `send_page_view: false`.

Custom events accept at most 25 properties. `send_to` is reserved and rejected
in caller properties because the adapter supplies the configured Measurement ID.

## Plausible

```js
analytics({
  providers: [
    {
      name: "plausible",
      scriptSrc: "https://analytics.example.com/js/script.js",
      endpoint: "https://analytics.example.com/api/event",
      consent: { mode: "immediate" },
      captureOnLocalhost: false,
      pageviews: "provider",
    },
  ],
});
```

`scriptSrc` is required. `scriptSrc` and `endpoint` must be absolute HTTPS URLs
without embedded credentials. `captureOnLocalhost` must be boolean. Consent, when
present, contains only `mode`. The script URL is Plausible's current
site-specific snippet URL, such as `https://plausible.io/js/pa-XXXXX.js`.

The adapter calls `plausible.init()` before loading the script with
`autoCapturePageviews: false`, the configured endpoint when present, and the
configured localhost policy. Astro owns initial and client-navigation
pageviews. Omit consent or use `immediate` to load Plausible; `deferred` and
`external` fail closed until the shared consent controller is implemented.

## Fathom

```js
analytics({
  providers: [
    {
      name: "fathom",
      siteId: "YOUR-SITE-ID",
      consent: { mode: "external" },
      honorDnt: true,
      canonical: true,
      pageviews: "provider",
    },
  ],
});
```

`siteId` is required and is trimmed. `scriptSrc` is optional and defaults to
`https://cdn.usefathom.com/script.js`. `honorDnt` and `canonical` must be boolean.
Consent, when present, contains only `mode`. Omit consent or use `immediate` to
load Fathom. `deferred` and `external` fail closed: the vendor is not loaded and
event calls return `consent-pending` because this candidate has no activation API.
Consent mode is fixed before the first Fathom load attempt. A conflicting later
bootstrap cannot retroactively cancel an already prepared vendor script and is
therefore ignored; no runtime consent-transition API is provided.

For Fathom, `honorDnt: true` emits `data-honor-dnt="true"` and
`canonical: false` emits `data-canonical="false"`. The default
`pageviews: "provider"` disables Fathom's eager automation and invokes Fathom
after Astro's `astro:page-load` event so canonical content has already swapped
on client navigation, including browser history traversal. Initial script
readiness sends the initial document only when no navigation is in flight. If a
post-swap page-load arrives before Fathom is ready, it is retained and sent once
the vendor loads; a load during an in-flight navigation waits for the post-swap
signal. `pageviews: "astro"` currently selects the same behavior explicitly.
`pageviews: "none"` sends no pageviews.

## Disabled configuration

```js
analytics({ providers: false });
```

This disables injection even if `events: true` or an environment flag is true.

## Matomo

```js
analytics({
  providers: [
    {
      name: "matomo",
      trackerUrl: "https://analytics.example.com/matomo.php",
      siteId: "1",
      eventCategory: "Website",
      consent: { mode: "immediate" },
      pageviews: "provider",
    },
  ],
  events: true,
});
```

| Field | Requirement |
| --- | --- |
| `name` | Exactly `"matomo"` |
| `trackerUrl` | Required absolute HTTPS URL ending in `/matomo.php`, without credentials, query, or fragment |
| `siteId` | Required positive integer string |
| `eventCategory` | Required non-empty string of at most 128 characters |
| `scriptSrc` | Optional absolute HTTPS URL; defaults to `matomo.js` beside `trackerUrl` |
| `consent.mode` | Optional: `"immediate"`, `"deferred"`, or `"external"`; omitted means immediate |
| `pageviews` | Optional pageview mode; default `"provider"` |

The adapter creates the standard `_paq` startup queue and, after validated
script readiness, adopts Matomo's replacement command proxy. It configures the
exact tracker URL and site ID and loads `matomo.js`. It deliberately omits Matomo's
eager `trackPageView` call. After script readiness, Astro sends the initial and
client-navigation pageviews with current URL and title plus the preceding
virtual URL as referrer. The adapter does not enable Matomo's automatic link
tracking. Completed navigation history is retained separately from a pending
send and observed for the coordinator's full document lifetime, so delayed
readiness, failed-loading intervals, or retry waits out an in-flight destination
without losing a completed route or replaying a stale one. With
`pageviews: "none"`, the same completed-route context is applied for custom events
without emitting automatic pageviews.

The coordinator must successfully register its singleton Astro navigation
observer before it starts Matomo. If that browser operation is temporarily
unavailable, Matomo remains not loaded and a matching later bootstrap retries
registration without adding duplicate listeners. Because navigation may have
completed while no observer was available, setup then waits for the next actual
Astro page-load event. That event supplies the current route; the adapter omits
an invented edge and explicitly clears Matomo's referrer for that first route,
preventing its own fallback to the potentially stale external document
referrer. Later observed navigation restores ordinary virtual-referrer edges.

Immediate consent loads Matomo. Deferred and external modes fail closed without
creating `_paq` or loading the tracker and report `consent-pending`; runtime
consent activation is not yet part of alpha.10.

## Umami

```js
analytics({
  providers: [
    {
      name: "umami",
      websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
      scriptSrc: "https://analytics.example.com/script.js",
      hostUrl: "https://analytics.example.com",
      consent: { mode: "immediate" },
      pageviews: "provider",
    },
  ],
  events: true,
});
```

| Field | Requirement |
| --- | --- |
| `name` | Exactly `"umami"` |
| `websiteId` | Required UUID string from the Umami website record |
| `scriptSrc` | Required absolute HTTPS tracker-script URL without embedded credentials |
| `hostUrl` | Optional absolute HTTPS collection host URL without credentials, query, or fragment |
| `consent.mode` | Optional: `"immediate"`, `"deferred"`, or `"external"`; omitted means immediate |
| `pageviews` | Optional pageview mode; default `"provider"` |

The adapter supports Umami Cloud and self-hosted Umami. It always emits
`data-auto-pageview="false"` so Umami cannot duplicate Astro-owned pageviews,
while leaving the tracker initialized for explicit events. The optional
`hostUrl` maps to Umami's `data-host-url` setting when the script and collection
host differ. On an ordinary multi-page Astro or Starlight site, the initial
pageview is sent through `umami.track()` after DOM readiness. When Astro's
ClientRouter is present, the adapter waits for its post-swap `astro:page-load`
signal for the initial route and every client navigation. Both paths use the
current URL and title and the known preceding URL as referrer; tracker readiness
alone never manufactures a route completion. Once the tracker is ready, every
observed completion is sent even when its URL matches the preceding completion.
Before readiness, completed routes coalesce to the latest confirmed route and
superseded history is not replayed.

`data-auto-pageview` was introduced by Umami 3.2.0, so alpha.10 requires an
Umami 3.2-or-later tracker. Earlier self-hosted trackers are not supported
because they cannot provide the package's duplicate-pageview guarantee.

Immediate consent loads Umami. Deferred and external modes fail closed without
creating `window.umami` or loading the tracker and report `consent-pending`.
The package accepts the vendor only when the configured script assigns the
tracker during its own execution; unrelated or pre-existing globals cannot
claim readiness.

Custom events use Umami's payload-factory form with the event name and data plus
the last completed Astro route's URL, title, and referrer. This prevents the
vendor's private history state from misattributing events after browser-history
traversal or delayed loading. Event-only mode still observes ordinary document
readiness or ClientRouter page-loads to maintain this context without sending
pageviews. Umami-specific validation
limits names to 50 characters, data to 50 properties, strings to 500 characters,
and numbers to four decimal places. The shared package's stricter primitive-only
event shape remains in force, so nested Umami event objects and arrays are not
accepted in alpha.10.
