import { RenderableComponent } from "../../../../gas-js/components";
import { Icon, ImageCropType } from "../enums";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/icon-image
 */
export class IconImage extends RenderableComponent {
  private altText?: string;
  private icon: Icon = Icon.NONE;
  private url?: string;
  private imageCropType: ImageCropType = ImageCropType.SQUARE;

  setAltText(altText: string) {
    this.altText = altText;
    return this;
  }
  setIcon(icon: Icon) {
    this.icon = icon;
    return this;
  }
  setIconUrl(url: string) {
    this.url = url;
    return this;
  }
  setImageCropType(imageCropType: ImageCropType) {
    this.imageCropType = imageCropType;
    return this;
  }

  create(): HTMLElement | Promise<HTMLElement> {
    const { altText = "", icon, url, imageCropType } = this;

    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "card-iconimage",
      `crop-${imageCropType.toLowerCase()}`
    );

    const imageSource = icon || url;
    if (!imageSource) {
      throw new Error("IconImage must have either icon or icon URL set");
    }

    const isCardServiceIcon = icon in Icon;

    if (url || isCardServiceIcon) {
      const image = document.createElement("img");
      image.alt = altText;
      image.height = 20;
      image.src = isCardServiceIcon
        ? `${location.pathname.replace(
            /\/$/,
            ""
          )}/public/icons/${imageSource}.png`
        : imageSource;
      image.width = 20;
      wrapper.append(image);
      return wrapper;
    }

    const isFontAwesomeIcon = icon.startsWith("fa-");

    if (icon && isFontAwesomeIcon) {
      const image = document.createElement("i");
      image.classList.add("card-icon-image-icon", ...icon.split(" "));
      wrapper.append(image);
    }

    if (icon && !isFontAwesomeIcon) {
      const image = document.createElement("span");
      image.classList.add("card-icon-image-icon", "material-icons");
      image.textContent = icon;
      wrapper.append(image);
    }

    return wrapper;
  }
}
