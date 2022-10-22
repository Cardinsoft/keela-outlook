import { type OpenLink } from "../../actions/open_link.js";
import { InspectableComponent } from "../../index.js";
import { type Card } from "../card.js";

export type UniversalActionResponseConfig = {
  cards: Card[];
  openLink?: OpenLink;
};

/**
 * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response
 */
export class UniversalActionResponse extends InspectableComponent {
  constructor(private config: UniversalActionResponseConfig) {
    super();
  }

  get cards() {
    return this.config.cards;
  }

  get openLink() {
    return this.config.openLink;
  }
}
