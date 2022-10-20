/// <reference types="@microsoft/microsoft-graph-types" />

type CreateDraftOptions = {
  attachments?: {}[];
  bcc?: string;
  cc?: string;
  from?: string;
  htmlBody?: string;
  inlineImages?: Record<string, {}>;
  name?: string;
  replyTo?: string;
};

type AdvancedSendOptions = CreateDraftOptions & { noReply?: boolean };

type AdvancedReplyOptions = AdvancedSendOptions & { subject?: string };

/**
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-app
 */
class GmailApp {
  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#createdraftrecipient,-subject,-body,-options
   * @see https://learn.microsoft.com/en-us/graph/api/user-post-messages?view=graph-rest-1.0&tabs=http
   *
   * @summary Creates a draft email message with optional arguments.
   * @param recipient the address of the recipient
   * @param subject the subject line
   * @param body the body of the email
   * @param options a JavaScript object that specifies advanced parameters
   */
  static async createDraft(
    recipient: string,
    subject: string,
    body: string,
    options: CreateDraftOptions = {}
  ) {
    const {
      bcc = "",
      cc = "",
      from,
      htmlBody = "",
      name = Office.context.mailbox.userProfile.displayName,
      replyTo = Office.context.mailbox.userProfile.emailAddress,
    } = options;

    const data: microsoftgraph.Message = {
      bccRecipients: bcc.split(",").map((address) => {
        return { emailAddress: { address } };
      }),
      body: {
        content: htmlBody || body,
        contentType: htmlBody ? "html" : "text",
      },
      ccRecipients: cc.split(",").map((address) => {
        return { emailAddress: { address } };
      }),
      from: { emailAddress: { address: from, name } },
      isDraft: true,
      replyTo: [{ emailAddress: { address: replyTo } }],
      subject,
      toRecipients: [{ emailAddress: { address: recipient } }],
    };

    const res = await MailboxAPI.request({
      authorize: true,
      headers: { "Content-Length": "0" },
      method: "POST",
      path: "/me/messages",
      type: "application/json",
      data,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to create GmailDraft", { cause: message });
    }

    return new Components.GmailDraft(await res.json());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#createlabelname
   * @see https://learn.microsoft.com/en-us/graph/api/outlookuser-post-mastercategories?view=graph-rest-1.0&tabs=http
   *
   * @summary Create a new user label of the given name.
   * @param name the name of the new label
   */
  static async createLabel(name: string) {
    const data: microsoftgraph.OutlookCategory = {
      displayName: name,
    };

    const res = await MailboxAPI.request({
      authorize: true,
      method: "POST",
      path: "/me/outlook/masterCategories",
      type: "application/json",
      data,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to create GmailLabel", { cause: message });
    }

    return new Components.GmailLabel(await res.json());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#deletelabellabel
   *
   * @summary Deletes the specified label.
   * @param label the label to delete
   */
  static async deleteLabel(label: Components.GmailLabel) {
    await label.deleteLabel();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getaliases
   *
   * @summary Gets a list of the emails that are set up as aliases for this account.
   */
  static getAliases() {
    return [Office.context.mailbox.userProfile.emailAddress];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getdraftdraftid
   * @see https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=http
   *
   * @summary Retrieve an email message draft by ID.
   * @param draftId the ID of the draft to retrieve
   */
  static async getDraft(draftId: string) {
    const message = await MailboxAPI.getMessage(draftId);
    return new Components.GmailDraft(message);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getdraftmessages
   *
   * @summary Retrieves all draft messages.
   */
  static async getDraftMessages() {
    const messages = await MailboxAPI.listMessages("isDraft eq true");
    return messages.map((message) => {
      return new Components.GmailMessage(message);
    });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getdrafts
   *
   * @summary Gets all Gmail draft messages.
   */
  static async getDrafts() {
    const messages = await MailboxAPI.listMessages("isDraft eq true");
    return messages.map((message) => {
      return new Components.GmailDraft(message);
    });
  }

  static async getInboxThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getInboxUnreadCount()
   *
   * @summary Gets the number of unread threads in the inbox.
   */
  static async getInboxUnreadCount() {
    const { length } = await MailboxAPI.listMessages(
      "isRead eq false and parentFolderId eq 'inbox'"
    );
    return length;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getmessagebyidid
   *
   * @summary Gets a message by ID.
   * @param id the ID of the message to retrieve
   */
  static async getMessageById(id: string) {
    const message = await MailboxAPI.getMessage(id);
    return new Components.GmailMessage(message);
  }

  static async getMessagesForThread(_thread: Components.GmailThread) {
    // TODO: future releases
    return [];
  }

  static async getMessagesForThreads(_threads: Components.GmailThread[]) {
    // TODO: future releases
    return [];
  }

  static async getPriorityInboxThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  static async getPriorityInboxUnreadCount() {
    // TODO: future releases
    return 0;
  }

  static async getSpamThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getspamunreadcount
   *
   * @summary Gets the number of unread threads that are spam.
   */
  static async getSpamUnreadCount() {
    const { length } = await MailboxAPI.listMessages(
      "isRead eq false and parentFolderId eq 'junkemail'"
    );
    return length;
  }

  static async getStarredThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  static async getStarredUnreadCount() {
    // TODO: future releases
    return 0;
  }

  static async getThreadById(id: string) {
    // TODO: future releases
    return new Components.GmailThread({
      id,
    });
  }

  static async getTrashThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getuserlabelbynamename
   *
   * @summary Retrieves a label given the label name.
   * @param name the name of the label to retrieve
   */
  static async getUserLabelByName(name: string) {
    const [category] = await MailboxAPI.listCategories(
      `displayName eq '${name}'`
    );
    if (!category) {
      throw new Error(`GmailLabel "${name}" does not exist`);
    }
    return new Components.GmailLabel(category);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#getuserlabels
   *
   * @ummary Retrieves a list of user-created labels.
   */
  static async getUserLabels() {
    const categories = await MailboxAPI.listCategories();
    return categories.map((category) => {
      return new Components.GmailLabel(category);
    });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markmessagereadmessage
   *
   * @summary Marks this message read and forces the message to refresh.
   * @param message the message to mark as read
   */
  static async markMessageRead(message: Components.GmailMessage) {
    await message.markRead();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markmessageunreadmessage
   *
   * @summary Marks this message unread and forces the message to refresh.
   * @param message the message to mark as unread
   */
  static async markMessageUnread(message: Components.GmailMessage) {
    await message.markUnread();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markmessagesreadmessages
   *
   * @summary Marks these messages read and forces the messages to refresh.
   * @param messages an array of messages to mark as read
   */
  static async markMessagesRead(messages: Components.GmailMessage[]) {
    for (const message of messages) {
      await this.markMessageRead(message);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markmessagesunreadmessages
   *
   * @summary Marks these messages unread and forces the messages to refresh.
   * @param messages an array of messages to mark as unread
   */
  static async markMessagesUnread(messages: Components.GmailMessage[]) {
    for (const message of messages) {
      await this.markMessageUnread(message);
    }
    return this;
  }

  static async markThreadImportant(_thread: Components.GmailThread) {
    // TODO: future releases
    return this;
  }

  static async markThreadRead(_thread: Components.GmailThread) {
    // TODO: future releases
    return this;
  }

  static async markThreadUnimportant(_thread: Components.GmailThread) {
    // TODO: future releases
    return this;
  }

  static async markThreadUnread(_thread: Components.GmailThread) {
    // TODO: future releases
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markthreadsimportantthreads
   *
   * @summary Marks these threads as important and forces the threads to refresh.
   * @param threads an array of threads to mark as important
   */
  static async markThreadsImportant(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await this.markThreadImportant(thread);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markthreadsreadthreads
   *
   * @summary Marks these threads as read and forces the threads to refresh.
   * @param threads an array of threads to mark as read
   */
  static async markThreadsRead(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await this.markThreadRead(thread);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markthreadsunimportantthreads
   *
   * @summary Marks these threads as unimportant and forces the threads to refresh.
   * @param threads an array of threads to mark as unimportant
   */
  static async markThreadsUnimportant(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await this.markThreadUnimportant(thread);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#markthreadsunreadthreads
   *
   * @summary Marks these threads as unread and forces the threads to refresh.
   * @param threads an array of threads to mark as unread
   */
  static async markThreadsUnread(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await this.markThreadUnread(thread);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movemessagetotrashmessage
   *
   * @summary Moves the message to the trash and forces the message to refresh.
   * @param message the message to be trashed
   */
  static async moveMessageToTrash(message: Components.GmailMessage) {
    await message.moveToTrash();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movemessagestotrashmessages
   *
   * @summary Moves the specified messages to the trash and forces the messages to refresh.
   * @param messages the messages to be trashed
   */
  static async moveMessagesToTrash(messages: Components.GmailMessage[]) {
    for (const message of messages) {
      await this.moveMessageToTrash(message);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadtoarchivethread
   *
   * @summary Moves this thread to the archive and forces the thread to refresh.
   * @param thread the thread to be archived
   */
  static async moveThreadToArchive(thread: Components.GmailThread) {
    await thread.moveToArchive();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadtoinboxthread
   *
   * @summary Moves this thread to the inbox and forces the thread to refresh.
   * @param thread the thread to be moved to the inbox
   */
  static async moveThreadToInbox(thread: Components.GmailThread) {
    await thread.moveToInbox();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadtospamthread
   *
   * @summary Moves this thread to spam and forces the thread to refresh.
   * @param thread the thread to be moved to spam
   */
  static async moveThreadToSpam(thread: Components.GmailThread) {
    await thread.moveToSpam();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadtotrashthread
   *
   * @summary Moves this thread to the trash and forces the thread to refresh.
   * @param thread the thread to be trashed
   */
  static async moveThreadToTrash(thread: Components.GmailThread) {
    await thread.moveToTrash();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadstoarchivethreads
   *
   * @summary Moves these threads to the archive and forces the threads to refresh.
   * @param threads an array of threads to be archived
   */
  static async moveThreadsToArchive(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await thread.moveToArchive();
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadstoinboxthreads
   *
   * @summary Moves these threads to the inbox and forces the threads to refresh.
   * @param threads an array of threads to be moved to the inbox
   */
  static async moveThreadsToInbox(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await thread.moveToInbox();
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadstospamthreads
   *
   * @summary Moves these threads to spam and forces the threads to refresh.
   * @param threads an array of threads to be moved to spam
   */
  static async moveThreadsToSpam(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await thread.moveToSpam();
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#movethreadstotrashthreads
   *
   * @summary Moves these threads to the trash and forces the threads to refresh.
   * @param threads an array of threads to be trashed
   */
  static async moveThreadsToTrash(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await thread.moveToTrash();
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#refreshmessagemessage
   *
   * @summary Reloads the message and associated state from Gmail (useful in case the labels, read state, etc., have changed).
   * @param message the message to be refreshed
   */
  static async refreshMessage(message: Components.GmailMessage) {
    await message.refresh();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#refreshmessagesmessages
   *
   * @summary Reloads the messages and associated state from Gmail (useful in case the labels, read state, etc., have changed).
   * @param messages the messages to be refreshed
   */
  static async refreshMessages(messages: Components.GmailMessage[]) {
    for (const message of messages) {
      await this.refreshMessage(message);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#refreshthreadthread
   *
   * @summary Reloads the thread and associated state from Gmail (useful in case the labels, read state, etc., have changed).
   * @param thread the thread to be refreshed
   */
  static async refreshThread(thread: Components.GmailThread) {
    await thread.refresh();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#refreshthreadsthreads
   *
   * @summary Reloads the threads and associated state from Gmail (useful in case the labels, read state, etc., have changed).
   * @param threads the threads to be refreshed
   */
  static async refreshThreads(threads: Components.GmailThread[]) {
    for (const thread of threads) {
      await this.refreshThread(thread);
    }
    return this;
  }

  static async search(_query: string, _start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient,-subject,-body,-options
   *
   * @summary Sends an email message with optional arguments.
   * @param recipient the addresses of the recipient
   * @param subject the subject line (250 characters maximum)
   * @param body the body of the email
   * @param options a JavaScript object that specifies advanced parameters
   */
  static async sendEmail(
    recipient: string,
    subject: string,
    body: string,
    options: AdvancedSendOptions = {}
  ) {
    const {
      bcc = "",
      cc = "",
      from = Office.context.mailbox.userProfile.emailAddress,
      name = Office.context.mailbox.userProfile.displayName,
      htmlBody,
      replyTo = Office.context.mailbox.userProfile.emailAddress,
    } = options;

    await MailboxAPI.sendMessage({
      bccRecipients: MailboxAPI.mapAddressesToRecipients(bcc),
      body: { content: htmlBody || body, contentType: "html" },
      ccRecipients: MailboxAPI.mapAddressesToRecipients(cc),
      from: { emailAddress: { address: from, name } },
      replyTo: [{ emailAddress: { address: replyTo } }],
      toRecipients: [{ emailAddress: { address: recipient } }],
      subject,
    });

    return this;
  }

  static setCurrentMessageAccessToken(_accessToken: string) {
    // TODO: figure out if it needs to be anything other than no-op
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#starmessagemessage
   *
   * @summary Adds a star to this message and forces the message to refresh.
   * @param message the message to star
   */
  static async starMessage(message: Components.GmailMessage) {
    await message.star();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#starmessagesmessages
   *
   * @summary Adds stars to these messages and forces the messages to refresh.
   * @param messages an array of messages to star
   */
  static async starMessages(messages: Components.GmailMessage[]) {
    for (const message of messages) {
      await this.starMessage(message);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#unstarmessagemessage
   *
   * @summary Removes a star from this message and forces the message to refresh.
   * @param message the message to unstar
   */
  static async unstarMessage(message: Components.GmailMessage) {
    await message.unstar();
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-app#unstarmessagesmessages
   * 
   * @summary Removes stars from these messages and forces the messages to refresh.
   * @param messages an array of messages to unstar
   */
  static async unstarMessages(messages: Components.GmailMessage[]) {
    for(const message of messages) {
        await this.unstarMessage(message);
    }
    return this;
  } 
}
