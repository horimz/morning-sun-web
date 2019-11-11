import { userActionTypes } from '../actions/types';

const { SET_USER } = userActionTypes;

// Return null: Fetching state.
// Return false: No user is signed in.
// Return user: User is signed in.
export default (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload || false; // return false if it is an emtpy string
    default:
      return state;
  }
};
