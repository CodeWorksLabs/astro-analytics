# Getting started

## Status

Analytics for Astro has a public source repository. The current source candidate
is `0.1.0-alpha.11`; there is no supported npm
installation yet.

Milestone 2 implements Fathom, Plausible, Google Analytics 4, Matomo, and Umami
pageviews and custom events. No queue or runtime consent activation API is included yet.

## Declared requirements

- Node.js 22.18.0 or later
- Astro 7.3.2 or later within the Astro 7 major
- Starlight 0.41.11 through the 0.42 line when using the Starlight entry point
- An authorized local package artifact or workspace dependency

These are manifest eligibility ranges, not proof that every matching version has
been tested. The exact alpha.10 artifact completed clean consumer qualification
on September 13, 2026. Alpha.11 changes runtime behavior and must repeat that
qualification before the matrix becomes current evidence for this candidate:

| Consumer | Qualified versions |
| --- | --- |
| Stock Astro | Astro 7.3.2 on Node.js 22.22.2 |
| Stock Starlight | Starlight 0.42.0 with Astro 7.3.2 on Node.js 22.22.2 |

Starlight 0.41.11 with Astro 7.3.2 was qualified for the earlier alpha.3
candidate on September 11, 2026. It remains eligible under the peer range, but
that historical result is not current alpha.11 execution evidence.

Astro 5.18.2 and 6.4.8 built successfully with the exact alpha.2 package used
to establish this boundary, but their production dependency audits contain
critical upstream Astro advisories. They and Starlight 0.35 through 0.40, whose
peer requirements select those Astro majors, are excluded from the alpha.11
eligibility range. Future versions matching the bounded peer ranges remain
eligible, not automatically qualified compatibility claims.

The package ships Astro-native TypeScript source, as supported by Astro's package
guidance. Load the core and Starlight entry points through Astro or another
TypeScript-aware build pipeline. Direct native Node.js import from `node_modules`
is not a Milestone 2 compatibility claim because Node 22 does not strip types
from installed packages. An ordinary TypeScript consumer can typecheck the
package without enabling `allowImportingTsExtensions`.

## Add the Astro integration

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import analytics from "@codeworkslabs/astro-analytics";

export default defineConfig({
  integrations: [
    analytics({
      providers: [
        {
          name: "fathom",
          siteId: "YOUR-SITE-ID",
        },
      ],
      events: true,
    }),
  ],
});
```

The default environment policy permits injection during `astro build` setup and
does not permit it during development or preview setup. This is a build/config
hook policy, not a browser-runtime switch: `astro preview` serves an existing
build and does not remove analytics already written by a production build.

To exercise Fathom while running a development command:

```js
analytics({
  providers: [
    {
      name: "fathom",
      siteId: "YOUR-SITE-ID",
    },
  ],
  environments: {
    development: true,
  },
  events: true,
});
```

## Call the event helper

```ts
import {
  configuredProviders,
  providerStatuses,
  track,
} from "@codeworkslabs/astro-analytics/client";

const result = track("purchase", { _value: 9900 });

if (!result.ok) {
  console.log(result.providers);
}

console.log(configuredProviders());
console.log(providerStatuses());
```

Before Fathom's browser API finishes loading, a valid event call returns:

```ts
{
  ok: false,
  providers: { fathom: { ok: false, reason: "adapter-not-loaded" } },
  reason: "adapter-not-loaded"
}
```

After Fathom loads, the same call returns
`{ ok: true, providers: { fathom: { ok: true } } }` when
`fathom.trackEvent()` accepts it synchronously. See [Event client](events.md) for
validation limits and all result reasons.

## Configure Matomo

```js
analytics({
  providers: [
    {
      name: "matomo",
      trackerUrl: "https://analytics.example.com/matomo.php",
      siteId: "1",
      eventCategory: "Website",
    },
  ],
  events: true,
});
```

`trackerUrl` is the public tracking endpoint, not an administrative or API
credential. The default tracker script is `matomo.js` beside that endpoint.
Self-hosted installations with another public script location can set
`scriptSrc` explicitly.

## Configure Umami

```js
analytics({
  providers: [
    {
      name: "umami",
      websiteId: "YOUR-UMAMI-WEBSITE-UUID",
      scriptSrc: "https://analytics.example.com/script.js",
      hostUrl: "https://analytics.example.com",
    },
  ],
  events: true,
});
```

Use the public website UUID and tracker URL from Umami's tracking-code screen.
`hostUrl` is optional when Umami should collect at the same origin that serves
the script. The adapter disables Umami's automatic pageviews and sends them
after DOM readiness on ordinary pages and after Astro's post-swap page-load
lifecycle when ClientRouter is present, so client-navigation metadata is current.
Use Umami 3.2.0 or later; older trackers do not support the required
`data-auto-pageview` control.

## Next reading

- [Configuration reference](configuration.md)
- [Starlight integration](starlight.md)
- [Runtime and safety model](runtime-and-safety.md)
