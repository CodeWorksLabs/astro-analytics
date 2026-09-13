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
  providers: [
    { name: "fathom", siteId: "TYPECHECK" },
    {
      name: "umami",
      websiteId: "e676c9b4-11e4-4ef1-a4d7-87001773e9f2",
      scriptSrc: "https://analytics.example.com/script.js",
    },
  ],
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
