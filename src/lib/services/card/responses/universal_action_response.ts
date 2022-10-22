namespace Components {
  type UniversalActionResponseConfig = {
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
}
