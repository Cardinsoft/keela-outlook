/**
 * @summary handles an {@link Components.ActionResponse}
 * @param response {@link Components.ActionResponse} to handle
 */
const handleActionResponse = async (response: Components.ActionResponse) => {
  const { navigation, notification, openLink } = response;

  if (navigation) {
    await cardStack[cardStack.length - 1].render();
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
 * @summary handles a {@link Components.SuggestionsResponse}
 * @param response {@link Components.SuggestionsResponse} to handle
 * @param element triggering {@link Element}
 */
const handleSuggestionsResponse = (
  response: Components.SuggestionsResponse,
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
 * @summary handles a {@link Components.UniversalActionResponse}
 * @param response {@link Components.UniversalActionResponse} to handle
 */
const handleUniversalActionResponse = async (
  response: Components.UniversalActionResponse
) => {
  const { cards, openLink } = response;

  if (cards.length) {
    cardStack.length = 0;
    cardStack.push(...cards);
    await cardStack[cardStack.length - 1].render();
  }

  if (openLink) {
    handleOpenLinkAction(openLink);
  }
};
