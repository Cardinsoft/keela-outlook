namespace Components {
  type CardConfig = {
    actions: CardAction[];
    footer?: Components.FixedFooter;
    header?: Components.CardHeader;
    name?: string;
    peekHeader?: Components.CardHeader;
    sections: Components.CardSection[];
    style: DisplayStyle;
  };

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card
   */
  export class Card extends CardServiceRenderableComponent {
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
}
