import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_RESET, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE, VALIDATE_TOKEN_SUCCESS, INITIAL_AUTH_CHECK_COMPLETE } from "../types/actionTypes";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  fromLogin: false,
  initialAuthCheckComplete: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        error: null,
        fromLogin: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action?.payload,
      };
    case LOGIN_RESET:
      return {
        ...state,
        error: null,
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
        error: null,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case VALIDATE_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        error: null,
        fromLogin: false,
      };
    case INITIAL_AUTH_CHECK_COMPLETE:
      return {
        ...state,
        initialAuthCheckComplete: true,
      };
    default:
      return state;
  }
};

export default authReducer;
