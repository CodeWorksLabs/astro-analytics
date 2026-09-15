# API reference

The package exposes three entry points. This reference inventories every current
runtime export and the main exported types so that changes can be evaluated as
public-contract changes.

## Core entry point

```ts
import analytics, {
  isEnabledForCommand,
  normalizeConfig,
  type AstroAnalyticsConfig,
  type NormalizedAstroAnalyticsConfig,
} from "@codeworkslabs/astro-analytics";
```

### `analytics(config)`

The default export validates `AstroAnalyticsConfig` immediately and returns an
Astro integration. During `astro:config:setup`, it injects the shared provider
coordinator and each implemented adapter runtime, subject to configuration and
command policy. Fathom, Plausible, Google Analytics 4, Matomo, and Umami each register an
independently observable runtime adapter.

### `normalizeConfig(value)`

```ts
function normalizeConfig(value: unknown): NormalizedAstroAnalyticsConfig;
```

Validates and copies the supported configuration. It throws `TypeError` for an
invalid shape or value. This low-level export is useful for tooling and tests;
most sites should call the default integration factory instead.

### `isEnabledForCommand(config, command)`

```ts
function isEnabledForCommand(
  config: NormalizedAstroAnalyticsConfig,
  command: "dev" | "build" | "preview" | "sync",
): boolean;
```

Evaluates the normalized config-setup policy. It does not inspect or change a
built artifact and is not a browser-runtime switch.

### Core types

The entry point exports the configuration types documented in the
[configuration reference](configuration.md):

- `AnalyticsCommand`
- `AnalyticsEnvironments`
- `AnalyticsProvider`
- `AstroAnalyticsConfig`
- `ConsentMode` and `ConsentState`
- `FathomProvider`, `GoogleAnalyticsProvider`, `MatomoProvider`, `PlausibleProvider`, and `UmamiProvider`
- `GoogleConsentConfig`
- `NormalizedAnalyticsProvider` and `NormalizedAstroAnalyticsConfig`
- `PageviewMode`

Provider runtime factories are internal; sites configure them through their
exported provider types.

## Client entry point

```ts
import {
  EVENT_NAME_MAX_LENGTH,
  EVENT_PROPERTY_COUNT_MAX,
  EVENT_PROPERTY_KEY_MAX_LENGTH,
  EVENT_PROPERTY_STRING_MAX_LENGTH,
  configuredProviders,
  providerStatuses,
  track,
  type AstroAnalyticsClient,
  type EventProperties,
  type ProviderName,
  type ProviderRuntimeStatus,
  type ProviderRuntimeStatuses,
  type ProviderTrackFailureReason,
  type ProviderTrackResult,
  type ProviderTrackResults,
  type TrackFailureReason,
  type TrackResult,
} from "@codeworkslabs/astro-analytics/client";
```

`track()`, `configuredProviders()`, `providerStatuses()`, and the result types are described in the
[event client guide](events.md).
The four constants are the numeric limits enforced by `track()` and may be used
by forms or adapter code to mirror the package boundary.

## Starlight entry point

```ts
import {
  starlightAnalytics,
} from "@codeworkslabs/astro-analytics/starlight";
```

`starlightAnalytics(config)` accepts the same `AstroAnalyticsConfig` and returns
a Starlight plugin. See [Starlight integration](starlight.md).
