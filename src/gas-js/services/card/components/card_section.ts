import { RenderableComponent } from "../../../../gas-js/components";
import { getUncollapsedHeight } from "../../../../gas-js/utils/collapsibility";
import { Toggler } from "../../../components/toggler";
import { type Widget } from "./widget";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-section
 */
export class CardSection extends RenderableComponent {
  private collapsible: boolean = false;
  private header?: string;
  private numUncollapsibleWidgets: number = 0;
  private toggler: Toggler = new Toggler(true);
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
    const { collapsible, header, numUncollapsibleWidgets, toggler, widgets } =
      this;

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

      toggler.setOnToggle(async (_togglerElement, { collapsed }) => {
        const height = getUncollapsedHeight(
          wrapper,
          collapsed ? numUncollapsibleWidgets : widgets.length
        );

        wrapper.style.height = `${height}px`;
      });

      wrapper.addEventListener("collapse", () => {
        const height = getUncollapsedHeight(wrapper, numUncollapsibleWidgets);
        wrapper.style.height = `${height}px`;
      });
    }

    return wrapper;
  }

  async render(parent: HTMLElement): Promise<HTMLElement> {
    const { collapsible, toggler, widgets } = this;

    const element = (this.element ||= this.create());

    for (const widget of widgets) {
      await widget.render(element);
    }

    await super.render(parent);

    if (collapsible) {
      await toggler.render(parent);
    }

    return element;
  }
}
