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
        injectScript("page", `(()=>{const root=globalThis;const token=${JSON.stringify(RUNTIME_TOKEN)};const configuredNames=Object.freeze(${names});let started=false;let listener;try{const symbolValue=Reflect.get(root,"Symbol");const symbolFor=Reflect.get(symbolValue,"for");if(typeof symbolFor!=="function")return;const key=Reflect.apply(symbolFor,symbolValue,["codeworkslabs.astro-analytics:location-policy:v1"]);if(typeof key!=="symbol")return;let policy;const existing=Reflect.get(root,key);if(existing!==undefined){if((typeof existing!=="object"&&typeof existing!=="function")||existing===null)return;const keys=Reflect.ownKeys(existing);const existingNames=Reflect.get(existing,"blockedQueryParameters");if(keys.length!==3||!keys.includes("allowsCurrentLocation")||!keys.includes("blockedQueryParameters")||!keys.includes("runtimeToken")||Reflect.get(existing,"runtimeToken")!==token||typeof Reflect.get(existing,"allowsCurrentLocation")!=="function"||!Array.isArray(existingNames)||existingNames.length!==configuredNames.length||!existingNames.every((name,index)=>name===configuredNames[index]))return;policy=existing;}else{const allowsConfiguredLocation=()=>{try{const URLValue=Reflect.get(root,"URL");if(typeof URLValue!=="function")return false;const href=Reflect.get(Reflect.get(root,"location"),"href");const url=new URLValue(href);return !configuredNames.some((name)=>url.searchParams.has(name));}catch{return false;}};const candidate=Object.freeze({allowsCurrentLocation:allowsConfiguredLocation,blockedQueryParameters:configuredNames,runtimeToken:token});if(Reflect.defineProperty(root,key,{configurable:false,value:candidate,writable:false})!==true||Reflect.get(root,key)!==candidate)return;policy=candidate;}const allows=()=>{try{return Reflect.apply(Reflect.get(policy,"allowsCurrentLocation"),policy,[])===true;}catch{return false;}};const start=()=>{if(started||!allows())return;started=true;if(listener!==undefined){try{const documentValue=Reflect.get(root,"document");const remove=Reflect.get(documentValue,"removeEventListener");if(typeof remove==="function")Reflect.apply(remove,documentValue,["astro:page-load",listener]);}catch{}}${runtime}};if(allows()){start();return;}const documentValue=Reflect.get(root,"document");const add=Reflect.get(documentValue,"addEventListener");if(typeof add!=="function")return;listener=()=>{start();};Reflect.apply(add,documentValue,["astro:page-load",listener]);}catch{}})();`);
        injected = true;
      },
    },
  };
}
