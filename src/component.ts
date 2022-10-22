import { InspectableComponent } from "./lib/services/card/index.js";

export abstract class Component {
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
