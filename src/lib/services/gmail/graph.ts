export type MailboxAPIRequestOptions<T = unknown> = {
  authorize?: boolean;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  data?: T;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  type?: "application/json" | "text/plain";
};

export class MailboxAPI {
  private static baseURL = "https://graph.microsoft.com/v1.0";

  /**
   * @summary maps a list of email addresses to Graph recipients
   * @param addresses comma-separated list of email addresses
   */
  static mapAddressesToRecipients(
    addresses: string
  ): microsoftgraph.Recipient[] {
    return addresses.split(",").map((address) => {
      return { emailAddress: { address } };
    });
  }

  /**
   * @summary maps a list of Graph recipients to a comma-separated string
   * @param recipients list of recipients
   */
  static mapRecipientsToAddresses(
    recipients: microsoftgraph.Recipient[]
  ): string {
    return recipients
      .map(({ emailAddress }) => emailAddress?.address)
      .join(",");
  }

  /**
   * @summary gets an EWS token
   */
  static getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      Office.context.mailbox.getCallbackTokenAsync(
        { isRest: true },
        (result) => {
          const { status, error, value } = result;

          const statusHandlers = {
            [Office.AsyncResultStatus.Succeeded]: () => resolve(value),
            [Office.AsyncResultStatus.Failed]: () => reject(error),
          };

          statusHandlers[status]();
        }
      );
    });
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/outlookuser-post-mastercategories?view=graph-rest-1.0&tabs=http
   *
   * @summary creates an Outlook Category using Graph API
   * @param category category resource
   */
  static async createCategory(
    category: microsoftgraph.OutlookCategory
  ): Promise<microsoftgraph.OutlookCategory> {
    const res = await MailboxAPI.request({
      authorize: true,
      method: "POST",
      path: "/me/outlook/masterCategories",
      type: "application/json",
      data: category,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to create category", { cause: message });
    }

    return res.json();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/user-post-messages?view=graph-rest-1.0&tabs=http
   *
   * @summary creates an Outlook Message using Graph API
   * @param message message resource
   */
  static async createMessage(
    message: microsoftgraph.Message
  ): Promise<microsoftgraph.Message> {
    const res = await MailboxAPI.request({
      authorize: true,
      headers: { "Content-Length": "0" },
      method: "POST",
      path: "/me/messages",
      type: "application/json",
      data: message,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to create message", { cause: message });
    }

    return res.json();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-createreply?view=graph-rest-1.0&tabs=http
   * @see https://learn.microsoft.com/en-us/graph/api/message-createreplyall?view=graph-rest-1.0&tabs=http
   *
   * @summary creates an Outlook reply Message using Graph API
   * @param messageId id of the message to reply to
   * @param all whether to create a reply-all message
   */
  static async createReply(
    messageId: string,
    all = false
  ): Promise<microsoftgraph.Message> {
    const res = await this.request({
      authorize: true,
      headers: {
        Prefer: `outlook.timezone="${Office.context.mailbox.userProfile.timeZone}"`,
      },
      method: "POST",
      path: `/me/messages/${messageId}/createReply${all ? "All" : ""}`,
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to create draft reply", { cause: message });
    }

    return res.json();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/outlookcategory-delete?view=graph-rest-1.0&tabs=http
   *
   * @summary deletes an Outlook Category using Graph API
   * @param categoryId id of the category to delete
   */
  static async deleteCategory(categoryId: string) {
    const res = await MailboxAPI.request({
      authorize: true,
      method: "DELETE",
      path: `/me/outlook/masterCategories/${categoryId}`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to delete category", { cause: message });
    }
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-delete?view=graph-rest-1.0&tabs=http
   *
   * @summary deletes an Outlook Message using Graph API
   * @param messageId id of the message to delet
   */
  static async deleteMessage(messageId: string) {
    const res = await this.request({
      authorize: true,
      method: "DELETE",
      path: `/me/messages/${messageId}`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to delete message", { cause: message });
    }
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/outlookuser-list-mastercategories?view=graph-rest-1.0&tabs=http
   *
   * @summary lists Outlook Categories using Graph API
   * @param $filter filter parameter to narrow down the result set
   */
  static async listCategories($filter?: string) {
    const options: MailboxAPIRequestOptions = {
      authorize: true,
      method: "GET",
      path: "/me/outlook/masterCategories",
    };

    const parameters: Record<string, string> = {};
    if ($filter) Object.assign(parameters, { $filter });
    options.parameters = parameters;

    const res = await MailboxAPI.request(options);

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to list categories", { cause: message });
    }

    const { value }: { value: microsoftgraph.OutlookCategory[] } =
      await res.json();
    return value;
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http
   *
   * @summary lists Outlook Messages using Graph API
   * @param $filter filter parameter to narrow down the result set
   */
  static async listMessages($filter?: string) {
    const options: MailboxAPIRequestOptions = {
      authorize: true,
      headers: { Prefer: `outlook.body-content-type="html"` },
      method: "GET",
      path: "/me/messages",
    };

    // TODO: pagination

    const parameters: Record<string, string> = { $top: "1000" };
    if ($filter) Object.assign(parameters, { $filter });
    options.parameters = parameters;

    const res = await MailboxAPI.request(options);

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to list messages", { cause: message });
    }

    const { value }: { value: microsoftgraph.Message[] } = await res.json();
    return value;
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=http#example-3-get-message-body-in-text-format
   *
   * @summary gets message body as plain text
   * @param messageId id of the message
   */
  static async getMessagePlainText(messageId: string): Promise<string> {
    const res = await MailboxAPI.request({
      authorize: true,
      headers: { Prefer: 'outlook.body-content-type="text"' },
      method: "GET",
      path: `/me/messages/${messageId}?$select=body`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to get message plain text content", {
        cause: message,
      });
    }

    const { body }: microsoftgraph.Message = await res.json();
    return body?.content || "";
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=http#example-4-get-mime-content
   *
   * @summary gets MIME content of a message
   * @param messageId id of the message
   */
  static async getMessageMIMEcontent(messageId: string): Promise<string> {
    const res = await MailboxAPI.request({
      authorize: true,
      headers: { Prefer: 'outlook.body-content-type="html"' },
      method: "GET",
      path: `/me/messages/${messageId}/$value`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to get message MIME content", { cause: message });
    }

    return res.text();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=http
   *
   * @summary gets an Outlook Message using Graph API
   * @param messageId id of the message to get
   */
  static async getMessage(messageId: string): Promise<microsoftgraph.Message> {
    const res = await MailboxAPI.request({
      authorize: true,
      headers: { Prefer: 'outlook.body-content-type="html"' },
      method: "GET",
      path: `/me/messages/${messageId}`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to get message", { cause: message });
    }

    return res.json();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-move?view=graph-rest-1.0&tabs=http
   *
   * @summary moves the message to a new folder
   * @param messageId id of the moved message
   * @param destinationId target folder id
   */
  static async moveMessage(
    messageId: string,
    destinationId: string
  ): Promise<microsoftgraph.Message> {
    const res = await MailboxAPI.request({
      authorize: true,
      data: { destinationId },
      method: "POST",
      path: `/me/messages/${messageId}/move`,
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to move message", { cause: message });
    }

    return res.json();
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0&tabs=http
   *
   * @summary sends an Outlook Message using Graph API
   * @param message message resource
   */
  static async sendMessage(message: microsoftgraph.Message) {
    const res = await this.request({
      authorize: true,
      data: { message },
      method: "POST",
      path: "/me/sendMail",
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to send message", { cause: message });
    }
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-send?view=graph-rest-1.0&tabs=http
   *
   * @summary sends an Outlook Message by its id using Graph API
   * @param messageId id of the message to send
   */
  static async sendMessageById(messageId: string) {
    const res = await this.request({
      authorize: true,
      headers: { "Content-Length": "0" },
      method: "POST",
      path: `/me/messages/${messageId}/send`,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to send message", { cause: message });
    }
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-reply?view=graph-rest-1.0&tabs=http
   * @see https://learn.microsoft.com/en-us/graph/api/message-replyall?view=graph-rest-1.0&tabs=http
   *
   * @summary sends a reply to an Outlook Message using Graph API
   * @param messageId id of the message to reply to
   * @param all whether to send a reply-all message
   */
  static async sendReply(messageId: string, all = false) {
    const res = await this.request({
      authorize: true,
      headers: {
        Prefer: `outlook.timezone="${Office.context.mailbox.userProfile.timeZone}"`,
      },
      method: "POST",
      path: `/me/messages/${messageId}/reply${all ? "All" : ""}`,
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to reply to message", { cause: message });
    }
  }

  static async query<T extends microsoftgraph.Entity>(options: {
    page?: number;
    search: string;
    size?: number;
    type: microsoftgraph.EntityType;
  }): Promise<T[]> {
    const { size = 50, page = 1, search, type } = options;

    const request: microsoftgraph.SearchRequest = {
      entityTypes: [type],
      from: (page - 1) * size,
      size,
      query: { queryString: search },
    };

    const res = await this.request({
      authorize: true,
      data: { requests: [request] },
      method: "POST",
      path: "/search/query",
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to search messages", { cause: message });
    }

    const { value }: { value: microsoftgraph.SearchResponse } =
      await res.json();

    return (value.hitsContainers || []).flatMap((container) => {
      return (container.hits || []).map(({ resource }) => resource as T);
    });
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-forward?view=graph-rest-1.0&tabs=http
   *
   * @summary forwards an Outlook Message using Graph API
   * @param messageId id of the message to forward
   * @param to comma-separated list of recipients
   */
  static async forwardMessage(messageId: string, to: string) {
    const res = await this.request({
      authorize: true,
      data: { toRecipients: this.mapAddressesToRecipients(to) },
      method: "POST",
      path: `/me/messages/${messageId}/forward`,
      type: "application/json",
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to forward message", { cause: message });
    }
  }

  /**
   * @see https://learn.microsoft.com/en-us/graph/api/message-update?view=graph-rest-1.0&tabs=http
   *
   * @summary updates an Outlook Message using Graph API
   * @param messageId id of the message to update
   * @param data message updates
   */
  static async updateMessage(
    messageId: string,
    data: microsoftgraph.Message
  ): Promise<microsoftgraph.Message> {
    const res = await MailboxAPI.request({
      authorize: true,
      method: "PATCH",
      path: `/me/messages/${messageId}`,
      type: "application/json",
      data,
    });

    if (!res.ok) {
      const { message }: microsoftgraph.GenericError = await res.json();
      throw new Error("failed to update message", { cause: message });
    }

    return res.json();
  }

  /**
   * @summary helper method for requesting Graph API
   * @param config request configuration
   */
  static async request<T>(config: MailboxAPIRequestOptions<T>) {
    const {
      authorize = false,
      headers = {},
      method,
      path,
      data,
      parameters = {},
      type,
    } = config;

    const url = new URL(`${this.baseURL}${path}`);
    url.search = new URLSearchParams(parameters).toString();

    const requestHeaders = new Headers(headers);

    if (authorize) {
      requestHeaders.set("Authorization", `Bearer ${await this.getToken()}`);
    }

    if (type) {
      requestHeaders.set("Content-Type", type);
    }

    const init: RequestInit = { method, headers: requestHeaders };

    if (data) {
      init.body =
        type === "application/json" ? JSON.stringify(data) : (data as string);
    }

    return fetch(url, {
      method,
      headers: requestHeaders,
      body: JSON.stringify(data),
    });
  }
}
