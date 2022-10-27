import { Overlay } from "../components/overlay";
import { Spinner } from "../components/spinner";
import { type EventObject } from "../events";
import { type Action } from "../services/card/actions/action";
import { ActionResponseBuilder } from "../services/card/builders/action_response";
import { type Card } from "../services/card/components/card";
import { ActionResponse } from "../services/card/components/responses/action_response";
import { LoadIndicator } from "../services/card/enums";
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
  await overlay.show();

  const spinner = new Spinner();
  spinner.setSize("large");
  await spinner.render(overlayParent);

  if (indicator !== LoadIndicator.NONE) {
    await spinner.show();
  }

  try {
    const handlerResult = callFunctionFromGlobalScope<
      ActionResponse | Card | Card[]
    >(name, event);

    if (handlerResult instanceof Array) {
      const navigation = window.CardService.newNavigation();
      for (const card of handlerResult) {
        navigation.pushCard(card);
      }

      return new ActionResponseBuilder().setNavigation(navigation).build();
    }

    if (
      window.CardServiceConfig.isInstance<typeof Card>(handlerResult, "Card")
    ) {
      const navigation = window.CardService.newNavigation();

      return new ActionResponseBuilder()
        .setNavigation(navigation.pushCard(handlerResult))
        .build();
    }

    return handlerResult;
  } catch (error) {
    log("error", "failed to handle action", safeToString(error));
    throw error;
  } finally {
    await spinner.hide();
    await overlay.hide();
  }
};
