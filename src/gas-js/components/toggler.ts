import { RenderableComponent } from ".";

/**
 * @summary internal component for {@link CardSection} rendering
 */
export class Toggler extends RenderableComponent {
  /**
   * @summary sets a callback to run on toggle
   * @param callback callback to run
   */
  setOnToggle(callback: (element: HTMLElement) => Promise<void>) {
    const element = (this.element ||= this.create());

    element.addEventListener("click", async () => {
      element.classList.toggle("card-section-toggler--up");
      await callback(element);
    });
  }

  create(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-section-toggler");

    const shevron = document.createElement("div");
    shevron.classList.add(
      "card-section-toggler-icon",
      "ms-Icon",
      "ms-Icon--ChevronDown",
      "pointer"
    );
    
    wrapper.append(shevron);

    return wrapper;
  }
}
