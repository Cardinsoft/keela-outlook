namespace Components {
  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft
   */
  export class GmailDraft {
    constructor(private item: microsoftgraph.Message) {}

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#deletedraft
     *
     * @summary Deletes this draft message.
     */
    async deleteDraft() {
      await MailboxAPI.deleteMessage(this.getId());
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#getid
     *
     * @summary Gets the ID of this draft message.
     */
    getId() {
      const { item } = this;
      return item.id!;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#getmessage
     *
     * @summary Returns a GmailMessage representing this draft.
     */
    getMessage() {
      return new Components.GmailMessage(this.item);
    }

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#getmessageid
     *
     * @summary Returns the ID of the {@link Components.GmailMessage} representing this draft.
     */
    getMessageId() {
      return this.getMessage().getId();
    }

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#send
     *
     * @summary Sends this draft email message.
     */
    async send() {
      const id = this.getId();
      await MailboxAPI.sendMessageById(id);
      this.item = await MailboxAPI.getMessage(id);
      return this.getMessage();
    }

    /**
     * @see https://developers.google.com/apps-script/reference/gmail/gmail-draft#updaterecipient,-subject,-body,-options
     *
     * @summary Replaces the contents of this draft message using optional arguments.
     * @param recipient comma separated list of email addresses
     * @param subject subject of the email (250 characters maximum)
     * @param body body of the email
     * @param options a JavaScript object that specifies advanced parameters
     */
    async update(
      recipient: string,
      subject: string,
      body: string,
      options: BaseMailOptions = {}
    ) {
      const { bcc, cc, htmlBody, from, name, replyTo } = options;

      const updates: microsoftgraph.Message = {
        body: { content: htmlBody || body, contentType: "html" },
        subject,
        toRecipients: MailboxAPI.mapAddressesToRecipients(recipient),
      };

      if (bcc) updates.bccRecipients = MailboxAPI.mapAddressesToRecipients(bcc);
      if (cc) updates.ccRecipients = MailboxAPI.mapAddressesToRecipients(cc);
      if (from || name) {
        updates.from = {
          emailAddress: {
            address: from || Office.context.mailbox.userProfile.emailAddress,
            name: name || Office.context.mailbox.userProfile.displayName,
          },
        };
      }
      if (replyTo) {
        updates.replyTo = MailboxAPI.mapAddressesToRecipients(replyTo);
      }

      this.item = await MailboxAPI.updateMessage(this.getId(), updates);
      return this;
    }
  }
}
