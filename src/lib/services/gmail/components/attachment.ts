namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-attachment
   */
  export class GmailAttachment extends _Blob {
    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-attachment#getsize
     *
     * @summary Gets the size of this attachment.
     */
    getSize() {
      return this.getBytes().length;
    }
  }
}
