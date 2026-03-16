export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const setToken = (token, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
};

export const removeItem = (key, both) => {
  if (both) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};
