import { InspectableComponent } from "../index";
import { type Card } from "./card";

export enum NavigationType {
  NAMED = "NAMED",
  POP = "POP",
  PUSH = "PUSH",
  ROOT = "ROOT",
}

export class NavigationAction {
  constructor(public type: NavigationType, public name?: string) {}
}

export class PushNavigationAction extends NavigationAction {
  constructor(public card: Card) {
    super(NavigationType.PUSH);
  }
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/navigation
 */
export class Navigation extends InspectableComponent {
  actions: Array<NavigationAction | PushNavigationAction> = [];

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#popcard
   *
   * @summary Pops a card from the navigation stack.
   */
  popCard() {
    this.actions.push(new NavigationAction(NavigationType.POP));
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptonamedcardcardname
   *
   * @summary Pops to the specified card by its card name.
   * @param cardName The name of the card to navigate to.
   */
  popToNamedCard(cardName: string) {
    this.actions.push(new NavigationAction(NavigationType.NAMED, cardName));
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#poptoroot
   *
   * @summary Pops the card stack to the root card.
   */
  popToRoot() {
    this.actions.push(new NavigationAction(NavigationType.ROOT));
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/navigation#pushcardcard
   *
   * @summary Pushes the given card onto the stack.
   * @param card A card to add to the stack.
   */
  pushCard(card: Card) {
    this.actions.push(new PushNavigationAction(card));
    return this;
  }

  /**
   * @summary Does an in-place replacement of the current card.
   * @param card A card to replace the current card with.
   */
  updateCard(card: Card) {
    this.actions.push(
      new NavigationAction(NavigationType.POP),
      new PushNavigationAction(card)
    );
    return this;
  }
}
