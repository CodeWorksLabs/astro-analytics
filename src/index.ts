import type { AstroIntegration } from "astro";
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

const RUNTIME_TOKEN = "astro-analytics:runtime:v1";

export * from "#config";

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
            locationPolicyRequired: true,
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
              locationPolicyRequired: true,
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
              locationPolicyRequired: true,
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
              locationPolicyRequired: true,
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
              locationPolicyRequired: true,
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
              locationPolicyRequired: true,
              pageviews: provider.pageviews,
              runtimeToken: RUNTIME_TOKEN,
              scriptSrc: provider.scriptSrc,
              websiteId: provider.websiteId,
            }));
          }
        }
        if (runtimes.length === 0) return;
        const runtime = runtimes.join("\n");
        const names = JSON.stringify(config.blockedQueryParameters)
          .replaceAll("<", "\\u003c")
          .replaceAll(">", "\\u003e")
          .replaceAll("&", "\\u0026");
        injectScript("page", `(()=>{try{const root=globalThis;const token=${JSON.stringify(RUNTIME_TOKEN)};const configuredNames=Object.freeze(${names});const key=Symbol.for("codeworkslabs.astro-analytics:location-policy:v1");let policy=root[key];if(policy===undefined){let startupObserved=false;const allowsUrl=(value)=>{try{if(typeof value!=="string")return false;if(value==="")return true;const url=new URL(value,root.location.href);return !configuredNames.some((name)=>url.searchParams.has(name));}catch{return false;}};policy=Object.freeze({allowsCurrentLocation:()=>allowsUrl(root.location.href),allowsUrl,blockedQueryParameters:configuredNames,runtimeToken:token,setStartupPageLoadObserved:(value)=>startupObserved=value===true,startupPageLoadObserved:()=>startupObserved});Object.defineProperty(root,key,{value:policy});}else if(policy.runtimeToken!==token||JSON.stringify(policy.blockedQueryParameters)!==JSON.stringify(configuredNames)){return;}let started=false;let listener;const start=(fromPageLoad=false)=>{if(started||policy.allowsCurrentLocation()!==true)return;if(fromPageLoad)policy.setStartupPageLoadObserved(true);started=true;if(listener)root.document.removeEventListener("astro:page-load",listener);${runtime}if(fromPageLoad)policy.setStartupPageLoadObserved(false);};if(policy.allowsCurrentLocation())start();else{listener=()=>start(true);root.document.addEventListener("astro:page-load",listener);}}catch{}})();`);
        injected = true;
      },
    },
  };
}
