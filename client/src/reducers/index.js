import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import authReducer from './authReducer';
import devicesReducer from './devicesReducer';
import logsReducer from './logsReducer';

export default combineReducers({
  auth: authReducer,
  devices: devicesReducer,
  logs: logsReducer,
  form: reduxForm
});
