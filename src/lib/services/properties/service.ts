enum PropertiesStoreType {
  DOCUMENT = "document",
  SCRIPT = "script",
  USER = "user",
}

/**
 * @see https://developers.google.com/apps-script/reference/properties/properties-service
 */
class PropertiesService {
  /**
   * @see https://developers.google.com/apps-script/reference/properties/properties-service#getdocumentproperties
   *
   * @summary Gets a property store (for this script only) that all users can access within the open document, spreadsheet, or form.
   */
  getDocumentProperties() {
    return new Components.Properties(
      Office.context.roamingSettings,
      PropertiesStoreType.DOCUMENT
    );
  }

  /**
   * @see https://developers.google.com/apps-script/reference/properties/properties-service#getscriptproperties
   *
   * @summary Gets a property store that all users can access, but only within this script.
   */
  getScriptProperties() {
    return new Components.Properties(
      Office.context.roamingSettings,
      PropertiesStoreType.SCRIPT
    );
  }

  /**
   * @see https://developers.google.com/apps-script/reference/properties/properties-service#getuserproperties
   *
   * @summary Gets a property store that only the current user can access, and only within this script.
   */
  getUserProperties() {
    return new Components.Properties(
      Office.context.roamingSettings,
      PropertiesStoreType.USER
    );
  }
}
