import { type EventObject } from "../events.js";
import { type Action } from "../lib/services/card/actions/action.js";
import { type ActionResponse } from "../lib/services/card/components/responses/action_response.js";
import { LoadIndicator } from "../lib/services/card/enums.js";
import { Overlay } from "../overlay.js";
import { Spinner } from "../spinner.js";
import { callFunctionFromGlobalScope } from "../utils/functions.js";
import { log } from "../utils/log.js";
import { safeToString } from "../utils/strings.js";

/**
 * @summary gets {@link ActionResponse} for an {@link Action}
 * @param action {@link Action} to get the response for
 * @param event Add-In event object
 */
export const getActionResponse = (action: Action, event: EventObject) => {
  const { indicator, name, parameters } = action;

  if (!name) {
    throw new Error(`action is missing the function name`, { cause: action });
  }

  Object.assign(event.parameters, parameters);

  const overlay = new Overlay("app-overlay", "app-body");
  overlay.show();

  const spinner = new Spinner("app-overlay");
  spinner.setSize("large");

  if (indicator !== LoadIndicator.NONE) {
    spinner.show();
  }

  try {
    return callFunctionFromGlobalScope<ActionResponse>(name, event);
  } catch (error) {
    log("error", "failed to handle action", safeToString(error));
    throw error;
  } finally {
    spinner.hide();
    overlay.hide();
  }
};
