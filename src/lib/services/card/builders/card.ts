import { AddInMenu } from "../../../../menu.js";
import { type CardAction } from "../actions/card.js";
import { Card } from "../components/card.js";
import { type CardHeader } from "../components/card_header.js";
import { CardSection } from "../components/card_section.js";
import { type FixedFooter } from "../components/fixed_footer.js";
import { DisplayStyle } from "../enums.js";
import { CardServiceBuilder } from "./index.js";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-builder
 */
export class CardBuilder extends CardServiceBuilder<Card> {
  private actions: CardAction[] = [];
  private footer?: FixedFooter;
  private header?: CardHeader;
  private name?: string;
  private peekHeader?: CardHeader;
  private sections: CardSection[] = [];
  private style: DisplayStyle = DisplayStyle.REPLACE;

  constructor(private menu: AddInMenu) {
    super();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#addcardactioncardaction
   *
   * @summary Adds a {@link CardAction} to this {@link Card}.
   * @param cardAction The {@link CardAction} to use.
   */
  addCardAction(cardAction: CardAction) {
    this.actions.push(cardAction);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#addsectionsection
   *
   * @summary Adds a section to this {@link Card}.
   * @param section The {@link CardSection} to use.
   */
  addSection(section: CardSection) {
    const { sections } = this;

    if (sections.length === 100) {
      throw new Error("Can't add more than 100 sections to a card");
    }

    sections.push(section);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#build()
   *
   * @summary Builds the current {@link Card} and validates it.
   */
  build() {
    const card = new Card(this.menu, {
      actions: this.actions,
      footer: this.footer,
      header: this.header,
      name: this.name,
      peekHeader: this.peekHeader,
      sections: this.sections,
      style: this.style,
    });

    super.build(card);

    return card;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setdisplaystyledisplaystyle
   *
   * @summary Sets the display style for this {@link Card}.
   * @param displayStyle The {@link DisplayStyle} to set.
   */
  setDisplayStyle(displayStyle: DisplayStyle) {
    this.style = displayStyle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setfixedfooterfixedfooter
   *
   * @summary Sets a fixed footer for this {@link Card}.
   * @param fixedFooter The {@link FixedFooter} to use.
   */
  setFixedFooter(fixedFooter: FixedFooter) {
    this.footer = fixedFooter;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setheadercardheader
   *
   * @summary Sets the header for this {@link Card}.
   * @param cardHeader The {@link CardHeader} to use.
   */
  setHeader(cardHeader: CardHeader) {
    this.header = cardHeader;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setName(String)
   *
   * @summary Sets the name for this {@link Card}.
   * @param name The name.
   */
  setName(name: string) {
    this.name = name;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setpeekcardheaderpeekcardheader
   *
   * @summary Sets the peek card header.
   * @param peekCardHeader The {@link CardHeader} to set.
   */
  setPeekCardHeader(peekCardHeader: CardHeader) {
    this.peekHeader = peekCardHeader;
    return this;
  }

  /**
   * @summary validates the {@link Card}
   */
  protected validate() {
    // TODO: handle
    return true;
  }
}
