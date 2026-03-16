import http, { createCancelTokenSource } from "./apiService";

const solutionUrl = "/api/v1/solutions/";

export const cancelToken = createCancelTokenSource;

export const createSolution = async (payload, cancelToken) => {
  return http.post(solutionUrl, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const getSolution = async (id, cancelToken) => {
  return http.get(solutionUrl + id, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const updateSolution = async (id, payload, cancelToken) => {
  return http.put(solutionUrl + id, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};
