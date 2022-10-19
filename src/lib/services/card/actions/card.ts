/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-action
 */
class CardAction {
  action?: AuthorizationAction | Action | Components.OpenLink;
  composedEmailType: ComposedEmailType = ComposedEmailType.REPLY_AS_DRAFT;
  text?: string;

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#setauthorizationactionaction
   *
   * @summary Sets an authorization action that opens a URL to the authorization flow when the object is clicked.
   * @param action The object that specifies the authorization action to take when this element is clicked.
   */
  setAuthorizationAction(action: AuthorizationAction) {
    this.action = action;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#setcomposeactionaction,-composedemailtype
   *
   * @summary Sets an action that composes a draft email when the object is clicked
   * @param action The object that specifies the compose action to take when this element is clicked.
   * @param composedEmailType An enum value that specifies whether the composed draft is a standalone or reply draft.
   */
  setComposeAction(action: Action, composedEmailType: ComposedEmailType) {
    this.action = action;
    this.composedEmailType = composedEmailType;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#setonclickactionaction
   *
   * @summary Sets an action that executes when the object is clicked.
   * @param action The action to take when this element is clicked.
   */
  setOnClickAction(action: Action) {
    this.action = action;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#setonclickopenlinkactionaction
   *
   * @summary Sets an action that opens a URL in a tab when the object is clicked.
   * @param action The object that specifies the open link action to take when this element is clicked.
   */
  setOnClickOpenLinkAction(action: Action) {
    this.action = action;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#setopenlinkopenlink
   *
   * @summary Sets a URL to be opened when the object is clicked.
   * @param openLink An {@link Components.OpenLink} object describing the URL to open.
   */
  setOpenLink(openLink: Components.OpenLink) {
    this.action = openLink;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-action#settexttext
   *
   * @summary Sets the menu text for this action.
   * @param text The menu item text.
   */
  setText(text: string) {
    this.text = text;
    return this;
  }
}
