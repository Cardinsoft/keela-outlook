import { RenderableComponent } from ".";

export type SpinnerSize = "large" | "small";

export class Spinner extends RenderableComponent {
  private size: SpinnerSize = "small";

  /**
   * @summary sets the size of the spinner
   * @param size new {@link SpinnerSize}
   */
  setSize(size: SpinnerSize) {
    this.size = size;
    return this;
  }

  create() {
    const { size } = this;
    const spinner = document.createElement("div");
    spinner.classList.add("spinner", `spinner-${size}`);
    return spinner;
  }

  render(maybeParent: HTMLElement | null): Promise<HTMLElement> {
    const element = (this.element ||= this.create());

    const { classList } = element;
    classList.forEach((token) => {
      if (token.startsWith("spinner-")) classList.remove(token);
    });

    element.classList.add(`spinner-${this.size}`);

    return super.render(maybeParent);
  }
}
