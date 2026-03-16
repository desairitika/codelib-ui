import http, { createCancelTokenSource, publicGet } from "./apiService";
import { getCachedResponse, apiCache } from "../utils/apiCache";

const constantsUrl = "/api/v1/constants";

export const cancelToken = createCancelTokenSource;

export const getConstants = async (cancelToken) => {
  // Use cache to avoid repeated requests
  return getCachedResponse(
    `${constantsUrl}:all`,
    async () => {
      return publicGet(constantsUrl, {
        ...(cancelToken && { cancelToken: cancelToken.token }),
      });
    },
    10 * 60 * 1000 // Cache for 10 minutes
  );
};

/**
 * Force refresh constants from API (bypasses cache)
 */
export const refreshConstants = async (cancelToken) => {
  // Clear cache before fetching fresh data
  apiCache.clear(`${constantsUrl}:all`);
  return publicGet(constantsUrl, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const createConstant = async (payload, cancelToken) => {
  // Clear cache when creating new constant
  apiCache.clear(`${constantsUrl}:all`);
  return http.post(constantsUrl, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};
