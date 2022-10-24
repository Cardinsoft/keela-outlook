import { CacheType } from "./enums";

/**
 * @see https://developers.google.com/apps-script/reference/cache/cache
 */
export class Cache {
  /**
   * @param storage storage to use
   * @param type cache type
   */
  constructor(private storage: Storage, private type: CacheType) {}

  /**
   * @summary gets internal storage by type
   */
  private get typedStorage(): Record<string, string> {
    const { storage, type } = this;

    const typedStorage = storage.getItem(type);
    if (!typedStorage) {
      const defaultStorage: Record<string, string> = {};
      storage.setItem(type, JSON.stringify(defaultStorage));
      return defaultStorage;
    }

    return JSON.parse(typedStorage);
  }

  /**
   * @summary sets the internal storage by type
   */
  private set typedStorage(value) {
    const { storage, type } = this;
    storage.setItem(type, JSON.stringify(value));
  }

  /**
   * @summary expires a key from cache
   * @param key key to lookup
   * @param after milliseconds to expire after
   */
  private expire(key: string, after: number) {
    setTimeout(() => this.remove(key), after);
    return this;
  }

  /**
   * @summary expires all keys from cache
   * @param after milliseconds to expire after
   */
  private expireAll(after: number) {
    setTimeout(() => {
      this.typedStorage = {};
    }, after);
    return this;
  }

  /**
   * @summary ensures the expiration time is constrained
   * @param seconds expiration time in seconds
   */
  private constrainExpiration(seconds: number) {
    return seconds < 1 ? 1 : seconds > 21600 ? 21600 : seconds;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#getkey
   *
   * @summary Gets the cached value for the given key, or null if none is found.
   * @param key the key to look up in the cache
   */
  get(key: string) {
    const { typedStorage } = this;
    return key in typedStorage ? typedStorage[key] : null;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#getallkeys
   *
   * @summary Returns a JavaScript Object containing all key/value pairs found in the cache for an array of keys.
   * @param keys the keys to lookup
   */
  getAll(keys: string[]): Record<string, string> {
    const { typedStorage } = this;

    const entries = keys
      .filter((key) => key in typedStorage)
      .map((key) => [key, typedStorage[key]]);

    return Object.fromEntries(entries);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#putkey,-value,-expirationinseconds
   *
   * @summary Adds a key/value pair to the cache.
   * @param key the key to store the value under
   * @param value the value to be cached
   * @param expirationInSeconds the maximum time the value remains in the cache, in seconds.
   */
  put(key: string, value: string, expirationInSeconds = 600) {
    const { typedStorage } = this;
    typedStorage[key] = value.toString();
    this.typedStorage = typedStorage;

    const afterSeconds = this.constrainExpiration(expirationInSeconds);

    return this.expire(key, afterSeconds * 1e3);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#putallvalues,-expirationinseconds
   *
   * @summary Adds a set of key/value pairs to the cache.
   * @param values A JavaScript Object containing string keys and values
   * @param expirationInSeconds The maximum time the value remains in the cache, in seconds
   */
  putAll(values: Record<string, string>, expirationInSeconds = 600) {
    this.typedStorage = values;
    const afterSeconds = this.constrainExpiration(expirationInSeconds);
    return this.expireAll(afterSeconds * 1e3);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#removekey
   *
   * @summary Removes an entry from the cache using the given key.
   * @param key the key to remove from the cache
   */
  remove(key: string) {
    const { typedStorage } = this;
    delete typedStorage[key];
    this.typedStorage = typedStorage;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache#removeallkeys
   *
   * @summary Removes a set of entries from the cache.
   * @param keys the array of keys to remove
   */
  removeAll(keys: string[]) {
    const { typedStorage } = this;
    keys.forEach((key) => delete typedStorage[key]);
    this.typedStorage = typedStorage;
    return this;
  }
}
