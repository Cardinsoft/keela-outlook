/**
 * @see https://developers.google.com/apps-script/reference/card-service/border-type
 */
enum BorderType {
  /**
   * No border style.
   */
  NO_BORDER = "NO_BORDER",
  /**
   * Stroke border style.
   */
  STROKE = "STROKE",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/composed-email-type
 */
enum ComposedEmailType {
  /**
   * A draft that is a reply to another message. Default.
   */
  REPLY_AS_DRAFT = "REPLY_AS_DRAFT",
  /**
   * A draft that is a standalone message.
   */
  STANDALONE_DRAFT = "STANDALONE_DRAFT",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/content-type
 */
enum ContentType {
  /**
   * Indicates that the generated content is plain text. Default.
   */
  TEXT = "TEXT",
  /**
   * Indicates that the generated content is formatted as HTML. The content can be edited after it is generated.
   */
  MUTABLE_HTML = "MUTABLE_HTML",
  /**
   * Indicates that the generated content is formatted as HTML = "HTML", but this content cannot be edited after it is generated.
   */
  IMMUTABLE_HTML = "IMMUTABLE_HTML",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/display-style
 */
enum DisplayStyle {
  /**
   * Show the card header at the bottom of add-on content over existing content.
   */
  REPLACE = "REPLACE",
  /**
   * Show the card by replacing existing content.
   */
  PEEK = "PEEK",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/grid-item-layout
 */
enum GridItemLayout {
  /**
   * The title and subtitle are shown below the grid item's image.
   */
  TEXT_BELOW = "TEXT_BELOW",
  /**
   * The title and subtitle are shown above the grid item's image.
   */
  TEXT_ABOVE = "TEXT_ABOVE",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/horizontal-alignment
 */
enum HorizontalAlignment {
  /**
   * Align the widget to the start of the sentence side.
   */
  START = "START",
  /**
   * Align the widget to the center.
   */
  CENTER = "CENTER",
  /**
   * Align the widget to the end of the sentence side.
   */
  END = "END",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/icon
 */
enum Icon {
  NONE = "",
  AIRPLANE = "AIRPLANE",
  BOOKMARK = "BOOKMARK",
  BUS = "BUS",
  CAR = "CAR",
  CLOCK = "CLOCK",
  CONFIRMATION_NUMBER_ICON = "CONFIRMATION_NUMBER_ICON",
  DOLLAR = "DOLLAR",
  DESCRIPTION = "DESCRIPTION",
  EMAIL = "EMAIL",
  EVENT_PERFORMER = "EVENT_PERFORMER",
  EVENT_SEAT = "EVENT_SEAT",
  FLIGHT_ARRIVAL = "FLIGHT_ARRIVAL",
  FLIGHT_DEPARTURE = "FLIGHT_DEPARTURE",
  HOTEL = "HOTEL",
  HOTEL_ROOM_TYPE = "HOTEL_ROOM_TYPE",
  INVITE = "INVITE",
  MAP_PIN = "MAP_PIN",
  MEMBERSHIP = "MEMBERSHIP",
  MULTIPLE_PEOPLE = "MULTIPLE_PEOPLE",
  OFFER = "OFFER",
  PERSON = "PERSON",
  PHONE = "PHONE",
  RESTAURANT_ICON = "RESTAURANT_ICON",
  SHOPPING_CART = "SHOPPING_CART",
  STAR = "STAR",
  STORE = "STORE",
  TICKET = "TICKET",
  TRAIN = "TRAIN",
  VIDEO_CAMERA = "VIDEO_CAMERA",
  VIDEO_PLAY = "VIDEO_PLAY",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image-crop-type
 */
enum ImageCropType {
  /**
   * Square shape crop style.
   */
  SQUARE = "SQUARE",
  /**
   * Circle shape crop style.
   */
  CIRCLE = "CIRCLE",
  /**
   * Rectangle shape crop style with custom ratio.
   */
  RECTANGLE_CUSTOM = "RECTANGLE_CUSTOM",
  /**
   * Rectangle shape crop style with 4:3 ratio.
   */
  RECTANGLE_4_3 = "RECTANGLE_4_3",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/image-style
 */
enum ImageStyle {
  /**
   * No cropping. Default.
   */
  SQUARE = "SQUARE",
  /**
   * Crop to a circle shape.
   */
  CIRCLE = "CIRCLE",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/load-indicator
 */
enum LoadIndicator {
  /**
   * Use a spinner indicator. Default.
   */
  SPINNER = "SPINNER",
  /**
   * Do not use an indicator.
   */
  NONE = "NONE",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/on-close
 */
enum OnClose {
  /**
   * Do nothing on close. Default.
   */
  NOTHING = "NOTHING",
  /**
   * Reloads the add-on on when the window closes.
   */
  RELOAD = "RELOAD",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/open-as
 */
enum OpenAs {
  /**
   * Open in a full window or tab. Default.
   */
  FULL_SIZE = "FULL_SIZE",
  /**
   * Open as an overlay such as a pop-up.
   */
  OVERLAY = "OVERLAY",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/selection-input-type
 */
enum SelectionInputType {
  /**
   * Checkbox input style. Default.
   */
  CHECK_BOX = "CHECK_BOX",
  /**
   * Radio buton input style. At most one item in the group can be selected.
   */
  RADIO_BUTTON = "RADIO_BUTTON",
  /**
   * Dropdown menu selection input style.
   */
  DROPDOWN = "DROPDOWN",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/switch-control-type
 */
enum SwitchControlType {
  /**
   * Toggle-styled control for a switch widget. Default.
   */
  SWITCH = "SWITCH",
  /**
   * Checkbox-styled control for a switch widget.
   */
  CHECK_BOX = "CHECK_BOX",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/text-button-style
 */
enum TextButtonStyle {
  /**
   * Normal text button with clear background. Default.
   */
  TEXT = "TEXT",
  /**
   * Text button with colored background.
   */
  FILLED = "FILLED",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/update-draft-body-type
 */
enum UpdateDraftBodyType {
  /**
   * Default. Update actions insert content at the current cursor position, replacing any selected content.
   */
  IN_PLACE_INSERT = "IN_PLACE_INSERT",
  /**
   * Update actions insert content at the start of message body.
   */
  INSERT_AT_START = "INSERT_AT_START",
  /**
   * Update actions insert content at the end of the message body.
   */
  INSERT_AT_END = "INSERT_AT_END",
}
