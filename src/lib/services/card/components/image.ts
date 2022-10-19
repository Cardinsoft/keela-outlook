namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/image
   */
  export class Image extends Button {
    altText?: string;
    url?: string;

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
      const { action, altText, url } = this;

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
      image.width = 268;

      if (action) {
        ActionStore.set(wrapper, action);
        wrapper.addEventListener("click", () => handleEvent(wrapper));
      }

      wrapper.append(image);
      return wrapper;
    }

    render(parentId: string): Promise<HTMLElement> {
      return super.render(parentId);
    }
  }
}
