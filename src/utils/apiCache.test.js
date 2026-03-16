import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiCache, getCachedResponse } from "../utils/apiCache";

describe("apiCache", () => {
  beforeEach(() => {
    apiCache.clearAll();
  });

  describe("set and get", () => {
    it("should store and retrieve a value", () => {
      const key = "test-key";
      const value = { data: "test" };

      apiCache.set(key, value);
      const result = apiCache.get(key);

      expect(result).toEqual(value);
    });

    it("should return null for non-existent key", () => {
      const result = apiCache.get("non-existent");
      expect(result).toBeNull();
    });

    it("should return null for expired entry", async () => {
      const key = "expire-test";
      const value = { data: "test" };

      // Set with 100ms TTL
      apiCache.set(key, value, 100);

      // Should exist immediately
      expect(apiCache.get(key)).toEqual(value);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be null after expiration
      expect(apiCache.get(key)).toBeNull();
    });
  });

  describe("has", () => {
    it("should return true for existing valid entry", () => {
      const key = "exists";
      apiCache.set(key, { data: "test" });

      expect(apiCache.has(key)).toBe(true);
    });

    it("should return false for non-existent entry", () => {
      expect(apiCache.has("non-existent")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should remove specific cache entry", () => {
      const key = "to-remove";
      apiCache.set(key, { data: "test" });

      expect(apiCache.has(key)).toBe(true);

      apiCache.clear(key);

      expect(apiCache.has(key)).toBe(false);
    });

    it("should not affect other entries", () => {
      apiCache.set("key1", { data: 1 });
      apiCache.set("key2", { data: 2 });

      apiCache.clear("key1");

      expect(apiCache.has("key1")).toBe(false);
      expect(apiCache.has("key2")).toBe(true);
    });
  });

  describe("clearAll", () => {
    it("should remove all cache entries", () => {
      apiCache.set("key1", { data: 1 });
      apiCache.set("key2", { data: 2 });
      apiCache.set("key3", { data: 3 });

      apiCache.clearAll();

      expect(apiCache.has("key1")).toBe(false);
      expect(apiCache.has("key2")).toBe(false);
      expect(apiCache.has("key3")).toBe(false);
    });
  });

  describe("getCachedResponse", () => {
    it("should call API function and cache result on first call", async () => {
      const mockApiCall = vi.fn(async () => ({
        data: "test",
      }));

      const result = await getCachedResponse("test-key", mockApiCall, 10000);

      expect(mockApiCall).toHaveBeenCalledOnce();
      expect(result.data).toBe("test");
    });

    it("should return cached value on subsequent calls", async () => {
      const mockApiCall = vi.fn(async () => ({
        data: "test",
      }));

      const cacheKey = "cached-key";

      // First call
      const result1 = await getCachedResponse(cacheKey, mockApiCall, 10000);

      // Second call
      const result2 = await getCachedResponse(cacheKey, mockApiCall, 10000);

      expect(mockApiCall).toHaveBeenCalledOnce(); // Only called once
      expect(result1).toEqual(result2);
    });

    it("should respect custom TTL", async () => {
      const mockApiCall = vi.fn(async () => ({
        data: "test",
      }));

      const cacheKey = "ttl-test";

      // First call with 100ms TTL
      await getCachedResponse(cacheKey, mockApiCall, 100);
      expect(mockApiCall).toHaveBeenCalledTimes(1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Second call after expiration should call API again
      await getCachedResponse(cacheKey, mockApiCall, 100);
      expect(mockApiCall).toHaveBeenCalledTimes(2);
    });

    it("should reject on API error", async () => {
      const apiError = new Error("API failed");
      const mockApiCall = vi.fn(async () => {
        throw apiError;
      });

      await expect(getCachedResponse("error-key", mockApiCall)).rejects.toThrow(
        "API failed"
      );
    });
  });
});
