namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation
   */
  export class Navigation extends InspectableComponent {
    constructor(private stack: Card[] = []) {
      super();
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/navigation#popcard
     *
     * @summary Pops a card from the navigation stack.
     */
    popCard() {
      this.stack.pop();
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptonamedcardcardname
     *
     * @summary Pops to the specified card by its card name.
     * @param cardName The name of the card to navigate to.
     */
    popToNamedCard(cardName: string) {
      const { stack } = this;

      for (let i = stack.length - 1; i >= 0; i--) {
        const card = stack[i];

        if (card.name === cardName) break;

        this.popCard();
      }

      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptoroot
     *
     * @summary Pops the card stack to the root card.
     */
    popToRoot() {
      const { stack } = this;

      const { length } = stack;
      for (let i = 1; i < length; i++) {
        this.popCard();
      }

      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/navigation#pushcardcard
     *
     * @summary Pushes the given card onto the stack.
     * @param card A card to add to the stack.
     */
    pushCard(card: Card) {
      this.stack.push(card);
      return this;
    }

    /**
     * @summary Does an in-place replacement of the current card.
     * @param card A card to replace the current card with.
     */
    updateCard(card: Card) {
      this.popCard();
      this.pushCard(card);
      return this;
    }
  }
}
