export const enum CacheRequestType {
  /**
   * Don't get data from cache (bypass cache) and return new request data.
   */
  none = 'none',

  /**
   * Return only cache data if exists and not outdated.
   * If cache is outdated return new request data and update cache.
   */
  cache = 'cache',

  /**
   * Return cache data if exists, also if outdated.
   * If cache is outdated complete return with new request data (and update cache).
   * Used with api.getApi() return the first cache data Promise.
   */
  forceCache = 'forceCache',

  /**
   * Return cache data if exists and not outdated.
   * Complete with new request data and update cache also if not outdated.
   * Used with api.getApi() return the first cache data Promise.
   */
  cacheReload = 'cacheReload',

  /**
   * Return cache data if exists, also if outdated.
   * Complete with new request data and update cache also not outdated.
   * Used with api.getApi() return the first cache data Promise.
   */
  forceCacheReload = 'forceCacheReload',

  /**
   * Force to reload cache also if not outdated.
   * Return only new request data.
   */
  reload = 'reload',
}
