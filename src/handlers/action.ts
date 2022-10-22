import { type EventObject } from "../events.js";
import { getActionResponse } from "../getters/action.js";
import { getDisplayCardsResponse } from "../getters/display_cards.js";
import { getOpenLinkResponse } from "../getters/open_link.js";
import { Action } from "../lib/services/card/actions/action.js";
import { DisplayCardsAction } from "../lib/services/card/actions/display_cards.js";
import { OpenLink } from "../lib/services/card/actions/open_link.js";
import { ActionResponse } from "../lib/services/card/components/responses/action_response.js";
import { SuggestionsResponse } from "../lib/services/card/components/responses/suggestions_response.js";
import { UniversalActionResponse } from "../lib/services/card/components/responses/universal_action_response.js";
import { ActionStore, type ActionType } from "../lib/stores/actions.js";
import { log } from "../utils/log.js";
import { safeToString } from "../utils/strings.js";
import { handleActionResponse, handleSuggestionsResponse, handleUniversalActionResponse } from "./response.js";

export type ActionResponseType =
  | ActionResponse
  | SuggestionsResponse
  | UniversalActionResponse;

type ActionHandler<T extends ActionType> = (
  action: T,
  event: EventObject
) => Promise<ActionResponseType> | ActionResponseType;

type ActionResponseHandler<T extends ActionResponseType> = (
  response: T,
  element: Element
) => Promise<void> | void;

type ActionHandlerRule = {
  [T in ActionType as string]: [new () => T, ActionHandler<T>];
}[string];

type ActionResponseHandlerRule = {
  [T in ActionResponseType as string]: [
    new (config: any) => T,
    ActionResponseHandler<T>
  ];
}[string];

/**
 * @summary handles registered event action, if any
 * @param event event object
 * @param element trigger element
 */
export const handleAction = async (event: EventObject, element: Element) => {
  const guid = element.getAttribute("action");
  const action = guid ? ActionStore.get(guid) : void 0;
  if (!guid || !action) return;

  try {
    const actionHandlers: ActionHandlerRule[] = [
      [Action, getActionResponse],
      [DisplayCardsAction, getDisplayCardsResponse],
      [OpenLink, getOpenLinkResponse],
    ];

    const [, actionHandler] =
      actionHandlers.find(([constructor]) => action instanceof constructor) ||
      [];

    if (!actionHandler) {
      throw new Error("missing handler for action", { cause: action });
    }

    const actionResponse = await actionHandler(
      action as UnionToIntersection<ActionType>,
      event
    );

    const actionResponseHandlers: ActionResponseHandlerRule[] = [
      [ActionResponse, handleActionResponse],
      [SuggestionsResponse, handleSuggestionsResponse],
      [UniversalActionResponse, handleUniversalActionResponse],
    ];

    const [, actionResponseHandler] =
      actionResponseHandlers.find(
        ([constructor]) => actionResponse instanceof constructor
      ) || [];

    if (!actionResponseHandler) {
      throw new Error("missing action response handler", {
        cause: actionResponse,
      });
    }

    actionResponseHandler(
      actionResponse as UnionToIntersection<ActionResponseType>,
      element
    );
  } catch (error) {
    log("error", "action handler error", safeToString(error));
  } finally {
    ActionStore.remove(guid);
    await new Promise((r) => setTimeout(r, 500));
  }
};
