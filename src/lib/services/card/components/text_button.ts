namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/text-button
   */
  export class TextButton extends Button {
    altText?: string;
    backgroundColor: string = "#0078d7";
    disabled: boolean = false;
    text?: string;
    textButtonStyle: TextButtonStyle = TextButtonStyle.TEXT;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/text-button#setalttextalttext
     *
     * @summary Sets the alternative text of the button for accessibility.
     * @param altText The alternative text to assign to this button.
     */
    setAltText(altText: string) {
      this.altText = altText;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/text-button#setbackgroundcolorbackgroundcolor
     *
     * @summary Sets the background color for {@link TextButtonStyle.FILLED} button.
     * @param backgroundColor The color in #rgb format.
     */
    setBackgroundColor(backgroundColor: string) {
      this.backgroundColor = backgroundColor;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/text-button#setdisableddisabled
     *
     * @summary Sets whether the button is disabled.
     * @param disabled The disabled state.
     */
    setDisabled(disabled: boolean) {
      this.disabled = disabled;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/text-button#settexttext
     *
     * @summary Sets the text that displays on the button.
     * @param text The text that appears on the button.
     */
    setText(text: string) {
      this.text = text;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/text-button#settextbuttonstyletextbuttonstyle
     *
     * @summary Sets the button style.
     * @param textButtonStyle The button style.
     */
    setTextButtonStyle(textButtonStyle: TextButtonStyle) {
      this.textButtonStyle = textButtonStyle;
      return this;
    }

    create(): HTMLElement {
      const {
        action,
        altText,
        backgroundColor,
        disabled,
        textButtonStyle,
        text = "",
      } = this;

      const wrapper = document.createElement("div");

      const button = document.createElement("div");
      button.classList.add("TextButton");
      button.classList.toggle("btn-disabled", disabled);
      button.ariaLabel = altText || text;

      const filled = textButtonStyle === TextButtonStyle.FILLED;
      if (filled) {
        button.style.backgroundColor = backgroundColor;
      }

      button.classList.add(filled ? "btn-filled" : "btn-text");

      parseHTMLWidgetContent(button, text);

      if (!action) {
        throw new Error(`TextButton must have at least one action set`);
      }

      ActionStore.set(button, action);

      button.addEventListener("click", () => handleEvent(button));

      wrapper.append(button);
      return wrapper;
    }

    render(parentId: string): Promise<HTMLElement> {
      return super.render(parentId);
    }
  }
}
