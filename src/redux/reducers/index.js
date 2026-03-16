import { combineReducers } from 'redux';
import authReducer from './authReducer';
import registerReducer from './resgisterReducer';
import forgotPasswordReducer from './forgotPasswordReducer';
import toastReducer from './toastReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
  toasts: toastReducer
});

export default rootReducer;
