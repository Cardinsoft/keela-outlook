import { handleEvent } from "../../../../handlers/event.js";
import { parseHTMLWidgetContent } from "../../../../utils/html.js";
import { ActionStore } from "../../../stores/actions.js";
import { Button } from "./button.js";
import { type IconImage } from "./icon_image.js";
import { type Switch } from "./switch.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/decorated-text
 */
export class DecoratedText extends Button {
  private bottomLabel?: string;
  private button?: Button;
  private endIcon?: IconImage;
  private startIcon?: IconImage;
  private switchControl?: Switch;
  private text?: string;
  private topLabel?: string;
  private wrapText: boolean = false;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setbottomlabeltext
   *
   * @summary Sets the label text to be used as the key and is displayed below the text content.
   * @param text The label text.
   */
  setBottomLabel(text: string) {
    this.text = text;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setbuttonbutton
   *
   * @summary Sets the {@link Button} that is displayed to the right of the text.
   * @param button The button to add.
   */
  setButton(button: Button) {
    this.button = button;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setendiconendicon
   *
   * @summary Sets the optional {@link IconImage} that is displayed to the right of the content.
   * @param endIcon The icon to add.
   */
  setEndIcon(endIcon: IconImage) {
    this.endIcon = endIcon;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setstarticonstarticon
   *
   * @summary Sets the optional {@link IconImage} to display before the text content.
   * @param startIcon The icon to display.
   */
  setStartIcon(startIcon: IconImage) {
    this.startIcon = startIcon;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setswitchcontrolswitchtoset
   *
   * @summary Sets the {@link Switch} that is displayed to the right of the content.
   * @param switchToSet The switch to add.
   */
  setSwitchControl(switchToSet: Switch) {
    this.switchControl = switchToSet;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#settexttext
   *
   * @summary Sets the text to be used as the value. Supports basic HTML formatting. Required.
   * @param text The text content for this widget.
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#settoplabeltext
   *
   * @summary Sets the label text to be used as the key and is displayed above the text content.
   * @param text The label text.
   */
  setTopLabel(text: string) {
    this.topLabel = text;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/decorated-text#setwraptextwraptext
   *
   * @summary Sets whether the value text should be displayed on a single line or multiple lines.
   * @param wrapText If true, the text is wrapped and displayed on multiple lines.
   */
  setWrapText(wrapText: boolean) {
    this.wrapText = wrapText;
    return this;
  }

  async create(): Promise<HTMLElement> {
    const {
      action,
      bottomLabel,
      button,
      endIcon,
      startIcon,
      switchControl,
      text,
      topLabel,
      wrapText,
    } = this;

    if (!text) {
      throw new Error("DecoratedText must have text set");
    }

    const decorations = [button, startIcon, endIcon, switchControl];

    if (decorations.length > 1) {
      throw new Error(
        "A DecoratedText can only support one button, one switch or one icon."
      );
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("KeyValue", "row", "ms-Grid");

    const row = document.createElement("div");
    row.classList.add("ms-Grid-row");
    wrapper.append(row);

    if (action) {
      wrapper.addEventListener("click", () => {
        ActionStore.set(wrapper, action);
        handleEvent(wrapper);
      });
    }

    if (startIcon) {
      const icon = await startIcon.render(row);
      icon.classList.add("ms-Grid-col", "ms-sm2", "ms-md2", "ms-lg2");
    }

    const clsSuff = decorations.some(Boolean) ? 10 : 12;

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add(
      "column-text",
      "ms-Grid-col",
      `ms-sm${clsSuff}`,
      `ms-md${clsSuff}`,
      `ms-lg${clsSuff}`
    );
    row.append(contentWrapper);

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
      wrapText ? text : text.replace(/\r?\n/g, " ")
    );

    if (bottomLabel) {
      const bottomLabelElement = document.createElement("label");
      bottomLabelElement.classList.add("ms-fontSize-s", "KeyValueBottomLabel");
      bottomLabelElement.textContent = bottomLabel;
      contentWrapper.append(bottomLabelElement);
    }

    if (endIcon) {
      const icon = await endIcon.render(row);
      icon.classList.add("ms-Grid-col", "ms-sm2", "ms-md2", "ms-lg2");
    }

    if (button) {
      const control = await button.render(row);
      control.classList.add("ms-Grid-col", "ms-sm2", "ms-md2", "ms-lg2");
    }

    if (switchControl) {
      const control = await switchControl.render(row);
      control.classList.add("ms-Grid-col", "ms-sm2", "ms-md2", "ms-lg2");
    }

    return wrapper;
  }
}
