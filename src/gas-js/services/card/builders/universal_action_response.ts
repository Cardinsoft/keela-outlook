import { type OpenLink } from "../actions/open_link";
import { type Card } from "../components/card";
import { UniversalActionResponse } from "../components/responses/universal_action_response";
import { CardServiceBuilder } from "./index";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder
 */
export class UniversalActionResponseBuilder extends CardServiceBuilder<UniversalActionResponse> {
  private cards: Card[] = [];
  private openLink?: OpenLink;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder#build
   *
   * @summary Builds the current universal action response and validates it.
   */
  build() {
    const response = new UniversalActionResponse({
      cards: this.cards,
      openLink: this.openLink,
    });

    super.build(response);

    return response;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder#displayaddoncardscardobjects
   *
   * @summary Displays the add-on with the specified cards.
   * @param cardObjects An array of {@link Card}s to display.
   */
  displayAddOnCards(cardObjects: Card[]) {
    this.cards = cardObjects;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder#setopenlinkopenlink
   *
   * @summary Sets the URL to open when the universal action is selected.
   * @param openLink The link object to use.
   */
  setOpenLink(openLink: OpenLink) {
    this.openLink = openLink;
    return this;
  }

  protected validate(): boolean {
    const { openLink, cards } = this;
    return [cards.length, openLink].some(Boolean);
  }
}
