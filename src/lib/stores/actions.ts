class ActionStore {
  /**
   * @summary map of guids to actions
   */
  private static actions: Record<string, ValidActions> = {};

  /**
   * @summary gets a list of existing action guids
   */
  private static get identifiers() {
    return Object.keys(this.actions);
  }

  /**
   * @summary gets an {@link ValidActions} by its guid
   * @param guid action guid to lookup
   */
  static get(guid: string) {
    return this.actions[guid];
  }

  /**
   * @summary sets an {@link ValidActions}
   * @param caller calling element
   * @param action {@link ValidActions} instance
   */
  static set(caller: HTMLElement, action: ValidActions) {
    const { actions, identifiers } = this;
    const guid = getGuid(identifiers);
    actions[guid] = action;
    caller.classList.add("pointer");
    caller.setAttribute("action", guid);
    return this;
  }

  /**
   * @summary removes an {@link ValidActions} by its guid
   * @param guid {@link ValidActions} guid
   */
  static remove(guid: string) {
    const { actions } = this;
    delete actions[guid];
    return this;
  }
}
