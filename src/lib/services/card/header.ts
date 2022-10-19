namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-header
   */
  export class CardHeader extends CardServiceRenderableComponent {
    private imageAltText?: string;
    private imageStyle: ImageStyle = ImageStyle.SQUARE;
    private imageUrl?: string;
    private title?: string;

    private get imageElement() {
      return this.element.querySelector("img");
    }

    private get titleElement() {
      return document.getElementById("card-header-title");
    }

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
        imageElement.classList.add("headerIcon", `style-${imageStyle}`);
        wrapper.prepend(imageElement);
      }

      const titleElement = document.createElement("p");
      titleElement.classList.add("ms-font-m-plus");
      titleElement.id = "card-header-title";
      titleElement.textContent = title;
      wrapper.append(titleElement);

      return wrapper;
    }

    async render(parentId: string): Promise<HTMLElement> {
      const {
        imageElement,
        imageAltText = "",
        imageStyle,
        imageUrl = "",
        titleElement,
        title = "",
      } = this;

      if (!titleElement) {
        throw new Error("card header is missing the title element");
      }

      titleElement.textContent = title;

      if (imageElement) {
        imageElement.alt = imageAltText;
        imageElement.src = imageUrl;

        const newToken = `style-${imageStyle}`;

        imageElement.classList.forEach((token, _i, list) => {
          list.toggle(token, !token.startsWith("style-") || token === newToken);
        });
      }

      return super.render(parentId);
    }
  }
}
