import http, { createCancelTokenSource } from "./apiService";

const usersUrl = "/api/v1/users/";

export const cancelToken = createCancelTokenSource;

export const getUsers = async (cancelToken) => {
  return http.get(usersUrl, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const getUser = async (id, cancelToken) => {
  return http.get(usersUrl + id, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const updateUser = async (id, payload, cancelToken) => {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    formData.append(key, payload[key]);
  });
  return http.put(usersUrl + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};
