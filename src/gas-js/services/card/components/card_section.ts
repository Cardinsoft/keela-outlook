import { RenderableComponent } from "../../../../gas-js/components";
import {
  getUncollapsedHeight,
  toggleCollapsedState,
} from "../../../../gas-js/utils/collapsibility";
import { type Widget } from "./widget";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-section
 */
export class CardSection extends RenderableComponent {
  private collapsible: boolean = false;
  private header?: string;
  private numUncollapsibleWidgets: number = 0;
  private widgets: Widget[] = [];

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-section#addwidgetwidget
   *
   * @summary Adds the given widget to this section.
   * @param widget A widget to add to the section.
   */
  addWidget(widget: Widget) {
    const { widgets } = this;

    if (widgets.length === 100) {
      throw new Error("Can't add more than 100 widgets to a section");
    }

    this.widgets.push(widget);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-section#setcollapsiblecollapsible
   *
   * @summary Sets whether the section can be collapsed.
   * @param collapsible The collapsible setting.
   */
  setCollapsible(collapsible: boolean) {
    this.collapsible = collapsible;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-section#setheaderheader
   *
   * @summary Sets the header of the section. Optional.
   * @param header The header text.
   */
  setHeader(header: string) {
    this.header = header;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-section#setnumuncollapsiblewidgetsnumuncollapsiblewidgets
   *
   * @summary Sets the number of widgets that are still shown when this section is collapsed.
   * @param numUncollapsibleWidgets The number of widgets to show.
   */
  setNumUncollapsibleWidgets(numUncollapsibleWidgets: number) {
    this.numUncollapsibleWidgets = numUncollapsibleWidgets;
    return this;
  }

  create(): HTMLElement {
    const { collapsible, header, numUncollapsibleWidgets, widgets } = this;

    const wrapper = document.createElement("form");
    wrapper.classList.add("card-section");

    if (header) {
      const headerElement = document.createElement("p");
      headerElement.classList.add("ms-font-m-plus", "card-section-header");
      headerElement.textContent = header;
      wrapper.append(headerElement);
    }

    if (collapsible && widgets.length > numUncollapsibleWidgets) {
      wrapper.classList.add("collapsible");

      const toggler = document.createElement("div");
      toggler.classList.add(
        "toggler",
        "centered",
        "ms-Icon",
        "ms-Icon--ChevronDown",
        "pointer"
      );
      wrapper.append(toggler);

      const initialHeight = getUncollapsedHeight(
        wrapper,
        numUncollapsibleWidgets
      );

      wrapper.style.height = `${initialHeight}px`;

      toggler.addEventListener("click", async () => {
        toggler.classList.toggle("toggler-up");
        await toggleCollapsedState(
          toggler,
          wrapper,
          "height",
          1,
          4,
          initialHeight
        );
      });
    }

    return wrapper;
  }

  async render(parent: HTMLElement): Promise<HTMLElement> {
    const { widgets } = this;

    const element = (this.element ||= this.create());

    for (const widget of widgets) {
      await widget.render(element);
    }

    return super.render(parent);
  }
}
