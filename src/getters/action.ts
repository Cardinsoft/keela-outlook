/**
 * @summary gets {@link Components.ActionResponse} for an {@link Action}
 * @param action {@link Action} to get the response for
 * @param event Add-In event object
 */
const getActionResponse = (action: Action, event: EventObject) => {
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
    return callFunctionFromGlobalScope<Components.ActionResponse>(name, event);
  } catch (error) {
    log("error", "failed to handle action", safeToString(error));
    throw error;
  } finally {
    spinner.hide();
    overlay.hide();
  }
};
