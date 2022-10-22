/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-service
 */
class CardService {
  BorderType = BorderType;
  ComposedEmailType = ComposedEmailType;
  DisplayStyle = DisplayStyle;
  GridItemLayout = GridItemLayout;
  HorizontalAlignment = HorizontalAlignment;
  Icon = Icon;
  ImageCropType = ImageCropType;
  LoadIndicator = LoadIndicator;
  OnClose = OnClose;
  OpenAs = OpenAs;
  SelectionInputType = SelectionInputType;
  SwitchControlType = SwitchControlType;
  TextButtonStyle = TextButtonStyle;

  cardStack: Card[] = [];

  constructor(
    protected primaryColor: string,
    private secondaryColor: string,
    private menu: AddInMenu
  ) {}

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newaction
   *
   * @summary Creates a new {@link Action}.
   */
  newAction() {
    return new Action();
  }

  newActionResponseBuilder() {
    return new ActionResponseBuilder(new Components.ActionResponse());
  }

  newAttachment() {
    return new Components.Attachment();
  }

  newAuthorizationAction() {
    return new AuthorizationAction();
  }

  newAuthorizationException() {
    return new Components.AuthorizationException();
  }

  newBorderStyle() {
    return new Components.BorderStyle();
  }

  newButtonSet() {
    return new Components.ButtonSet();
  }

  newCalendarEventActionResponseBuilder() {
    // TODO: future releases
  }

  newCardAction() {
    return new CardAction();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newcardbuilder
   *
   * @summary Creates a new {@link CardBuilder}.
   */
  newCardBuilder() {
    return new CardBuilder(new Card(this.menu));
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newcardheader
   *
   * @summary Creates a new {@link Components.CardHeader}.
   */
  newCardHeader() {
    return new Components.CardHeader();
  }

  newCardSection() {
    return new Components.CardSection();
  }

  newComposeActionResponseBuilder() {
    // TODO: future releases
  }

  newDatePicker() {
    // TODO: future releases
  }

  newDateTimePicker() {
    // TODO: future releases
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newdecoratedtext
   *
   * @summary Creates a new {@link Components.DecoratedText}.
   */
  newDecoratedText() {
    return new Components.DecoratedText();
  }

  newDivider() {
    return new Components.Divider();
  }

  newDriveItemsSelectedActionResponseBuilder() {
    // TODO: future releases
  }

  newEditorFileScopeActionResponseBuilder() {
    // TODO: future releases
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newfixedfooter
   *
   * @summary Creates a new {@link Components.FixedFooter}.
   */
  newFixedFooter() {
    return new Components.FixedFooter();
  }

  newGrid() {
    return new Components.Grid();
  }

  newGridItem() {
    return new Components.GridItem();
  }

  newIconImage() {
    return new Components.IconImage();
  }

  newImage() {
    return new Components.Image(268);
  }

  newImageButton() {
    return new Components.ImageButton();
  }

  newImageComponent() {
    return new Components.ImageComponent();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newimagecropstyle
   *
   * @summary Creates a new {@link Components.ImageCropStyle}.
   */
  newImageCropStyle() {
    return new Components.ImageCropStyle();
  }

  newKeyValue() {
    return new Components.KeyValue();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newnavigation
   *
   * @summary Creates a new {@link Navigation}.
   */
  newNavigation() {
    const { cardStack } = this;
    return new Components.Navigation(cardStack);
  }

  newNotification() {
    return new Components.Notification();
  }

  newOpenLink() {
    return new Components.OpenLink();
  }

  newSelectionInput() {
    return new Components.SelectionInput();
  }

  newSuggestions() {
    return new Components.Suggestions();
  }

  newSuggestionsResponseBuilder() {
    return new SuggestionsResponseBuilder(new Components.SuggestionsResponse());
  }

  newSwitch() {
    return new Components.Switch();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newtextbutton
   *
   * @summary Creates a new {@link Components.TextButton}.
   */
  newTextButton() {
    const { secondaryColor } = this;
    return new Components.TextButton(secondaryColor);
  }

  newTextInput() {
    return new Components.TextInput();
  }

  newTextParagraph() {
    return new Components.TextParagraph();
  }

  newTimePicker() {
    // TODO: future releases
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newuniversalactionresponsebuilder
   *
   * @summary Creates a new {@link UniversalActionResponseBuilder}.
   */
  newUniversalActionResponseBuilder() {
    return new UniversalActionResponseBuilder(
      new Components.UniversalActionResponse()
    );
  }

  newUpdateDraftActionResponseBuilder() {
    // TODO: future releases
  }

  newUpdateDraftBccRecipientsAction() {
    // TODO: future releases
  }

  newUpdateDraftBodyAction() {
    // TODO: future releases
  }

  newUpdateDraftCcRecipientsAction() {
    // TODO: future releases
  }

  newUpdateDraftSubjectAction() {
    // TODO: future releases
  }

  newUpdateDraftToRecipientsAction() {
    // TODO: future releases
  }
}
