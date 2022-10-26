import { RenderableComponent } from ".";

type ToggleCallback = (element: HTMLElement, toggler: Toggler) => Promise<void>;

/**
 * @summary internal component for {@link CardSection} rendering
 */
export class Toggler extends RenderableComponent {
  private toggleCallback?: ToggleCallback;

  /**
   * @param collapsed initial toggle state
   */
  constructor(public collapsed: boolean) {
    super();
  }

  /**
   * @summary sets a callback to run on toggle
   * @param callback callback to run
   */
  setOnToggle(callback: ToggleCallback) {
    this.toggleCallback = callback;
    return this;
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

    shevron.addEventListener("click", async () => {
      shevron.classList.toggle("card-section-toggler--up");
      this.collapsed = !this.collapsed;
      await this.toggleCallback?.(wrapper, this);
    });

    wrapper.append(shevron);

    return wrapper;
  }
}
