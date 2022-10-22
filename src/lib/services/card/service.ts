import { type AddInMenu } from "../../../menu";
import { Action } from "./actions/action";
import { AuthorizationAction } from "./actions/authorization";
import { CardAction } from "./actions/card";
import { OpenLink } from "./actions/open_link";
import { ActionResponseBuilder } from "./builders/action_response";
import { CardBuilder } from "./builders/card";
import { SuggestionsResponseBuilder } from "./builders/suggestions_response";
import { UniversalActionResponseBuilder } from "./builders/universal_action_response";
import { Attachment } from "./components/attachment";
import { AuthorizationException } from "./components/authorization_exception";
import { BorderStyle } from "./components/border_style";
import { ButtonSet } from "./components/button_set";
import { type Card } from "./components/card";
import { CardHeader } from "./components/card_header";
import { CardSection } from "./components/card_section";
import { DecoratedText } from "./components/decorated_text";
import { Divider } from "./components/divider";
import { FixedFooter } from "./components/fixed_footer";
import { Grid } from "./components/grid";
import { GridItem } from "./components/grid_item";
import { IconImage } from "./components/icon_image";
import { ImageButton } from "./components/image_button";
import { ImageComponent } from "./components/image_component";
import { ImageCropStyle } from "./components/image_crop_style";
import { KeyValue } from "./components/key_value";
import { Navigation } from "./components/navigation";
import { Notification } from "./components/notification";
import { SelectionInput } from "./components/selection_input";
import { Suggestions } from "./components/suggestions";
import { Switch } from "./components/switch";
import { TextButton } from "./components/text_button";
import { TextInput } from "./components/text_input";
import { TextParagraph } from "./components/text_paragraph";
import {
  BorderType,
  ComposedEmailType,
  DisplayStyle,
  GridItemLayout,
  HorizontalAlignment,
  Icon,
  ImageCropType,
  LoadIndicator,
  OnClose,
  OpenAs,
  SelectionInputType,
  SwitchControlType,
  TextButtonStyle,
} from "./enums";

/**
 * @see https://developers.google.com/apps-script/reference/card-service/card-service
 */
export class CardService {
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

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newactionresponsebuilder
   *
   * @summary Creates a new {@link ActionResponseBuilder}.
   */
  newActionResponseBuilder() {
    return new ActionResponseBuilder();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newattachment
   *
   * @summary Creates a new {@link Attachment}.
   */
  newAttachment() {
    return new Attachment();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newauthorizationaction
   *
   * @summary Creates a new {@link AuthorizationAction}.
   */
  newAuthorizationAction() {
    return new AuthorizationAction();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newauthorizationexception
   *
   * @summary Creates a new {@link AuthorizationException}.
   */
  newAuthorizationException() {
    return new AuthorizationException();
  }

  newBorderStyle() {
    return new BorderStyle();
  }

  newButtonSet() {
    return new ButtonSet();
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
    return new CardBuilder(this.menu);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newcardheader
   *
   * @summary Creates a new {@link CardHeader}.
   */
  newCardHeader() {
    return new CardHeader();
  }

  newCardSection() {
    return new CardSection();
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
   * @summary Creates a new {@link DecoratedText}.
   */
  newDecoratedText() {
    return new DecoratedText();
  }

  newDivider() {
    return new Divider();
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
   * @summary Creates a new {@link FixedFooter}.
   */
  newFixedFooter() {
    return new FixedFooter();
  }

  newGrid() {
    return new Grid();
  }

  newGridItem() {
    return new GridItem();
  }

  newIconImage() {
    return new IconImage();
  }

  newImage() {
    return new Image(268);
  }

  newImageButton() {
    return new ImageButton();
  }

  newImageComponent() {
    return new ImageComponent();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newimagecropstyle
   *
   * @summary Creates a new {@link ImageCropStyle}.
   */
  newImageCropStyle() {
    return new ImageCropStyle();
  }

  newKeyValue() {
    return new KeyValue();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newnavigation
   *
   * @summary Creates a new {@link Navigation}.
   */
  newNavigation() {
    const { cardStack } = this;
    return new Navigation(cardStack);
  }

  newNotification() {
    return new Notification();
  }

  newOpenLink() {
    return new OpenLink();
  }

  newSelectionInput() {
    return new SelectionInput();
  }

  newSuggestions() {
    return new Suggestions();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newsuggestionsresponsebuilder
   *
   * @summary Creates a new {@link SuggestionsResponseBuilder}.
   */
  newSuggestionsResponseBuilder() {
    return new SuggestionsResponseBuilder();
  }

  newSwitch() {
    return new Switch();
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/card-service#newtextbutton
   *
   * @summary Creates a new {@link TextButton}.
   */
  newTextButton() {
    const { secondaryColor } = this;
    return new TextButton(secondaryColor);
  }

  newTextInput() {
    return new TextInput();
  }

  newTextParagraph() {
    return new TextParagraph();
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
    return new UniversalActionResponseBuilder();
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
