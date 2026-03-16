import http, { createCancelTokenSource } from "./apiService";

const problemsUrl = "/api/v1/problems/";

export const cancelToken = createCancelTokenSource;

export const createProblem = async (payload, cancelToken) => {
  return http.post(problemsUrl, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const updateProblem = async (id, payload, cancelToken) => {
  return http.put(problemsUrl + id, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const deleteProblem = async (payload, cancelToken) => {
  return http.delete(problemsUrl + payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const getProblems = async (cancelToken) => {
  return http.get(problemsUrl, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const getFilteredProblems = async (payload, page = 1, limit = 10, cancelToken) => {
  const updatedPayload = {
    ...payload,
    page,
    limit,
  };

  return http.post(problemsUrl + "filter", updatedPayload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const getTemplate = async (cancelToken) => {
  return http.get(problemsUrl + "download-template", {
    responseType: "blob",
    ...(cancelToken && { cancelToken: cancelToken.token }),
    suppressGlobalErrorToast: true,
  });
};

export const uploadTemplate = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return http.post(problemsUrl + "upload-template", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    suppressGlobalErrorToast: true,
  });
};

export const getDashboardStats = async ()=>{
  return http.get(problemsUrl + "dashboardStats", { suppressGlobalErrorToast: true })
}
