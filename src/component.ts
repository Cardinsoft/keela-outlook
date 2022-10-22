import { InspectableComponent } from "./lib/services/card/index";

export abstract class RenderableComponent extends InspectableComponent {
  /**
   * @summary component element
   */
  protected element?: HTMLElement;

  /**
   * @summary creates the component element
   */
  abstract create(): Promise<HTMLElement> | HTMLElement;

  /**
   * @summary hides the component
   */
  async hide() {
    const element = (this.element ||= await this.create());
    element.hidden = true;
    return this;
  }

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
   * @summary shows the component
   */
  async show() {
    const element = (this.element ||= await this.create());
    element.hidden = false;
    return this;
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
