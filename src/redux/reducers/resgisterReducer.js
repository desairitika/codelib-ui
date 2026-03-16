// authReducer.js
import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, REGISTER_RESET } from "../types/actionTypes";

const initialState = {
  loading: false,
  user: null,
  token: null,
  error: null,
  isUserCreated: false,
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
        user: null,
        error: null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: action?.payload?.user,
        error: null,
        isUserCreated: true,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        isUserCreated: false,
      };
    case REGISTER_RESET:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isUserCreated: false,
      };
    default:
      return state;
  }
};

export default registerReducer;
