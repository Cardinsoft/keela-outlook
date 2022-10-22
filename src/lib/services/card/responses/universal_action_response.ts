namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response
   */
  export class UniversalActionResponse extends InspectableComponent {
    cards: Card[] = [];
    openLink?: OpenLink;
  }
}
