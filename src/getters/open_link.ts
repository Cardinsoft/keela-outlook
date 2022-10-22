import { type OpenLink } from "../lib/services/card/actions/open_link";
import { UniversalActionResponseBuilder } from "../lib/services/card/builders/universal_action_response";

/**
 * @summary gets {@link UniversalActionResponse} for a {@link OpenLink}
 * @param action {@link OpenLink} to get the response for
 */
export const getOpenLinkResponse = (action: OpenLink) => {
  const builder = new UniversalActionResponseBuilder();
  builder.setOpenLink(action);
  return builder.build();
};
