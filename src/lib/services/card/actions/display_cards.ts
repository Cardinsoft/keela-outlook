/**
 * @summary custom implementation to use in Add-In menus
 */
class DisplayCardsAction {
  /**
   * @summary list of {@link Components.Card}s to display
   */
  private cards: Components.Card[] = [];

  /**
   * @summary gets {@link Components.Card}s of this action
   */
  getCards() {
    return [...this.cards];
  }

  /**
   * @summary sets {@link Components.Card}s to this action
   * @param cards {@link Components.Card}s to set
   */
  setCards(cards: Components.Card[]) {
    this.cards = [...cards];
    return this;
  }

  /**
   * @summary renders set {@link Components.Card}s
   */
  async displayCards() {
    const cards = this.getCards();

    const parent = document.getElementById("app-body");

    for (const card of cards) {
      await card.render(parent);
    }

    return this;
  }
}
