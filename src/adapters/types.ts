import type {
  AnalyticsProvider,
  PageviewMode,
} from "../config.ts";

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  value?: number;
}

export interface AdapterRuntimePlan {
  provider: AnalyticsProvider["name"];
  pageviewOwner: PageviewMode;
  externalScripts: readonly {
    src: string;
    attributes: Readonly<Record<string, string | boolean>>;
  }[];
}

export interface AnalyticsAdapter<
  TProvider extends AnalyticsProvider = AnalyticsProvider,
> {
  readonly name: TProvider["name"];
  createRuntimePlan(provider: TProvider): AdapterRuntimePlan;
  serializeEvent(event: AnalyticsEvent): unknown;
}
