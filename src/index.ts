import type { AstroIntegration } from "astro";
import { randomUUID } from "node:crypto";
import {
  isEnabledForCommand,
  normalizeConfig,
  type AstroAnalyticsConfig,
} from "#config";
import {
  createBootstrapScript,
  createFathomBootstrapScript,
  createGoogleAnalyticsBootstrapScript,
  createMatomoBootstrapScript,
  createPlausibleBootstrapScript,
  createUmamiBootstrapScript,
} from "#runtime";

const RUNTIME_TOKEN = randomUUID();

export * from "#config";
export type * from "#adapter-types";

export default function astroAnalytics(
  input: AstroAnalyticsConfig,
): AstroIntegration {
  const config = normalizeConfig(input);
  let injected = false;

  return {
    name: "@codeworkslabs/astro-analytics",
    hooks: {
      "astro:config:setup"({ command, injectScript }) {
        if (injected || !isEnabledForCommand(config, command)) return;
        if (config.providers === false) return;
        const runtimes: string[] = [];
        if (config.events) {
          runtimes.push(createBootstrapScript({
            events: true,
            providers: config.providers.map((provider) => provider.name),
            runtimeToken: RUNTIME_TOKEN,
          }));
        }
        for (const provider of config.providers) {
          if (provider.name === "fathom") {
            runtimes.push(createFathomBootstrapScript({
              canonical: provider.canonical,
              consentMode: provider.consent?.mode,
              events: config.events,
              honorDnt: provider.honorDnt,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc ?? "https://cdn.usefathom.com/script.js",
              siteId: provider.siteId,
            }));
          } else if (provider.name === "plausible") {
            runtimes.push(createPlausibleBootstrapScript({
              captureOnLocalhost: provider.captureOnLocalhost,
              consentMode: provider.consent?.mode,
              endpoint: provider.endpoint,
              events: config.events,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc,
            }));
          } else if (provider.name === "google-analytics") {
            runtimes.push(createGoogleAnalyticsBootstrapScript({
              config: provider.config,
              consentInitial: provider.consent.initial,
              consentMode: provider.consent.mode,
              events: config.events,
              measurementId: provider.measurementId,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc ??
                `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(provider.measurementId)}`,
            }));
          } else if (provider.name === "matomo") {
            runtimes.push(createMatomoBootstrapScript({
              consentMode: provider.consent?.mode,
              eventCategory: provider.eventCategory,
              events: config.events,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc ?? new URL("matomo.js", provider.trackerUrl).href,
              siteId: provider.siteId,
              trackerUrl: provider.trackerUrl,
            }));
          } else if (provider.name === "umami") {
            runtimes.push(createUmamiBootstrapScript({
              consentMode: provider.consent?.mode,
              events: config.events,
              hostUrl: provider.hostUrl,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc,
              websiteId: provider.websiteId,
            }));
          }
        }
        if (runtimes.length === 0) return;
        injectScript("page", runtimes.join("\n"));
        injected = true;
      },
    },
  };
}
