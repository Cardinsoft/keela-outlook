type DialogErrorEvent = {
  error: number;
};

type DialogSuccessEvent = {
  message: string;
  origin: string | undefined;
};

type DialogEvent = DialogSuccessEvent | DialogErrorEvent;

type DialogEventLog = {
  event: string;
  type: "dialog";
};

/**
 * @summary Office dialog events handler
 * @param event dialog event
 */
const dialogCallback = (event: DialogEvent) => {
  const eventLog: Omit<DialogEventLog, "event"> = { type: "dialog" };
  const logMessage = "dialog event";

  if ("error" in event) {
    const { error } = event;

    const messages: Record<number, string> = {
      12002:
        "The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.",
      12003:
        "The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.",
      12006: "Dialog closed.",
    };

    const defaultMessage = "Unknown error in dialog box.";

    return log("log", logMessage, {
      ...eventLog,
      event: messages[error] || defaultMessage,
    });
  }

  const { message } = event;

  return log("log", logMessage, {
    ...eventLog,
    event: message,
  });
};
