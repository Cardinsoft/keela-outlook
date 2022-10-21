namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/key-value
   * @deprecated
   */
  export class KeyValue extends Button {
    private bottomLabel?: string;
    private button?: Button;
    private content?: string;
    private icon?: Icon;
    private iconAltText?: string;
    private iconUrl?: string;
    private multiline: boolean = false;
    private switchToSet?: Switch;
    private topLabel?: string;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#setBottomLabel(String)
     *
     * @summary Sets the label text to be used as the key.
     * @param text The label text. Note: It doesn't support basic HTML formatting.
     * @deprecated
     */
    setBottomLabel(text: string) {
      this.bottomLabel = text;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#setbuttonbutton
     *
     * @summary Sets the {@link Button} that is displayed to the right of the context.
     * @param button The button to add.
     * @deprecated
     */
    setButton(button: Button) {
      this.button = button;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#setcontenttext
     *
     * @summary Sets the text to be used as the value. Supports basic HTML formatting. Required.
     * @param text The text content for this widget.
     * @deprecated
     */
    setContent(text: string) {
      this.content = text;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#seticonicon
     *
     * @summary Sets the icon to be used as the key.
     * @param icon One of the predefined {@link Icon} values.
     * @deprecated
     */
    setIcon(icon: Icon) {
      this.icon = icon;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#seticonalttextalttext
     *
     * @summary Sets the alternative text for the icon.
     * @param altText The alternative text for the icon.
     * @deprecated
     */
    setIconAltText(altText: string) {
      this.iconAltText = altText;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#seticonurlurl
     *
     * @summary Sets the URL of the icon to be used as the key.
     * @param url The URL address of a hosted image to use as an icon.
     * @deprecated
     */
    setIconUrl(url: string) {
      this.iconUrl = url;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#setmultilinemultiline
     *
     * @summary Sets whether the value text should be displayed on a single line or multiple lines.
     * @param multiline The multiline setting.
     * @deprecated
     */
    setMultiline(multiline: boolean) {
      this.multiline = multiline;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#setswitchswitchtoset
     *
     * @summary Sets the {@link Switch} that is displayed to the right of the content.
     * @param switchToSet The switch to add.
     * @deprecated
     */
    setSwitch(switchToSet: Switch) {
      this.switchToSet = switchToSet;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/key-value#settoplabeltext
     *
     * @summary Sets the label text to be used as the key.
     * @param text The label text. Note: It doesn't support basic HTML formatting.
     * @deprecated
     */
    setTopLabel(text: string) {
      this.topLabel = text;
      return this;
    }

    async create(): Promise<HTMLElement> {
      const {
        action,
        bottomLabel,
        button,
        content = "",
        icon,
        iconAltText,
        iconUrl,
        multiline,
        switchToSet,
        topLabel,
      } = this;

      const wrapper = document.createElement("div");
      wrapper.classList.add("KeyValue", "row");

      if (action) {
        wrapper.addEventListener("click", () => {
          ActionStore.set(wrapper, action);
          handleEvent(wrapper);
        });
      }

      const iconSource = iconUrl || icon;
      if (iconSource) {
        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("column-icon");
        wrapper.append(iconWrapper);

        const img = document.createElement("img");
        img.classList.add("KeyValueImage");
        img.src = iconSource;

        if (iconAltText) {
          img.alt = iconAltText;
        }

        iconWrapper.append(img);
      }

      const contentWrapper = document.createElement("div");
      contentWrapper.classList.add("column-text");
      wrapper.append(contentWrapper);

      if (topLabel) {
        const topLabelElement = document.createElement("label");
        topLabelElement.classList.add("ms-fontSize-s", "KeyValueTopLabel");
        topLabelElement.textContent = topLabel;
        contentWrapper.append(topLabelElement);
      }

      const contentText = document.createElement("span");
      contentText.classList.add("ms-font-m-plus", "KeyValueText");
      contentWrapper.append(contentText);

      parseHTMLWidgetContent(
        contentText,
        multiline ? content : content.replace(/\r?\n/g, " ")
      );

      if (bottomLabel) {
        const bottomLabelElement = document.createElement("label");
        bottomLabelElement.classList.add(
          "ms-fontSize-s",
          "KeyValueBottomLabel"
        );
        bottomLabelElement.textContent = bottomLabel;
        contentWrapper.append(bottomLabelElement);
      }

      const actionableWidget = button || switchToSet;
      if (actionableWidget) {
        const actionableWidgetWrapper = document.createElement("div");
        actionableWidgetWrapper.classList.add("column-label");
        wrapper.append(actionableWidgetWrapper);

        await actionableWidget.render(actionableWidgetWrapper);
      }

      return wrapper;
    }
  }
}
