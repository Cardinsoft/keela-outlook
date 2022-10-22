import { RenderableComponent } from "../../../../component.js";
import { type AddInMenu } from "../../../../menu.js";
import { type CardAction } from "../actions/card.js";
import { DisplayStyle } from "../enums.js";
import { type CardHeader } from "./card_header.js";
import { type CardSection } from "./card_section.js";
import { type FixedFooter } from "./fixed_footer.js";

export type CardConfig = {
  actions: CardAction[];
  footer?: FixedFooter;
  header?: CardHeader;
  name?: string;
  peekHeader?: CardHeader;
  sections: CardSection[];
  style: DisplayStyle;
};

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card
 */
export class Card extends RenderableComponent {
  get name() {
    return this.config.name;
  }

  constructor(private menu: AddInMenu, private config: CardConfig) {
    super();
  }

  create(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("Card");
    return wrapper;
  }

  async render(parent: HTMLElement | null): Promise<HTMLElement> {
    const { menu } = this;

    const { actions, footer, header, peekHeader, sections, style } =
      this.config;

    if (peekHeader || style === DisplayStyle.PEEK) {
      // TODO: future releases
      throw new Error("peek cards are not implemented");
    }

    menu.clear("card");
    actions.forEach((action) => menu.addCardAction(action));
    await menu.render(document.getElementById("app-menu"));

    const element = (this.element ||= this.create());

    if (header) {
      await header.render(element);
    }

    const shouldSeparate = sections.length > 1;
    for (const section of sections) {
      const sectionElement = await section.render(element);
      sectionElement.classList.toggle("separated", shouldSeparate);
    }

    if (footer) {
      await footer.render(element);
    }

    return super.render(parent);
  }
}
