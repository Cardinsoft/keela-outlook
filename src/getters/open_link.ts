/**
 * @summary gets {@link Components.UniversalActionResponse} for a {@link Components.OpenLink}
 * @param action {@link Components.OpenLink} to get the response for
 */
const getOpenLinkResponse = (action: Components.OpenLink) => {
  const builder = new UniversalActionResponseBuilder();
  builder.setOpenLink(action);
  return builder.build();
};
