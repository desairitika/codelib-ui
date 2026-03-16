import http from "./apiService";

const commentUrl = "/api/v1/comments/"; // we will append id for specific comment operations

// Fetch comments for a given solution
export const getCommentsForSolution = async (solutionId, cancelToken) => {
  return http.get(`/api/v1/solutions/${solutionId}/comments`, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

// post new comment under a solution
export const addCommentToSolution = async (solutionId, payload, cancelToken) => {
  return http.post(`/api/v1/solutions/${solutionId}/comments`, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

// edit or delete operations if needed
export const updateComment = async (commentId, payload, cancelToken) => {
  return http.put(commentUrl + commentId, payload, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};

export const deleteComment = async (commentId, cancelToken) => {
  return http.delete(commentUrl + commentId, {
    ...(cancelToken && { cancelToken: cancelToken.token }),
  });
};
