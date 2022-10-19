namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/notification
   */
  export class Notification extends CardServiceRenderableComponent {
    private text: string = "";

    /**
     * @summary gets the underlying text element
     */
    private get textElement() {
      const text = this.element.querySelector(".ms-MessageBar-text");
      if (!text) {
        throw new Error("notification is missing text element");
      }
      return text;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/notification#settexttext
     *
     * @summary Sets the text to show in the notification. Required.
     * @param text The notification text.
     */
    setText(text: string) {
      this.text = text;
      return this;
    }

    create(): HTMLElement {
      const { text } = this;

      const wrapper = document.createElement("div");
      wrapper.classList.add("ms-MessageBar");

      const content = document.createElement("div");
      content.classList.add("ms-MessageBar-content");
      wrapper.append(content);

      const icon = document.createElement("div");
      icon.classList.add("ms-MessageBar-icon");
      content.append(icon);

      const icontent = document.createElement("i");
      icontent.classList.add("ms-Icon", "ms-Icon--Info");
      icon.append(icontent);

      const txt = document.createElement("div");
      txt.classList.add("ms-MessageBar-text");
      txt.textContent = text;
      content.append(txt);

      return wrapper;
    }

    render(parentId: string): Promise<HTMLElement> {
      const { textElement, text } = this;

      textElement.textContent = text;

      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });

      return super.render(parentId);
    }
  }
}
