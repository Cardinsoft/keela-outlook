/**
 * @summary custom implementation to use in Add-In menus
 */
class DisplayCardsAction {
  /**
   * @summary list of {@link Card}s to display
   */
  private cards: Card[] = [];

  /**
   * @summary gets {@link Card}s of this action
   */
  getCards() {
    return [...this.cards];
  }

  /**
   * @summary sets {@link Card}s to this action
   * @param cards {@link Card}s to set
   */
  setCards(cards: Card[]) {
    this.cards = [...cards];
    return this;
  }

  /**
   * @summary renders set {@link Card}s
   */
  async displayCards() {
    const cards = this.getCards();

    for (const card of cards) {
      await card.render();
    }

    return this;
  }
}
