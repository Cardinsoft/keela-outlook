import { MailboxAPI } from "../graph.js";
import {
  type AdvancedReplyOptions,
  type AdvancedSendOptions,
  type BaseMailOptions,
} from "../service.js";
import { GmailAttachment } from "./attachment.js";
import { GmailDraft } from "./draft.js";
import { GmailThread } from "./thread.js";

export type GetAttachmentsAdvancedParameters = {
  includeAttachments?: boolean;
  includeInlineImages?: boolean;
};

/**
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-message
 */
export class GmailMessage {
  constructor(private item: microsoftgraph.Message) {}

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#createdraftreplybody,-options
   *
   * @summary Creates a draft message replying to the sender of this message using the reply-to address, with optional arguments.
   * @param body The body of the email.
   * @param options A JavaScript object that specifies advanced parameters
   */
  async createDraftReply(body: string, options: BaseMailOptions = {}) {
    const { id } = await MailboxAPI.createReply(this.getId());

    const {
      bcc = "",
      cc = "",
      from = Office.context.mailbox.userProfile.emailAddress,
      name = Office.context.mailbox.userProfile.displayName,
      htmlBody,
      replyTo = Office.context.mailbox.userProfile.emailAddress,
    } = options;

    const item = await MailboxAPI.updateMessage(id!, {
      bccRecipients: MailboxAPI.mapAddressesToRecipients(bcc),
      body: { content: htmlBody || body, contentType: "html" },
      ccRecipients: MailboxAPI.mapAddressesToRecipients(cc),
      from: { emailAddress: { address: from, name } },
      replyTo: MailboxAPI.mapAddressesToRecipients(replyTo),
    });

    return new GmailDraft(item);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#createdraftreplyallbody,-options
   *
   * @summary Creates a draft message replying to the sender of this message using the reply-to address and all recipients, with optional arguments.
   * @param body The body of the email.
   * @param options A JavaScript object that specifies advanced parameters
   */
  async createDraftReplyAll(body: string, options: BaseMailOptions) {
    const { id } = await MailboxAPI.createReply(this.getId(), true);

    const {
      bcc = "",
      cc = "",
      from = Office.context.mailbox.userProfile.emailAddress,
      name = Office.context.mailbox.userProfile.displayName,
      htmlBody,
      replyTo = Office.context.mailbox.userProfile.emailAddress,
    } = options;

    const item = await MailboxAPI.updateMessage(id!, {
      bccRecipients: MailboxAPI.mapAddressesToRecipients(bcc),
      body: { content: htmlBody || body, contentType: "html" },
      ccRecipients: MailboxAPI.mapAddressesToRecipients(cc),
      from: { emailAddress: { address: from, name } },
      replyTo: MailboxAPI.mapAddressesToRecipients(replyTo),
    });

    return new GmailDraft(item);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#forwardrecipient,-options
   *
   * @summary Forwards this message to new recipients, with optional arguments.
   * @param recipient A comma-separated list of email addresses.
   * @param _options A JavaScript object that specifies advanced parameters
   */
  async forward(recipient: string, _options: AdvancedSendOptions = {}) {
    // TODO: handle options in future releases
    await MailboxAPI.forwardMessage(this.getId(), recipient);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getattachmentsoptions
   *
   * @summary Gets all the attachments for this message.
   * @param options A JavaScript object that specifies advanced parameters
   */
  getAttachments(options: GetAttachmentsAdvancedParameters = {}) {
    const items = this.item.attachments || [];

    const { includeAttachments = true, includeInlineImages = true } = options;

    return items
      .filter((item) => {
        const { isInline = false } = item;
        return [
          includeInlineImages && isInline,
          includeAttachments && !isInline,
        ].some(Boolean);
      })
      .map((item) => {
        return new GmailAttachment(item);
      });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getbcc
   *
   * @summary Gets the comma-separated recipients bcc'd on this message.
   */
  getBcc() {
    const bcc = this.item.bccRecipients || [];
    return bcc.map(({ emailAddress }) => emailAddress?.address).join(",");
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getbody
   *
   * @summary Gets the HTML content of the body of this message.
   */
  getBody() {
    return this.item.body?.content || "";
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getcc
   *
   * @summary Gets the comma-separated recipients cc'd on this message.
   */
  getCc() {
    const cc = this.item.ccRecipients || [];
    return cc.map(({ emailAddress }) => emailAddress?.address).join(",");
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getdate
   *
   * @summary Gets the date and time of this message.
   */
  getDate() {
    return new Date(this.item.createdDateTime!);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getfrom
   *
   * @summary Gets the sender of this message.
   */
  getFrom() {
    return this.item.from?.emailAddress?.address!;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getheadername
   *
   * @summary Gets the value of an RFC 2822 header given the header name.
   * @param name The name of the RFC header, without the colon separating it from the value.
   */
  getHeader(name: string) {
    return (
      this.item.internetMessageHeaders?.find((header) => header.name === name)
        ?.value || ""
    );
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getid
   *
   * @summary Gets the ID of this message.
   */
  getId() {
    return this.item.id!;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getplainbody
   *
   * @summary Gets the content of the body of this message without HTML formatting
   */
  getPlainBody() {
    return MailboxAPI.getMessagePlainText(this.getId());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getrawcontent
   *
   * @summary Gets the raw content of this message.
   */
  getRawContent() {
    return MailboxAPI.getMessageMIMEcontent(this.getId());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getreplyto
   *
   * @summary Gets the reply-to address of this message (usually the sender).
   */
  getReplyTo() {
    const [reply] = this.item.replyTo || [];
    return reply.emailAddress?.address!;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getsubject
   *
   * @summary Gets the subject of this message.
   */
  getSubject() {
    return this.item.subject || "";
  }

  getThread() {
    // TODO: future releases
    return new GmailThread({
      id: this.item.conversationId!,
    });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#getto
   *
   * @summary Gets the comma-separated recipients of this message.
   */
  getTo() {
    const to = this.item.toRecipients || [];
    return MailboxAPI.mapRecipientsToAddresses(to);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#isdraft
   *
   * @summary Gets whether this message is a draft.
   */
  isDraft() {
    return this.item.isDraft || false;
  }

  isInChats() {
    // TODO: future releases
    return false;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#isininbox
   *
   * @summary Gets whether this message is in the inbox.
   */
  isInInbox() {
    return this.item.parentFolderId === "inbox";
  }

  isInPriorityInbox() {
    // TODO: future releases
    return false;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#isintrash
   *
   * @summary Gets whether this message is in the trash.
   */
  isInTrash() {
    return this.item.parentFolderId === "deleteditems";
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#isstarred
   *
   * @summary Gets whether this message is starred.
   */
  isStarred() {
    return this.item.importance === "high";
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#isunread
   *
   * @summary Gets whether this message is unread.
   */
  isUnread() {
    return !this.item.isRead;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#markread
   *
   * @summary Marks the message as read.
   */
  async markRead() {
    this.item = await MailboxAPI.updateMessage(this.getId(), {
      isRead: true,
    });
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#markunread
   *
   * @summary Marks the message as unread.
   */
  async markUnread() {
    this.item = await MailboxAPI.updateMessage(this.getId(), {
      isRead: false,
    });
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#movetotrash
   *
   * @summary Moves the message to the trash.
   */
  async moveToTrash() {
    this.item = await MailboxAPI.moveMessage(this.getId(), "deleteditems");
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#refresh
   *
   * @summary Reloads this message and associated state from Gmail (useful in case the labels, read state, etc., have changed).
   */
  async refresh() {
    this.item = await MailboxAPI.getMessage(this.getId());
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#replybody,-options
   *
   * @summary Replies to the sender of this message using the reply-to address, with optional arguments.
   * @param body The body of the email.
   * @param options A JavaScript object that specifies advanced parameters, as listed below.
   */
  async reply(body: string, options: AdvancedReplyOptions = {}) {
    const reply = await this.createDraftReply(body, options);
    await MailboxAPI.sendReply(reply.getId());
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#replyallbody
   *
   * @summary Replies to the sender of this message using the reply-to address and all recipients, with optional arguments.
   * @param body The body of the email.
   * @param options A JavaScript object that specifies advanced parameters
   */
  async replyAll(body: string, options: AdvancedReplyOptions = {}) {
    const replyAll = await this.createDraftReplyAll(body, options);
    await MailboxAPI.sendReply(replyAll.getId(), true);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#star
   *
   * @summary Stars the message.
   */
  async star() {
    this.item = await MailboxAPI.updateMessage(this.getId(), {
      importance: "high",
    });
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-message#unstar
   *
   * @summary Unstars the message.
   */
  async unstar() {
    this.item = await MailboxAPI.updateMessage(this.getId(), {
      importance: "normal",
    });
    return this;
  }
}
