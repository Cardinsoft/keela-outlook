/**
 * @see https://developers.google.com/apps-script/reference/card-service/border-type
 */
enum BorderType {
  /**
   * No border style.
   */
  NO_BORDER,
  /**
   * Stroke border style.
   */
  STROKE,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/composed-email-type
 */
enum ComposedEmailType {
  /**
   * A draft that is a reply to another message. Default.
   */
  REPLY_AS_DRAFT,
  /**
   * A draft that is a standalone message.
   */
  STANDALONE_DRAFT,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/switch-control-type
 */
enum SwitchControlType {
  /**
   * Toggle-styled control for a switch widget. Default.
   */
  SWITCH,
  /**
   * Checkbox-styled control for a switch widget.
   */
  CHECK_BOX,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/display-style
 */
enum DisplayStyle {
  /**
   * Show the card header at the bottom of add-on content over existing content.
   */
  REPLACE,
  /**
   * Show the card by replacing existing content.
   */
  PEEK,
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
 * @see https://developers.google.com/apps-script/reference/card-service/image-style
 */
enum ImageStyle {
  /**
   * No cropping. Default.
   */
  SQUARE = "square",
  /**
   * Crop to a circle shape.
   */
  CIRCLE = "circle",
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/load-indicator
 */
enum LoadIndicator {
  /**
   * Use a spinner indicator. Default.
   */
  SPINNER,
  /**
   * Do not use an indicator.
   */
  NONE,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/on-close
 */
enum OnClose {
  /**
   * Do nothing on close. Default.
   */
  NOTHING,
  /**
   * Reloads the add-on on when the window closes.
   */
  RELOAD,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/open-as
 */
enum OpenAs {
  /**
   * Open in a full window or tab. Default.
   */
  FULL_SIZE,
  /**
   * Open as an overlay such as a pop-up.
   */
  OVERLAY,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/selection-input-type
 */
enum SelectionInputType {
  /**
   * Checkbox input style. Default.
   */
  CHECK_BOX,
  /**
   * Radio buton input style. At most one item in the group can be selected.
   */
  RADIO_BUTTON,
  /**
   * Dropdown menu selection input style.
   */
  DROPDOWN,
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/text-button-style
 */
enum TextButtonStyle {
  /**
   * Normal text button with clear background. Default.
   */
  TEXT,
  /**
   * Text button with colored background.
   */
  FILLED,
}
