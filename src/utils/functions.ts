import { type EventObject } from "../events";

/**
 * @summary looks up and call function in the global scope
 * @param name function name
 * @param event event object
 */
export const callFunctionFromGlobalScope = <T>(
  name: string,
  event: EventObject
): T => {
  const func = window[name];
  return typeof func === "function" ? func(event) : void 0;
};
