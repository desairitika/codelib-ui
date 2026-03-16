import { register } from "../../services/authService";
import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, REGISTER_RESET } from "../types/actionTypes";

export const registerRequest = (userData) => ({
  type: REGISTER_REQUEST,
  payload: userData,
});

export const registerSuccess = (response) => ({
  type: REGISTER_SUCCESS,
  payload: response,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const registerReset = () => ({
  type: REGISTER_RESET,
  payload: {},
});

export const RegisterAction = (payload) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await register(payload);
    if (res?.user?.username) {
      dispatch(registerSuccess(res));
    } else {
      dispatch(registerFailure({ error: "Something went wrong!!" }));
    }
  } catch (error) {
    dispatch(registerFailure(error.response?.data?.error ? error.response?.data?.error : error.response?.data?.error ? error.response?.data?.error : error.message));
  }
};
