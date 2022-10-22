import { LockType } from "../enums.js";

const locks: Record<LockType, boolean> = {
  [LockType.DOCUMENT]: false,
  [LockType.SCRIPT]: false,
  [LockType.USER]: false,
};

/**
 * @see https://developers.google.com/apps-script/reference/lock/lock
 */
export class Lock {
  constructor(private type: LockType) {}

  private locked: boolean = false;

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock#haslock
   *
   * @summary Returns true if the lock was acquired.
   */
  hasLock() {
    return this.locked;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock#releaselock
   *
   * @summary Releases the lock, allowing other processes waiting on the lock to continue.
   */
  releaseLock() {
    const { type } = this;
    locks[type] = false;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock#trylocktimeoutinmillis
   *
   * @summary Attempts to acquire the lock, timing out after the provided number of milliseconds.
   * @param timeoutInMillis how long to wait to acquire the lock, in milliseconds
   */
  tryLock(timeoutInMillis: number) {
    return new Promise<boolean>(async (resolve) => {
      const { type } = this;

      if (!locks[type]) {
        locks[type] = true;
        resolve(true);
      }

      const interval = setInterval(() => {
        if (!locks[type]) {
          locks[type] = true;
          clearInterval(interval);
          resolve(true);
        }
      });

      await new Promise((r) => setTimeout(r, timeoutInMillis));

      resolve(false);
    });
  }

  /**
   * @see https://developers.google.com/apps-script/reference/lock/lock#waitlocktimeoutinmillis
   *
   * @summary Attempts to acquire the lock, timing out with an exception after the provided number of milliseconds.
   * @param timeoutInMillis how long to wait to acquire the lock, in milliseconds
   */
  async waitLock(timeoutInMillis: number) {
    return new Promise<void>(async (resolve, reject) => {
      const { type } = this;

      if (!locks[type]) {
        locks[type] = true;
        resolve();
      }

      const interval = setInterval(() => {
        if (!locks[type]) {
          locks[type] = true;
          clearInterval(interval);
          resolve();
        }
      });

      await new Promise((r) => setTimeout(r, timeoutInMillis));

      reject(new Error("failed to acquire the lock"));
    });
  }
}
