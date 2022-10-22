import { type EventObject } from "../events";
import { type Action } from "../lib/services/card/actions/action";
import { type ActionResponse } from "../lib/services/card/components/responses/action_response";
import { LoadIndicator } from "../lib/services/card/enums";
import { Overlay } from "../overlay";
import { Spinner } from "../spinner";
import { callFunctionFromGlobalScope } from "../utils/functions";
import { log } from "../utils/log";
import { safeToString } from "../utils/strings";

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
