import { type Action } from "../services/card/actions/action";
import { type ActionResponse } from "../services/card/components/responses/action_response";
import { LoadIndicator } from "../services/card/enums";
import { Overlay } from "../components/overlay";
import { Spinner } from "../components/spinner";
import { type EventObject } from "../events";
import { callFunctionFromGlobalScope } from "../utils/functions";
import { log } from "../utils/log";
import { safeToString } from "../utils/strings";

/**
 * @summary gets {@link ActionResponse} for an {@link Action}
 * @param action {@link Action} to get the response for
 * @param event Add-In event object
 */
export const getActionResponse = async (action: Action, event: EventObject) => {
  const { indicator, name, parameters } = action;

  if (!name) {
    throw new Error(`action is missing the function name`, { cause: action });
  }

  Object.assign(event.parameters, parameters);

  const overlayParent = document.getElementById("app-overlay");

  const overlay = new Overlay("app-body");
  await overlay.render(overlayParent);
  overlay.show();

  const spinner = new Spinner();
  spinner.setSize("large");
  await spinner.render(overlayParent);

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
