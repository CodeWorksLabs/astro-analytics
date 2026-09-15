export interface EventPropertyLimits {
  count: number;
  keyLength: number;
  stringLength: number;
}

export const EVENT_PROPERTY_LIMITS: Readonly<EventPropertyLimits> = Object.freeze({
  count: 100,
  keyLength: 128,
  stringLength: 1024,
});

export type ValidatedEventProperties = Record<string, string | number | boolean>;

export type EventPropertyValidation =
  | { ok: true; properties?: ValidatedEventProperties }
  | { ok: false };

/** Shared by the imported helper and the serialized browser client. */
export function validateEventProperties(
  value: unknown,
  limits: EventPropertyLimits,
): EventPropertyValidation {
  try {
    if (value === undefined) return { ok: true };
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false };
    }
    const prototype = Object.getPrototypeOf(value);
    const prototypeConstructor =
      prototype === null
        ? undefined
        : Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
    const isRealmObjectPrototype =
      prototype !== null &&
      Object.getPrototypeOf(prototype) === null &&
      Object.prototype.hasOwnProperty.call(prototype, "constructor") &&
      typeof prototypeConstructor === "function" &&
      prototypeConstructor.name === "Object" &&
      Function.prototype.toString.call(prototypeConstructor) ===
        Function.prototype.toString.call(Object);
    if (prototype !== null && !isRealmObjectPrototype) {
      return { ok: false };
    }
    const keys = Reflect.ownKeys(value);
    if (keys.length > limits.count) return { ok: false };
    const properties: ValidatedEventProperties = {};
    for (const key of keys) {
      if (typeof key !== "string" || !key || key.length > limits.keyLength) {
        return { ok: false };
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (
        !descriptor?.enumerable ||
        !Object.prototype.hasOwnProperty.call(descriptor, "value")
      ) {
        return { ok: false };
      }
      const property = descriptor.value as unknown;
      if (
        typeof property === "string"
          ? property.length > limits.stringLength
          : typeof property === "number"
            ? !Number.isFinite(property)
            : typeof property !== "boolean"
      ) {
        return { ok: false };
      }
      Object.defineProperty(properties, key, {
        configurable: true,
        enumerable: true,
        value: property,
        writable: true,
      });
    }
    return { ok: true, properties };
  } catch {
    return { ok: false };
  }
}
