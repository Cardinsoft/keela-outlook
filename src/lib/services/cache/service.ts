enum CacheType {
  DOCUMENT = "document",
  SCRIPT = "script",
  USER = "user",
}

/**
 * @see https://developers.google.com/apps-script/reference/cache/cache-service
 */
class CacheService {
  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache-service#getdocumentcache
   *
   * @summary Gets the cache instance scoped to the current document and script.
   */
  getDocumentCache() {
    const { localStorage } = window;
    return new Components.Cache(localStorage, CacheType.DOCUMENT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache-service#getscriptcache
   *
   * @summary Gets the cache instance scoped to the script.
   */
  getScriptCache() {
    const { localStorage } = window;
    return new Components.Cache(localStorage, CacheType.SCRIPT);
  }

  /**
   * @see https://developers.google.com/apps-script/reference/cache/cache-service#getusercache
   *
   * @summary Gets the cache instance scoped to the current user and script.
   */
  getUserCache() {
    const { localStorage } = window;
    return new Components.Cache(localStorage, CacheType.USER);
  }
}
