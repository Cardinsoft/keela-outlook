import { readyCallback } from "../../ready";
import { type OpenLink } from "../services/card/actions/open_link";
import { OnClose, OpenAs } from "../services/card/enums";
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

  const openType: OpenType = Office.context.host ? openTypeMap[openAs] : "web";

  openURL(url, openType, () => {
    if (onClose === OnClose.RELOAD) {
      readyCallback(Office.context);
    }
  });
};
