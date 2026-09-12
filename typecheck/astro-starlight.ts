import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { AstroIntegration } from "astro";
import astroAnalytics from "../src/index.ts";
import {
  configuredProviders,
  providerStatuses,
  track,
  type ProviderRuntimeStatuses,
  type TrackResult,
} from "../src/events.ts";
import { starlightAnalytics } from "../src/starlight/index.ts";

const integration: AstroIntegration = astroAnalytics({
  providers: [{ name: "fathom", siteId: "TYPECHECK" }],
  events: true,
});

const plugin: StarlightPlugin = starlightAnalytics({ providers: false });
const providerNames = configuredProviders();
const statuses: ProviderRuntimeStatuses = providerStatuses();
const result: TrackResult = track("typecheck", { providerCount: providerNames.length });

void integration;
void plugin;
void statuses;
void result;
