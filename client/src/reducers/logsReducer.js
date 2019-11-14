import { logActionTypes } from '../actions/types';

const { FETCH_LOGS } = logActionTypes;

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_LOGS:
      return action.payload;
    default:
      return state;
  }
};
