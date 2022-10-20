/**
 * @see https://developers.google.com/apps-script/reference/base/user
 */
class User {
  constructor(private item: Office.UserProfile) {}

  /**
   * @see https://developers.google.com/apps-script/reference/base/user#getemail
   *
   * @summary Gets the user's email address, if available.
   */
  getEmail() {
    return this.item.emailAddress;
  }
}
