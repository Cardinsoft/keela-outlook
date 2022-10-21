/**
 * @see https://developers.google.com/apps-script/reference/lock/lock-service
 */
class LockService {
  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getdocumentlock
   *
   * @summary Gets a lock that prevents any user of the current document from concurrently running a section of code.
   */
  static getDocumentLock() {
    return new Components.Lock(LockType.DOCUMENT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getscriptlock
   *
   * @summary Gets a lock that prevents any user from concurrently running a section of code.
   */
  static getScriptLock() {
    return new Components.Lock(LockType.SCRIPT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getuserlock
   *
   * @summary Gets a lock that prevents the current user from concurrently running a section of code.
   */
  static getUserLock() {
    return new Components.Lock(LockType.USER);
  }
}
