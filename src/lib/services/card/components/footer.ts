namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer
   */
  export class FixedFooter extends CardServiceRenderableComponent {
    primary?: Components.TextButton;
    secondary?: Components.TextButton;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer#setprimarybuttonbutton
     *
     * @summary Set the primary button in the fixed footer.
     * @param button The button to add.
     */
    setPrimaryButton(button: Components.TextButton) {
      if (button.textButtonStyle !== TextButtonStyle.FILLED) {
        throw new Error(
          "The primary button must be a TextButtonStyle.FILLED button"
        );
      }
      this.primary = button;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/fixed-footer#setsecondarybuttonbutton
     *
     * @summary Set the secondary button in the fixed footer.
     * @param button The button to add.
     */
    setSecondaryButton(button: Components.TextButton) {
      if (!this.primary) {
        return this;
      }

      if (button.textButtonStyle !== TextButtonStyle.TEXT) {
        throw new Error(
          "The secondary button must be a TextButtonStyle.TEXT button"
        );
      }

      this.secondary = button;
      return this;
    }

    create(): HTMLElement {
      const wrapper = document.createElement("div");
      // TODO: future releases
      return wrapper;
    }
  }
}
