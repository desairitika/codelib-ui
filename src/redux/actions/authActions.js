import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_RESET, LOGOUT_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, VALIDATE_TOKEN_SUCCESS, INITIAL_AUTH_CHECK_COMPLETE } from "../types/actionTypes";
import { login, validate, logout } from "../../services/authService";
import { setToken, removeItem } from "../../utils/TokenUtil";

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload: payload,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const loginReset = () => ({
  type: LOGIN_RESET,
  payload: {},
});

export const validateTokenSuccess = (payload) => ({
  type: VALIDATE_TOKEN_SUCCESS,
  payload: payload,
});

export const initialAuthCheckComplete = () => ({
  type: INITIAL_AUTH_CHECK_COMPLETE,
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const logoutSuccess = (payload) => ({
  type: LOGOUT_SUCCESS,
  payload: payload,
});

export const logoutFailure = (error) => ({
  type: LOGOUT_FAILURE,
  payload: error,
});

// validateAction checks the current token (attached by interceptor) with the server
// and updates auth state accordingly. It does not need to be passed a token; http
// interceptor will read it from storage automatically.
export const validateAction = () => async (dispatch) => {
  try {
    const res = await validate();
    if (res?.user) {
      // validateTokenSuccess will store the user information and token without showing login toast
      dispatch(validateTokenSuccess(res?.user));
    } else {
      dispatch(loginFailure("User not authenticated"));
    }
  } catch (error) {
    console.error(error);
    dispatch(loginFailure(error.response?.data?.error ? error.response?.data?.error : error.message));
    // ensure token (if any) is cleared and state is reset
    dispatch(logoutAction());
  }
  // Mark initial auth check as complete regardless of result
  dispatch(initialAuthCheckComplete());
};

export const loginAction = (email, username, password, remember) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await login({ email, username, password, remember });
    if (res?.user?.token) {
      setToken(res?.user?.token, remember);
      dispatch(loginSuccess(res?.user));
    } else {
      dispatch(loginFailure("Invalid credentials"));
    }
  } catch (error) {
    console.error(error);
    dispatch(loginFailure(error.response?.data?.error ? error.response?.data?.error : error.message));
  }
};

export const logoutAction = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    const res = await logout();
    if (res) {
      dispatch(logoutSuccess());
    }
  } catch (error) {
    console.error(error);
    dispatch(logoutFailure());
  }
  removeItem("token", true);
};
