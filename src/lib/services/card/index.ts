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
  protected element?: HTMLElement;

  /**
   * @summary creates the component element
   */
  abstract create(): Promise<HTMLElement> | HTMLElement;

  /**
   * @summary renders the component
   * @param maybeParent parent element
   */
  async render(
    maybeParent: HTMLElement | null,
    prepend = false
  ): Promise<HTMLElement> {
    const element = (this.element ||= await this.create());
    const parent = maybeParent || document.body;
    prepend ? parent.prepend(element) : parent.append(element);
    return element;
  }

  /**
   * @summary removes the component from DOM
   */
  async teardown(): Promise<HTMLElement> {
    const element = (this.element ||= await this.create());
    element.remove();
    return element;
  }
}
