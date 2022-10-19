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

    setAltText(altText: string) {
      this.altText = altText;
      return this;
    }

    setBackgroundColor(backgroundColor: string) {
      this.backgroundColor = backgroundColor;
      return this;
    }

    setDisabled(disabled: boolean) {
      this.disabled = disabled;
      return this;
    }

    setText(text: string) {
      this.text = text;
      return this;
    }

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
