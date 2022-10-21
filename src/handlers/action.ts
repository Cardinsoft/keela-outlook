/**
 * @summary handles registered event action, if any
 * @param event event object
 * @param element trigger element
 */
const handleAction = async (event: EventObject, element: Element) => {
  const guid = element.getAttribute("action");
  const action = guid ? ActionStore.get(guid) : void 0;
  if (!guid || !action) return;

  try {
    const actionHandlers: ActionHandlerRule[] = [
      [Action, getActionResponse],
      [DisplayCardsAction, getDisplayCardsResponse],
      [Components.OpenLink, getOpenLinkResponse],
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
      [Components.ActionResponse, handleActionResponse],
      [Components.SuggestionsResponse, handleSuggestionsResponse],
      [Components.UniversalActionResponse, handleUniversalActionResponse],
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
    await Utilities.sleep(500);
  }
};
