type ActionType =
  | AuthorizationAction
  | Action
  | Components.OpenLink
  | DisplayCardsAction;

class ActionStore {
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
