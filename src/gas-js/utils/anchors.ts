import { dialogCallback, DialogErrorCode } from "./dialogs";
import { forceHttps } from "./network";

export type OpenType = "browser" | "dialog" | "web";

/**
 * @summary opens an Office Dialog to navigate to the link
 * @param href URL string to follow
 * @param type link handler type
 * @param onClose callback to call when the dialog is closed
 */
export const openURL = (
  href: string,
  type: OpenType,
  onClose?: (...args: any[]) => void
) => {
  const url = new URL(`${location.origin}/redirect.html`);
  url.searchParams.append("endpoint", forceHttps(href));

  const handlers: Record<OpenType, (url: URL) => void> = {
    browser: (url) => Office.context.ui.openBrowserWindow(url.toString()),
    dialog: (url) => {
      Office.context.ui.displayDialogAsync(
        url.toString(),
        { width: 150, height: 250 },
        (res) => {
          res.value.addEventHandler(
            Office.EventType.DialogEventReceived,
            (event) => dialogCallback(event, onClose)
          );
        }
      );
    },
    web: (url) => {
      const child = window.open(url);
      child?.addEventListener("close", () => {
        dialogCallback({ error: DialogErrorCode.CLOSED }, onClose);
      });
    },
  };

  return handlers[type](url);
};

/**
 * @summary intercepts link clicks to display the target in an iframe
 * @param target target link
 * @param href URL string to follow
 * @param type link handler type
 */
export const addAnchorListener = (
  target: EventTarget,
  href: string,
  type: OpenType
) => {
  target.addEventListener("click", (event) => {
    event.preventDefault();
    openURL(href, type);
    return false;
  });
};

/**
 * @summary intercepts tel clicks to load in the same-window context
 * @param target target link
 */
export const addTelListener = (target: HTMLAnchorElement) => {
  target.addEventListener("click", (event) => {
    event.stopPropagation();
    target.target = "_self";
    return false;
  });
};
