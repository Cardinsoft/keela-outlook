import { handleEvent } from "../../../../handlers/event.js";
import { ActionStore } from "../../../stores/actions.js";
import { Icon } from "../enums.js";
import { Button } from "./button.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image-button
 */
export class ImageButton extends Button {
  private altText?: string;
  private icon?: Icon;
  private url?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-button#setalttextalttext
   *
   * @summary Sets the alternative text of the button for accessibility. Required.
   * @param altText The alternative text to assign to this button.
   */
  setAltText(altText: string) {
    this.altText = altText;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-button#seticonicon
   *
   * @summary Sets a predefined {@link Icon} to display on the button.
   * @param icon One of the predefined {@link Icon} values.
   */
  setIcon(icon: Icon) {
    this.icon = icon;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-button#seticonurlurl
   *
   * @summary Sets the URL of an image to use as this button's icon.
   * @param url The URL address of a hosted image to use as this button's icon.
   */
  setIconUrl(url: string) {
    this.url = url;
    return this;
  }

  create(): HTMLElement {
    const { action, altText, icon, url } = this;

    if (!action) {
      throw new Error(`ImageButton must have at least one action set`);
    }

    if (!altText) {
      throw new Error("ImageButton must have an alt text set");
    }

    if (!icon && !url) {
      throw new Error("ImageButton must have either icon or icon URL set");
    }

    const widget = document.createElement("div");

    const image = document.createElement("img");
    image.classList.add("ImageButton");
    image.alt = altText;
    image.src = url || `${location.origin}/public/${icon}.png`;
    image.title = altText;

    image.addEventListener("click", () => {
      ActionStore.set(image, action);
      handleEvent(image);
    });

    widget.append(image);
    return widget;
  }
}
