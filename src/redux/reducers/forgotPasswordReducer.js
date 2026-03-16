// authReducer.js
import { FORGOT_REQUEST, FORGOT_SUCCESS, RESET_REQUEST, RESET_SUCCESS, FORGOT_FAILURE, RESET_FAILURE, FORGOT_RESET } from "../types/actionTypes";

const initialState = {
  loading: false,
  error: null,
  emailSent: false,
  resetDone: false,
};

const forgotPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGOT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FORGOT_SUCCESS:
      return {
        ...state,
        emailSent: true,
        loading: false,
        error: null,
      };
    case FORGOT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case RESET_SUCCESS:
      return {
        ...state,
        loading: false,
        resetDone: true,
        error: null,
      };
    case RESET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FORGOT_RESET:
      return {
        loading: false,
        error: null,
        emailSent: false,
        resetDone: false,
      };
    default:
      return state;
  }
};

export default forgotPasswordReducer;
