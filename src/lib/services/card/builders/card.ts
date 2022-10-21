/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-builder
 */
class CardBuilder extends CardServiceBuilder<Card> {
  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#addcardactioncardaction
   *
   * @summary Adds a {@link CardAction} to this {@link Card}.
   * @param cardAction The {@link CardAction} to use.
   */
  addCardAction(cardAction: CardAction) {
    this.item.actions.push(cardAction);
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#addsectionsection
   *
   * @summary Adds a section to this {@link Card}.
   * @param section The {@link Components.CardSection} to use.
   */
  addSection(section: Components.CardSection) {
    const { sections } = this.item;

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
    if (!this.validate()) {
      throw new Error("Invalid card");
    }

    return this.item;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setdisplaystyledisplaystyle
   *
   * @summary Sets the display style for this {@link Card}.
   * @param displayStyle The {@link DisplayStyle} to set.
   */
  setDisplayStyle(displayStyle: DisplayStyle) {
    this.item.style = displayStyle;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setfixedfooterfixedfooter
   *
   * @summary Sets a fixed footer for this {@link Card}.
   * @param fixedFooter The {@link Components.FixedFooter} to use.
   */
  setFixedFooter(fixedFooter: Components.FixedFooter) {
    this.item.footer = fixedFooter;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setheadercardheader
   *
   * @summary Sets the header for this {@link Card}.
   * @param cardHeader The {@link Components.CardHeader} to use.
   */
  setHeader(cardHeader: Components.CardHeader) {
    this.item.header = cardHeader;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setName(String)
   *
   * @summary Sets the name for this {@link Card}.
   * @param name The name.
   */
  setName(name: string) {
    this.item.name = name;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-builder#setpeekcardheaderpeekcardheader
   *
   * @summary Sets the peek card header.
   * @param peekCardHeader The {@link Components.CardHeader} to set.
   */
  setPeekCardHeader(peekCardHeader: Components.CardHeader) {
    this.item.peekHeader = peekCardHeader;
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
