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
