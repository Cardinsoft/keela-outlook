import { MailboxAPI } from "../graph.js";
import { GmailThread } from "./thread.js";

/**
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-label
 */
export class GmailLabel {
  constructor(private item: microsoftgraph.OutlookCategory) {}

  addToThread(_thread: GmailThread) {
    // TODO: future releases
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-label#addtothreadsthreads
   *
   * @summary Adds this label to the given threads and forces the threads to refresh.
   * @param threads An array of threads to be labeled.
   */
  addToThreads(threads: GmailThread[]) {
    for (const thread of threads) {
      this.addToThread(thread);
    }
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-label#deletelabel
   * @see https://learn.microsoft.com/en-us/graph/api/outlookcategory-delete?view=graph-rest-1.0&tabs=http
   *
   * @summary Deletes this label.
   */
  async deleteLabel() {
    return MailboxAPI.deleteCategory(this.item.id!);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-label#getname
   *
   * @summary Gets the name of this label.
   */
  getName() {
    return this.item.displayName!;
  }

  getThreads(_start?: number, _max?: number) {
    // TODO: future releases
    return [];
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-label#getunreadcount
   *
   * @summary Gets the number of unread threads tagged with this label.
   */
  async getUnreadCount() {
    const { length } = await MailboxAPI.listMessages(
      `categories/any(c:c eq '${this.getName()}') and isRead eq false`
    );
    return length;
  }

  removeFromThread(_thread: GmailThread) {
    // TODO: future releases
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/gmail/gmail-label#removefromthreadsthreads
   *
   * @summary Removes this label from the given threads and forces the threads to refresh.
   * @param threads An array of threads to be unlabeled.
   */
  removeFromThreads(threads: GmailThread[]) {
    for (const thread of threads) {
      this.removeFromThread(thread);
    }
    return this;
  }
}
