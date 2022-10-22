import { GmailLabel } from "./label";

/**
 * @see https://developers.google.com/apps-script/reference/gmail/gmail-thread
 */
export class GmailThread {
  constructor(protected item: microsoftgraph.ConversationThread) {}

  async moveToArchive() {
    // TODO: future releases
    return this;
  }

  async moveToInbox() {
    // TODO: future releases
    return this;
  }

  async moveToSpam() {
    // TODO: future releases
    return this;
  }

  async moveToTrash() {
    // TODO: future releases
    return this;
  }

  async refresh() {
    // TODO: future releases
    return this;
  }

  async removeLabel(_label: GmailLabel) {
    // TODO: future releases
    return this;
  }
}
