/**
 * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder
 */
class UniversalActionResponseBuilder extends CardServiceBuilder<Components.UniversalActionResponse> {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder#displayaddoncardscardobjects
   *
   * @summary Displays the add-on with the specified cards.
   * @param cardObjects An array of {@link Card}s to display.
   */
  displayAddOnCards(cardObjects: Card[]) {
    this.item.cards = cardObjects;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder#setopenlinkopenlink
   *
   * @summary Sets the URL to open when the universal action is selected.
   * @param openLink The link object to use.
   */
  setOpenLink(openLink: Components.OpenLink) {
    this.item.openLink = openLink;
    return this;
  }

  protected validate(): boolean {
    const { openLink, cards } = this.item;
    return [cards.length, openLink].some(Boolean);
  }
}
