# Runtime behavior and safety

The browser runtime has three layers: one location policy, one shared event
coordinator, and a small provider adapter for each configured service. Provider
adapters share script loading, consent handling, Astro lifecycle observation,
route context, error cleanup, and registration logic.

## Page lifecycle

On an ordinary document, an adapter records the current URL, title, and allowed
document referrer and sends the initial pageview after its vendor becomes ready.
With Astro ClientRouter, it waits for `astro:page-load`, which occurs after the
new document has been swapped into place. `astro:before-preparation` marks a
navigation as in flight so vendor readiness cannot send the destination early.

Each completed ClientRouter navigation is a pageview, including consecutive
completions with the same URL. If several pages complete before a vendor is
ready, only the most recent completed route is retained. A prerendered page is
held until `prerenderingchange` confirms activation.

`pageviews: "provider"` and `pageviews: "astro"` select this package-owned
lifecycle. `pageviews: "none"` sends no automatic pageview. Route context is
still maintained for events; Matomo receives its URL/title/referrer setters
before event dispatch.

## Blocked query parameters

`blockedQueryParameters` is a fail-closed privacy boundary for the package. A
matching initial URL starts neither the shared client nor any adapter. On
ClientRouter navigation, matching routes are not recorded or sent. A blocked
URL is also excluded from document or virtual referrer context, so returning to
a clean route cannot leak it through this integration.

This boundary controls Analytics for Astro; it cannot prevent unrelated scripts
on the page from reading browser state or sending requests.

## Consent

Immediate consent permits vendor loading. Deferred and external consent modes
load no vendor and report `consent-pending`. The package does not currently
expose a consent-transition API, so a site that needs runtime activation must
integrate that policy before selecting this package mode.

## Script ownership and collisions

Each adapter creates one identifiable script element. If its preferred DOM ID
is occupied, it chooses a package-prefixed suffix instead of changing the
existing element. Matching runtime reentry is idempotent. Conflicting runtime
configuration is ignored rather than replacing an active adapter.

Provider globals that the package must initialize—Plausible, GA4, and Matomo—are
not overwritten when already present. Script failures remove only the element
and globals created by that adapter and allow a later clean initialization
attempt. Exceptions are contained so analytics cannot break the host page.

These checks provide ordinary collision avoidance and cleanup. They are not a
security boundary against arbitrary same-origin JavaScript, which can inspect or
replace any browser global.

## Event behavior

The optional event coordinator preserves configured provider order and returns
one result per provider. A ready adapter accepts synchronously; vendor network
delivery remains outside the return contract. Provider-specific limits are
documented in [Event client](events.md).

`providerStatuses()` is intended for operator feedback. It reports `ready`,
`adapter-not-loaded`, or `consent-pending` for each configured provider.

## Provider notes

- Fathom uses `trackPageview()` and `trackEvent()` with automatic pageviews off.
- Plausible initializes with `autoCapturePageviews: false` and sends explicit
  pageviews and event props.
- GA4 initializes consent before configuration, forces `send_page_view: false`,
  and routes events to the configured Measurement ID.
- Matomo initializes its queue with tracker URL and site ID, then maintains
  route context with `setCustomUrl`, `setDocumentTitle`, and `setReferrerUrl`.
- Umami sets `data-auto-pageview="false"` and uses payload factories so pageview
  and event metadata come from the same completed route.
