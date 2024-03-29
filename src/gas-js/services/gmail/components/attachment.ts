import { Blob } from "../../base/blob";

/**
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-attachment
 */
export class GmailAttachment extends Blob {
  constructor(private item: microsoftgraph.Attachment) {
    super();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getsize
   *
   * @summary Gets the size of this attachment.
   */
  getSize() {
    return this.item.size!;
  }
}
