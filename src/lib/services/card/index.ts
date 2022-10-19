abstract class CardServiceComponent {
  /**
   * @summary Prints the JSON representation of this object.
   */
  printJson() {
    return JSON.stringify(this);
  }
}

abstract class CardServiceRenderableComponent extends CardServiceComponent {
  /**
   * @summary component element
   */
  element: HTMLElement;

  /**
   * @param parentId parent element id
   */
  constructor(protected parentId: string) {
    super();
    this.element = this.create();
  }

  /**
   * @summary creates the component element
   */
  abstract create(): HTMLElement;

  /**
   * @summary renders the component
   * @param parentId id of the parent element
   */
  async render(parentId: string): Promise<HTMLElement> {
    const { element } = this;

    const parent = document.getElementById(parentId);
    if (!parent) {
      throw new Error(`missing ${this.constructor.name} parent: #${parentId}`);
    }

    parent.append(element);
    return element;
  }
  /**
   * @summary removes the component from DOM
   */
  teardown(): HTMLElement {
    const { element } = this;
    element.remove();
    return element;
  }
}
