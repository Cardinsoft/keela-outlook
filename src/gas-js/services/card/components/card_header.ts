import { RenderableComponent } from "../../../../gas-js/components";
import { ImageStyle } from "../enums";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-header
 */
export class CardHeader extends RenderableComponent {
  private imageAltText?: string;
  private imageStyle: ImageStyle = ImageStyle.SQUARE;
  private imageUrl?: string;
  private subtitle?: string;
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

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header#setimageurlimageurl
   *
   * @summary Sets the image to use in the header by providing its URL or data string.
   * @param imageUrl The URL address of a hosted image to use, or an encoded image string.
   */
  setImageUrl(imageUrl: string) {
    this.imageUrl = imageUrl;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header#setsubtitlesubtitle
   *
   * @summary Sets the subtitle of the card header. Optional.
   * @param subtitle The header subtitle text.
   */
  setSubtitle(subtitle?: string) {
    this.subtitle = subtitle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header#settitletitle
   *
   * @summary Sets the title of the card header. Required.
   * @param title The header text.
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  create(): HTMLElement {
    const { imageUrl, title, imageAltText, imageStyle, subtitle } = this;

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

    if (subtitle) {
      const subtitleElement = document.createElement("span");
      subtitleElement.classList.add("card-header-subtitle", "ms-fontSize-14");
      subtitleElement.textContent = subtitle;
      wrapper.append(subtitleElement);
    }

    return wrapper;
  }
}
