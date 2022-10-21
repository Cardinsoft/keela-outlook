/**
 * @summary custom implementation to use in Add-In menus
 */
class UniversalAction extends CardServiceRenderableComponent {
  action?: Components.OpenLink | DisplayCardsAction;
  text?: string;

  /**
   * @summary gets action of this universal action
   */
  private getAction() {
    const { action } = this;
    if (!action) {
      throw new Error("universal actions must have at least one action set");
    }
    return action;
  }

  /**
   * @summary gets text of this universal action
   */
  private getText() {
    const { text } = this;
    if (!text) {
      throw new Error("universal actions must have text set");
    }
    return text;
  }

  /**
   * @summary sets an open link action
   * @param openLink {@link Components.OpenLink} action
   */
  setOpenLink(openLink: Components.OpenLink) {
    this.action = openLink;
    return this;
  }

  /**
   * @summary sets text to this action
   * @param text action text
   */
  setText(text: string) {
    this.text = text;
    return this;
  }

  create(): HTMLElement {
    const text = this.getText();
    const action = this.getAction();

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
