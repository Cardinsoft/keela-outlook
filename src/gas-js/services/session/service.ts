import { getProfile } from "../../utils/office";
import { User } from "./components/user";

/**
 * @see https://developers.google.com/apps-script/reference/base/session
 */
export class Session {
  /**
   * @see https://developers.google.com/apps-script/reference/base/session#getactiveuser
   *
   * @summary Gets information about the current user.
   */
  getActiveUser() {
    return new User(getProfile());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/session#getactiveuserlocale
   *
   * @summary Gets the language setting of the current user as a string—for example, en for English.
   */
  getActiveUserLocale() {
    return Office.context.displayLanguage || "en";
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/session#geteffectiveuser
   *
   * @summary Gets information about the user under whose authority the script is running.
   */
  getEffectiveUser() {
    return new User(getProfile());
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/session#getscripttimezone
   *
   * @summary Gets the time zone of the script.
   */
  getScriptTimeZone() {
    return getProfile().timeZone;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/session#gettemporaryactiveuserkey
   *
   * @summary Gets a temporary key that is unique to the active user but does not reveal the user identity.
   */
  getTemporaryActiveUserKey() {
    const { displayName, emailAddress, accountType } = getProfile();
    return btoa(`${displayName}-${emailAddress}-${accountType}`);
  }
}
