namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/grid-item
   */
  export class GridItem extends CardServiceRenderableComponent {
    private alignment: HorizontalAlignment = HorizontalAlignment.START;
    private id?: string;
    private image?: ImageComponent;
    private layout: GridItemLayout = GridItemLayout.TEXT_BELOW;
    private subtitle?: string;
    private title?: string;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#setidentifierid
     *
     * @summary Sets the identifier for the grid item.
     * @param id The ID.
     */
    setIdentifier(id: string) {
      this.id = id;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#setimageimage
     *
     * @summary Sets the image for this grid item.
     * @param image The {@link ImageComponent} object.
     */
    setImage(image: ImageComponent) {
      this.image = image;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#setlayoutlayout
     *
     * @summary Sets the layout of text and image for the grid item. Default is {@link GridItemLayout.TEXT_BELOW}
     * @param layout The layout setting.
     */
    setLayout(layout: GridItemLayout) {
      this.layout = layout;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#setsubtitlesubtitle
     *
     * @summary Sets the subtitle of the grid item.
     * @param subtitle The subtitle text.
     */
    setSubtitle(subtitle: string) {
      this.subtitle = subtitle;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#settextalignmentalignment
     *
     * @summary Sets the horizontal alignment of the grid item. Default is {@link HorizontalAlignment.START}.
     * @param alignment The alignment setting.
     */
    setTextAlignment(alignment: HorizontalAlignment) {
      this.alignment = alignment;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/grid-item#settitletitle
     *
     * @summary Sets the title text of the grid item.
     * @param title The title text.
     */
    setTitle(title: string) {
      this.title = title;
      return this;
    }

    create(): HTMLElement {
      const { alignment, layout, id, image, subtitle, title } = this;

      if (alignment || layout || id || image || subtitle || title) {
        // TODO: future releases
      }

      const wrapper = document.createElement("div");
      wrapper.classList.add("row", "card-grid--item");

      return wrapper;
    }
  }
}
