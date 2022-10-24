import { RenderableComponent } from "../../../../gas-js/components";
import { ImageStyle } from "../enums";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-header
 */
export class CardHeader extends RenderableComponent {
  private imageAltText?: string;
  private imageStyle: ImageStyle = ImageStyle.SQUARE;
  private imageUrl?: string;
  private title?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header#setimagealttextimagealttext
   *
   * @summary Sets the alternative text for the header image.
   * @param imageAltText The alternative text for the header image.
   */
  setImageAltText(imageAltText: string) {
    this.imageAltText = imageAltText;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header#setimagestyleimagestyle
   *
   * @summary Sets the cropping of the icon in the card header. Defaults to no crop. Optional.
   * @param imageStyle The style setting.
   */
  setImageStyle(imageStyle: ImageStyle) {
    this.imageStyle = imageStyle;
    return this;
  }

  create(): HTMLElement {
    const { imageUrl, title, imageAltText, imageStyle } = this;

    if (!title) {
      throw new Error("card header must have a title");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("CardHeader", "separated-both");

    if (imageUrl) {
      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      imageElement.alt = imageAltText || "";
      imageElement.classList.add(
        "headerIcon",
        `style-${imageStyle.toLowerCase()}`
      );
      wrapper.append(imageElement);
    }

    const titleElement = document.createElement("p");
    titleElement.classList.add("ms-font-m-plus");
    titleElement.id = "card-header-title";
    titleElement.textContent = title;
    wrapper.append(titleElement);
    return wrapper;
  }
}
