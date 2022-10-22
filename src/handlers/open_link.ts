import { readyCallback } from "../index.js";
import { type OpenLink } from "../lib/services/card/actions/open_link.js";
import { OnClose, OpenAs } from "../lib/services/card/enums.js";
import { openURL, type OpenType } from "../utils/anchors.js";

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
