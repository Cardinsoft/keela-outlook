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

enum DialogErrorCode {
  CLOSED = 12006,
  HTTPS_ERROR = 12003,
  LOAD_ERROR = 12002,
}

/**
 * @summary Office dialog events handler
 * @param event dialog event
 */
const dialogCallback = (event: DialogEvent) => {
  const eventLog: Omit<DialogEventLog, "event"> = { type: "dialog" };
  const logMessage = "dialog event";

  if ("error" in event) {
    const { error } = event;

    // dialog is closed normally
    if (error === DialogErrorCode.CLOSED) {
      onClose?.();
    }

    const messages: Record<DialogErrorCode | number, string> = {
      [DialogErrorCode.LOAD_ERROR]:
        "The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.",
      [DialogErrorCode.HTTPS_ERROR]:
        "The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.",
      [DialogErrorCode.CLOSED]: "Dialog closed.",
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
