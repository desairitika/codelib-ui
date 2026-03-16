import { ADD_TOAST } from "../types/actionTypes";

export const addToast = (payload) => ({
  type: ADD_TOAST,
  payload: payload,
});

export const AddToastAction = (payload) => async (dispatch) => {
  try {
    dispatch(addToast(payload));
  } catch (error) {
    console.error(error.response?.data?.error ? error.response?.data?.error : error.message);
  }
};
