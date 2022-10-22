import { RenderableComponent } from "../../../../component";
import { handleEvent } from "../../../../handlers/event";
import { ActionStore } from "../../../stores/actions";
import { ComposedEmailType } from "../enums";
import { type Action } from "./action";
import { type AuthorizationAction } from "./authorization";
import { type OpenLink } from "./open_link";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-action
 */
export class CardAction extends RenderableComponent {
  action?: AuthorizationAction | Action | OpenLink;
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
   * @param openLink An {@link OpenLink} object describing the URL to open.
   */
  setOpenLink(openLink: OpenLink) {
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

  create(): HTMLElement {
    const { text, action } = this;

    if (!text) {
      throw new Error("card actions must have text set");
    }

    if (!action) {
      throw new Error("card actions must have an action set");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("menuItem");

    const textElement = document.createElement("p");
    textElement.classList.add("menuText");
    textElement.textContent = text;

    // TODO: handle actions with icons

    ActionStore.set(wrapper, action);
    wrapper.addEventListener("click", () => handleEvent(wrapper));

    wrapper.append(textElement);
    return wrapper;
  }
}
