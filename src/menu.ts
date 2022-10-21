type MenuItemType = "card" | "universal";

class AddInMenu extends CardServiceRenderableComponent {
  private actions: Record<string, CardAction | UniversalAction> = {};

  /**
   * @summary gets a pool of existing identifiers
   */
  private get identifiers() {
    return Object.keys(this.actions);
  }

  /**
   * @summary adds a card action to the menu
   * @param cardAction {@link CardAction} to add
   */
  async addCardAction(cardAction: CardAction) {
    const { identifiers } = this;
    const guid = getGuid(identifiers);
    this.actions[guid] = cardAction;
    return this;
  }

  /**
   * @summary adds a universal action to the menu
   * @param universalAction {@link UniversalAction} to add
   */
  async addUniversalAction(universalAction: UniversalAction) {
    const { identifiers } = this;
    const guid = getGuid(identifiers);
    this.actions[guid] = universalAction;
    return this;
  }

  /**
   * @summary clears the menu
   */
  clear() {
    const { actions } = this;
    Object.entries(actions).forEach(([guid, action]) => {
      action.teardown();
      delete actions[guid];
    });
    return this;
  }

  /**
   * @summary removes an action from the menu
   * @param guid action GUID
   */
  remove(guid: string) {
    const { actions } = this;
    const action = actions[guid];
    action?.teardown();
    delete actions[guid];
    return this;
  }

  /**
   * @summary toggles the menu open state
   */
  toggle() {
    const { element } = this;
    element?.classList.toggle("singulared");
    return this;
  }

  create(): HTMLElement {
    const element = document.createElement("div");
    element.classList.add("Menu", "singulared");

    document.querySelector(".navelem")?.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.toggle();
    });

    element.addEventListener("pointerover", () => {
      const out = () => {
        element.removeEventListener("pointerout", out);

        const switchMenu = () => {
          this.toggle();
          document.body.removeEventListener("click", switchMenu);
        };

        document.body.addEventListener("click", switchMenu);
      };

      element.addEventListener("pointerout", out);
    });

    return element;
  }
}
