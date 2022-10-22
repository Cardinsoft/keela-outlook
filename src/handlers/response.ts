import { type Card } from "../lib/services/card/components/card";
import { type ActionResponse } from "../lib/services/card/components/responses/action_response";
import { type SuggestionsResponse } from "../lib/services/card/components/responses/suggestions_response";
import { type UniversalActionResponse } from "../lib/services/card/components/responses/universal_action_response";
import { handleOpenLinkAction } from "./open_link";

/**
 * @summary global card stack
 */
export const cardStack: Card[] = [];

/**
 * @summary handles an {@link ActionResponse}
 * @param response {@link ActionResponse} to handle
 */
export const handleActionResponse = async (response: ActionResponse) => {
  const { navigation, notification, openLink } = response;

  if (navigation) {
    await cardStack[cardStack.length - 1].render(
      document.getElementById("app-body")
    );
  }

  if (notification) {
    const parent = document.getElementById("app-notif") || document.body;
    await notification.render(parent);
  }

  if (openLink) {
    handleOpenLinkAction(openLink);
  }
};

/**
 * @summary handles a {@link SuggestionsResponse}
 * @param response {@link SuggestionsResponse} to handle
 * @param element triggering {@link Element}
 */
export const handleSuggestionsResponse = (
  response: SuggestionsResponse,
  element: Element
) => {
  element.dispatchEvent(
    new CustomEvent("suggestions", {
      detail: response.suggestions?.suggestions || [],
      bubbles: false,
    })
  );
};

/**
 * @summary handles a {@link UniversalActionResponse}
 * @param response {@link UniversalActionResponse} to handle
 */
export const handleUniversalActionResponse = async (
  response: UniversalActionResponse
) => {
  const { cards, openLink } = response;

  if (cards.length) {
    cardStack.length = 0;
    cardStack.push(...cards);
    await cardStack[cardStack.length - 1].render(
      document.getElementById("app-body")
    );
  }

  if (openLink) {
    handleOpenLinkAction(openLink);
  }
};
