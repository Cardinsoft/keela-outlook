/**
 * @see https://developers.google.com/apps-script/reference/card-service/card
 */
class Card extends CardServiceRenderableComponent {
  name?: string;

  private actions: CardAction[] = [];
  private footer?: Components.FixedFooter;
  private header?: Components.CardHeader;
  private peekHeader?: Components.CardHeader;
  private sections: Components.CardSection[] = [];
  private style: DisplayStyle = DisplayStyle.REPLACE;

  constructor(private menu: AddInMenu) {
    super();
  }

  create(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("Card");
    return wrapper;
  }

  async render(parent: HTMLElement | null): Promise<HTMLElement> {
    const { actions, footer, header, menu, peekHeader, sections, style } = this;

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
