import { Lock } from "./components/lock.js";
import { LockType } from "./enums.js";

/**
 * @see https://developers.google.com/apps-script/reference/lock/lock-service
 */
export class LockService {
  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getdocumentlock
   *
   * @summary Gets a lock that prevents any user of the current document from concurrently running a section of code.
   */
  getDocumentLock() {
    return new Lock(LockType.DOCUMENT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getscriptlock
   *
   * @summary Gets a lock that prevents any user from concurrently running a section of code.
   */
  getScriptLock() {
    return new Lock(LockType.SCRIPT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getuserlock
   *
   * @summary Gets a lock that prevents the current user from concurrently running a section of code.
   */
  getUserLock() {
    return new Lock(LockType.USER);
  }
}
