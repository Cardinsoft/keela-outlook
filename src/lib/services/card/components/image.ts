import { handleEvent } from "../../../../handlers/event.js";
import { ActionStore } from "../../../stores/actions.js";
import { Button } from "./button.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image
 */
export class Image extends Button {
  private altText?: string;
  private url?: string;

  /**
   * @param width default image width
   */
  constructor(private width: number) {
    super();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image#setalttextalttext
   *
   * @summary Sets the alternative text of the image for accessibility. Required.
   * @param altText The alternative text to assign to this image.
   */
  setAltText(altText: string) {
    this.altText = altText;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image#setimageurlurl
   *
   * @summary Sets the image to use by providing its URL or data string. Required.
   * @param url The URL address of a hosted image to use, or an encoded image string.
   */
  setImageUrl(url: string) {
    this.url = url;
    return this;
  }

  create(): HTMLElement {
    const { action, altText, url, width } = this;

    if (!altText) {
      throw new Error("Image must have an alt text set");
    }

    if (!url) {
      throw new Error("Image must have an image URL set");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("row", "Image");

    const image = document.createElement("img");
    image.alt = altText;
    image.src = url;
    image.width = width;

    if (action) {
      wrapper.addEventListener("click", () => {
        ActionStore.set(wrapper, action);
        handleEvent(wrapper);
      });
    }

    wrapper.append(image);
    return wrapper;
  }
}
