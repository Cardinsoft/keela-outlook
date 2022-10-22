import { type DisplayCardsAction } from "../lib/services/card/actions/display_cards.js";
import { UniversalActionResponseBuilder } from "../lib/services/card/builders/universal_action_response.js";

/**
 * @summary gets {@link Components.UniversalActionResponse} for a {@link DisplayCardsAction}
 * @param action {@link DisplayCardsAction} to get the response for
 */
export const getDisplayCardsResponse = (action: DisplayCardsAction) => {
  const builder = new UniversalActionResponseBuilder();
  builder.displayAddOnCards(action.getCards());
  return builder.build();
};
