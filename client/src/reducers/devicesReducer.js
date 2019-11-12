import { deviceActionTypes } from '../actions/types';

const { FETCH_DEVICES } = deviceActionTypes;

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_DEVICES:
      return action.payload;
    default:
      return state;
  }
};
