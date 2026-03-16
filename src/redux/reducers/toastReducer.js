// authReducer.js
import { ADD_TOAST } from "../types/actionTypes";

const initialState = {
  toastList: [],
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST:
      // Handle both array (for full replacement/removal) and object (for adding single toast)
      if (Array.isArray(action.payload)) {
        return {
          toastList: action.payload,
        };
      } else {
        // If it's an object, append it to the existing list
        return {
          toastList: [...state.toastList, action.payload],
        };
      }
    default:
      return state;
  }
};

export default toastReducer;
