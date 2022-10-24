export type MessageFormParameters = {
  attachments: Array<{
    isInline: boolean;
    itemId: string;
    name: string;
    type: Office.MailboxEnums.AttachmentType;
    url: string;
  }>;
  bccRecipients: Array<string | Office.EmailAddressDetails>;
  ccRecipients: Array<string | Office.EmailAddressDetails>;
  htmlBody: string;
  subject: string;
  toRecipients: Array<string | Office.EmailAddressDetails>;
};

/**
 * @summary intercepts mailto link clicks to display new message form
 * @param target target link
 * @param to recipient email address
 */
export const addMailtoListener = (target: EventTarget, to: string) => {
  target.addEventListener("click", (event) => {
    event.preventDefault();

    const params: Partial<MessageFormParameters> = {
      toRecipients: [to],
    };

    Office.context.mailbox.displayNewMessageForm(params);
    return false;
  });
};
