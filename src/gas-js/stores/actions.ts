import { handleEvent } from "../handlers/event";
import { type Action } from "../services/card/actions/action";
import { type AuthorizationAction } from "../services/card/actions/authorization";
import { type DisplayCardsAction } from "../services/card/actions/display_cards";
import { type OpenLink } from "../services/card/actions/open_link";
import { getGuid } from "../utils/identifiers";

export type ActionType =
  | AuthorizationAction
  | Action
  | OpenLink
  | DisplayCardsAction;

export class ActionStore {
  /**
   * @summary map of guids to actions
   */
  private static actions: Record<string, ActionType> = {};

  /**
   * @summary gets a list of existing action guids
   */
  private static get identifiers() {
    return Object.keys(this.actions);
  }

  /**
   * @summary binds an event listener handling a given {@link action}
   * @param event event type
   * @param caller calling element
   * @param action action to bind
   * @param target element to bind to
   */
  static bind(
    event: string,
    caller: HTMLElement,
    action: ActionType,
    target?: HTMLHtmlElement
  ) {
    this.set(caller, action);
    const eventTarget = target || caller;

    eventTarget.addEventListener(event, () => {
      handleEvent(eventTarget);
    });

    return this;
  }

  /**
   * @summary gets an {@link ActionType} by its guid
   * @param guid action guid to lookup
   */
  static get(guid: string) {
    return this.actions[guid];
  }

  /**
   * @summary sets an {@link ActionType}
   * @param caller calling element
   * @param action {@link ActionType} instance
   */
  static set(caller: HTMLElement, action: ActionType) {
    const { actions, identifiers } = this;
    const guid = getGuid(identifiers);
    actions[guid] = action;
    caller.classList.add("pointer");
    caller.setAttribute("action", guid);
    return this;
  }

  /**
   * @summary removes an {@link ActionType} by its guid
   * @param guid {@link ActionType} guid
   */
  static remove(guid: string) {
    const { actions } = this;
    delete actions[guid];
    return this;
  }
}
