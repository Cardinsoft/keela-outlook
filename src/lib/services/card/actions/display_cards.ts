import { type Card } from "../components/card";

/**
 * @summary custom implementation to use in Add-In menus
 */
export class DisplayCardsAction {
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

    const parent = document.getElementById("app-body");

    for (const card of cards) {
      await card.render(parent);
    }

    return this;
  }
}
