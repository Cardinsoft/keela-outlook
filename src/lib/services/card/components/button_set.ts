namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/button-set
   */
  export class ButtonSet extends CardServiceRenderableComponent {
    private buttons: Button[] = [];

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/button-set#addbuttonbutton
     *
     * @summary Adds a button.
     * @param button The button to add.
     */
    addButton(button: Button) {
      this.buttons.push(button);
      return this;
    }

    async create(): Promise<HTMLElement> {
      const { buttons } = this;

      const wrapper = document.createElement("div");
      wrapper.classList.add("row");

      for (const button of buttons) {
        const element = await button.render(wrapper);
        element.classList.add("SetElement");
        element.classList.remove("row");
      }

      return wrapper;
    }
  }
}
