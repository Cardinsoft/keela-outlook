/**
 * @see https://developers.google.com/apps-script/reference/card-service/open-link
 */
class OpenLink {
  onClose: OnClose = OnClose.NOTHING;
  openAs: OpenAs = OpenAs.FULL_SIZE;
  url?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/open-link#setoncloseonclose
   *
   * @summary Sets the behavior of the URL action when the URL window or tab is closed.
   * @param onClose The closing setting.
   */
  setOnClose(onClose: OnClose) {
    this.onClose = onClose;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/open-link#setopenasopenas
   *
   * @summary Sets the behavior of URL when it is opened.
   * @param openAs The opening setting.
   */
  setOpenAs(openAs: OpenAs) {
    this.openAs = openAs;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/open-link#seturlurl
   *
   * @summary Sets the URL to be opened.
   * @param url The URL to open.
   */
  setUrl(url: string) {
    this.url = url;
    return this;
  }
}
