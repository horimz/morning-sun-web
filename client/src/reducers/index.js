import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import authReducer from './authReducer';
import devicesReducer from './devicesReducer';

export default combineReducers({
  auth: authReducer,
  devices: devicesReducer,
  form: reduxForm
});
