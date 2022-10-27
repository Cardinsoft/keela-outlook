import { type EventObject } from "../events";
import { getActionResponse } from "../getters/action";
import { getDisplayCardsResponse } from "../getters/display_cards";
import { getOpenLinkResponse } from "../getters/open_link";
import { Action } from "../services/card/actions/action";
import { DisplayCardsAction } from "../services/card/actions/display_cards";
import { OpenLink } from "../services/card/actions/open_link";
import { ActionResponse } from "../services/card/components/responses/action_response";
import { SuggestionsResponse } from "../services/card/components/responses/suggestions_response";
import { UniversalActionResponse } from "../services/card/components/responses/universal_action_response";
import { ActionStore, type ActionType } from "../stores/actions";
import { RuleStore } from "../stores/rules";
import { log } from "../utils/log";
import { safeToString } from "../utils/strings";
import {
  handleActionResponse,
  handleSuggestionsResponse,
  handleUniversalActionResponse,
} from "./response";

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

  console.debug(guid, event, action);

  try {
    const actionHandlerStore = new RuleStore<ActionHandlerRule>([
      [Action, getActionResponse],
      [DisplayCardsAction, getDisplayCardsResponse],
      [OpenLink, getOpenLinkResponse],
    ]);

    const [, actionHandler] = actionHandlerStore.find(
      ([cls]) =>
        action instanceof cls ||
        window.CardServiceConfig.isInstance(action, cls.name)
    );

    if (!actionHandler) {
      throw new Error("missing handler for action", { cause: action });
    }

    const actionResponse = await actionHandler(
      action as UnionToIntersection<ActionType>,
      event
    );

    if (actionResponse) {
      const actionResponseHandlerStore =
        new RuleStore<ActionResponseHandlerRule>([
          [ActionResponse, handleActionResponse],
          [SuggestionsResponse, handleSuggestionsResponse],
          [UniversalActionResponse, handleUniversalActionResponse],
        ]);

      const [, actionResponseHandler] = actionResponseHandlerStore.find(
        ([c]) =>
          actionResponse instanceof c ||
          window.CardServiceConfig.isInstance(actionResponse, c.name)
      );

      if (!actionResponseHandler) {
        throw new Error("missing action response handler", {
          cause: actionResponse,
        });
      }

      await actionResponseHandler(
        actionResponse as UnionToIntersection<ActionResponseType>,
        element
      );
    }
  } catch (error) {
    log("error", "action handler error", safeToString(error));
  } finally {
    ActionStore.remove(guid);
    await new Promise((r) => setTimeout(r, 500));
  }
};
