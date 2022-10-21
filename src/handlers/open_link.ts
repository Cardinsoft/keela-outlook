/**
 * @summary handles an action with {@link Components.OpenLink} set
 * @param openLink open link to handle
 */
const handleOpenLinkAction = (openLink: Components.OpenLink) => {
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
