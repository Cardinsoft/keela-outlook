import { RenderableComponent } from ".";

/**
 * @summary internal component for {@link CardSection} rendering
 */
export class Toggler extends RenderableComponent {
  /**
   * @summary sets a callback to run on toggle
   * @param callback callback to run
   */
  setOnToggle(callback: (element: HTMLElement) => void) {
    const element = (this.element ||= this.create());

    element.addEventListener("click", async () => {
      callback(element);
      element.classList.toggle("toggler-up");
    });
  }

  create(): HTMLElement {
    const toggler = document.createElement("div");

    toggler.classList.add(
      "toggler",
      "centered",
      "ms-Icon",
      "ms-Icon--ChevronDown",
      "pointer"
    );

    return toggler;
  }
}
