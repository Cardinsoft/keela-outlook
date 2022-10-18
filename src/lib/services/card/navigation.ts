/**
 * @see https://developers.google.com/apps-script/reference/card-service/navigation
 */
class Navigation extends CardServiceComponent {
  private static stack: Card[] = [];

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#popcard
   *
   * @summary Pops a card from the navigation stack.
   */
  popCard() {
    Navigation.stack.pop();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptonamedcardcardname
   *
   * @summary Pops to the specified card by its card name.
   * @param cardName The name of the card to navigate to.
   */
  popToNamedCard(cardName: string) {
    const { stack } = Navigation;

    for (let i = stack.length - 1; i >= 0; i--) {
      const card = stack[i];

      if (card.name === cardName) break;

      stack.pop();
    }

    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptoroot
   *
   * @summary Pops the card stack to the root card.
   */
  popToRoot() {
    const { stack } = Navigation;

    const { length } = stack;
    for (let i = 1; i < length; i++) {
      stack.pop();
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
    Navigation.stack.push(card);
    return this;
  }

  /**
   * @summary Does an in-place replacement of the current card.
   * @param card A card to replace the current card with.
   */
  updateCard(card: Card) {
    Navigation.stack.splice(-1, 1, card);
    return this;
  }
}

// Navigation.prototype.popToNamedCard = function (cardName) {
//   //future releases;
// };
