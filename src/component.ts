abstract class Component {
  /**
   * @summary component element
   */
  protected element: HTMLElement;

  /**
   * @param parentId parent element id
   */
  constructor(parentId: string) {
    this.element = this.create(parentId);
  }

  /**
   * @summary creates the component {@link Component.element}
   * @param parentId parent element id
   */
  abstract create(parentId: string): HTMLElement;

  /**
   * @summary hides the component
   */
  hide() {
    this.element.hidden = true;
    return this;
  }

  /**
   * @summary shows the component
   */
  show() {
    this.element.hidden = false;
    return this;
  }
}
