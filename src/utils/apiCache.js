/**
 * Simple in-memory cache with TTL (time-to-live) support
 * Useful for caching API responses to reduce network requests
 */

class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate cache key from URL and params
   */
  getCacheKey(url, params = null) {
    if (!params) return url;
    const paramStr = JSON.stringify(params);
    return `${url}:${paramStr}`;
  }

  /**
   * Set a value in cache with optional TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a value from cache if it exists and hasn't expired
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Check if a key exists and is still valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear a specific cache key
   */
  clear(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
  }

  /**
   * Clear all expired entries
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const apiCache = new ApiCache();

/**
 * Wrapper function to cache API responses
 * @param {string} cacheKey - Key to store in cache
 * @param {Function} apiCall - Async function that makes the API call
 * @param {number} ttlMs - Cache TTL in milliseconds
 * @returns {Promise} Result of API call or cached value
 */
export async function getCachedResponse(cacheKey, apiCall, ttlMs = 5 * 60 * 1000) {
  // Check if value exists in cache
  const cached = apiCache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for: ${cacheKey}`);
    return cached;
  }

  // Call API and cache result
  console.log(`Cache miss for: ${cacheKey}, fetching from API`);
  const result = await apiCall();
  apiCache.set(cacheKey, result, ttlMs);
  
  return result;
}
