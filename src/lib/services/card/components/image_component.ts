import { RenderableComponent } from "../../../../component";
import { BorderStyle } from "./border_style";
import { ImageCropStyle } from "./image_crop_style";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image-component
 */
export class ImageComponent extends RenderableComponent {
  private altText?: string;
  private borderStyle: BorderStyle = new BorderStyle();
  private imageCropStyle: ImageCropStyle = new ImageCropStyle();
  private url?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-component#setalttextalttext
   *
   * @summary Sets the alternative text of the image.
   * @param altText The alt_text to set for the image.
   */
  setAltText(altText: string) {
    this.altText = altText;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-component#setborderstyleborderstyle
   *
   * @summary Sets the border style applied to the image.
   * @param borderStyle The {@link BorderStyle} object to apply.
   */
  setBorderStyle(borderStyle: BorderStyle) {
    this.borderStyle = borderStyle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-component#setcropstyleimagecropstyle
   *
   * @summary Sets the crop style for the image.
   * @param imageCropStyle The {@link ImageCropStyle} object to apply.
   */
  setCropStyle(imageCropStyle: ImageCropStyle) {
    this.imageCropStyle = imageCropStyle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image-component#setimageurlurl
   *
   * @summary Sets the URL of the image.
   * @param url The URL.
   */
  setImageUrl(url: string) {
    this.url = url;
    return this;
  }

  create(): HTMLElement {
    const { altText = "", borderStyle, imageCropStyle, url = "" } = this;

    if (borderStyle || imageCropStyle) {
      // TODO: future releases
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("row");

    const image = document.createElement("img");
    image.alt = altText;
    image.src = url;
    wrapper.append(image);

    return wrapper;
  }
}
