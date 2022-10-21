namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/divider
   */
  export class Divider extends CardServiceRenderableComponent {
    create(): HTMLElement {
      const element = document.createElement("hr");
      element.classList.add("card-divider");
      return element;
    }
  }
}
