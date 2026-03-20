import {forgetPassword, resetPassword } from "../../services/authService";
import { FORGOT_REQUEST, FORGOT_SUCCESS, RESET_REQUEST, RESET_SUCCESS, FORGOT_FAILURE, RESET_FAILURE, FORGOT_RESET } from "../types/actionTypes";

export const forgotRequest = () => ({
  type: FORGOT_REQUEST,
});

export const forgotSuccess = (payload) => ({
  type: FORGOT_SUCCESS,
  payload: payload,
});

export const forgotFailure = (error) => ({
  type: FORGOT_FAILURE,
  payload: error,
});

export const resetRequest = () => ({
  type: RESET_REQUEST,
});

export const resetSuccess = (payload) => ({
  type: RESET_SUCCESS,
  payload: payload,
});

export const resetFailure = (error) => ({
  type: RESET_FAILURE,
  payload: error,
});

export const reset = () =>({
  type: FORGOT_RESET,
})

export const forgetAction = (payload) => async (dispatch) => {
  dispatch(forgotRequest());
  try {
    const res = await forgetPassword(payload);
    if (res.success) {
      dispatch(forgotSuccess(res));
    } else {
      dispatch(forgotFailure({ error: "Something went wrong!!" }));
    }
  } catch (error) {
    dispatch(forgotFailure(error.response?.data?.error ? error.response?.data?.error : error.message));
  }
};

export const resetAction = (payload) => async (dispatch) => {
  dispatch(resetRequest());
  try {
    const res = await resetPassword(payload);
    if (res && res.success) {
      dispatch(resetSuccess(res));
    } else {
      dispatch(resetFailure(res?.error || "Something went wrong!!"));
    }
  } catch (error) {
    dispatch(resetFailure(error.response?.data?.error ? error.response?.data?.error : error.message));
  }
};
