import { type DisplayCardsAction } from "../services/card/actions/display_cards";
import { UniversalActionResponseBuilder } from "../services/card/builders/universal_action_response";

/**
 * @summary gets {@link Components.UniversalActionResponse} for a {@link DisplayCardsAction}
 * @param action {@link DisplayCardsAction} to get the response for
 */
export const getDisplayCardsResponse = (action: DisplayCardsAction) => {
  const builder = new UniversalActionResponseBuilder();
  builder.displayAddOnCards(action.getCards());
  return builder.build();
};
