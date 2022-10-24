/**
 * @see https://developers.google.com/apps-script/reference/card-service/attachment
 */
export class Attachment {
  iconUrl?: string;
  mimeType?: string;
  resourceUrl?: string;
  title?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/attachment#seticonurliconurl
   *
   * @summary Sets the icon URL for the attachment.
   * @param iconUrl The URL address of the attachment icon.
   */
  setIconUrl(iconUrl: string) {
    this.iconUrl = iconUrl;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/attachment#setmimetypemimetype
   *
   * @summary Sets the MIME type for the attachment.
   * @param mimeType The MIME type of the content in the attachment resource.
   */
  setMimeType(mimeType: string) {
    this.mimeType = mimeType;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/attachment#setresourceurlresourceurl
   *
   * @summary Sets the resource URL for the attachment.
   * @param resourceUrl The URL address of a resource.
   */
  setResourceUrl(resourceUrl: string) {
    this.resourceUrl = resourceUrl;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/attachment#settitletitle
   *
   * @summary Sets the title for the attachment.
   * @param title The title of the attachment.
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }
}
