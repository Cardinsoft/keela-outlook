type MenuItemType = "card" | "universal";

class AddInMenu extends CardServiceRenderableComponent {
  private cardActions: Record<string, CardAction> = {};
  private universalActions: Record<string, UniversalAction> = {};

  /**
   * @summary gets a pool of existing identifiers
   */
  private getIdentifiers(type: MenuItemType) {
    return Object.keys(this[`${type}Actions`]);
  }

  /**
   * @summary adds a card action to the menu
   * @param cardAction {@link CardAction} to add
   */
  async addCardAction(cardAction: CardAction) {
    const guid = getGuid(this.getIdentifiers("card"));
    this.cardActions[guid] = cardAction;
    return this;
  }

  /**
   * @summary adds a universal action to the menu
   * @param universalAction {@link UniversalAction} to add
   */
  async addUniversalAction(universalAction: UniversalAction) {
    const guid = getGuid(this.getIdentifiers("universal"));
    this.universalActions[guid] = universalAction;
    return this;
  }

  /**
   * @summary clears the menu
   */
  clear(type: MenuItemType) {
    const store = this[`${type}Actions`];
    Object.entries(store).forEach(([guid, action]) => {
      action.teardown();
      delete store[guid];
    });
    return this;
  }

  /**
   * @summary removes an action from the menu
   * @param type item type to remove
   * @param guid action GUID
   */
  remove(type: MenuItemType, guid: string) {
    const store = this[`${type}Actions`];
    const action = store[guid];
    action?.teardown();
    delete store[guid];
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

  async render(maybeParent: HTMLElement | null): Promise<HTMLElement> {
    const { cardActions, universalActions } = this;

    const element = this.element || this.create();

    for (const action of Object.values(cardActions)) {
      await action.render(element);
    }

    for (const action of Object.values(universalActions)) {
      await action.render(element);
    }

    return super.render(maybeParent);
  }
}
