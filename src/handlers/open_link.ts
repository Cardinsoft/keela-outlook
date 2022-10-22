import { readyCallback } from "../index";
import { type OpenLink } from "../lib/services/card/actions/open_link";
import { OnClose, OpenAs } from "../lib/services/card/enums";
import { openURL, type OpenType } from "../utils/anchors";

/**
 * @summary handles an action with {@link OpenLink} set
 * @param openLink open link to handle
 */
export const handleOpenLinkAction = (openLink: OpenLink) => {
  const { onClose, openAs, url = "" } = openLink;

  const openTypeMap: Record<OpenAs, OpenType> = {
    [OpenAs.FULL_SIZE]: "browser",
    [OpenAs.OVERLAY]: "dialog",
  };

  openURL(url, openTypeMap[openAs], () => {
    if (onClose === OnClose.RELOAD) {
      readyCallback(Office.context);
    }
  });
};
