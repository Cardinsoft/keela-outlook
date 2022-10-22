/**
 * @summary gets {@link Components.UniversalActionResponse} for a {@link DisplayCardsAction}
 * @param action {@link DisplayCardsAction} to get the response for
 */
const getDisplayCardsResponse = (action: DisplayCardsAction) => {
  const builder = new UniversalActionResponseBuilder(
    new Components.UniversalActionResponse()
  );
  builder.displayAddOnCards(action.getCards());
  return builder.build();
};
