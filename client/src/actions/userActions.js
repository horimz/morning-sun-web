import axios from 'axios';
import { userActionTypes } from './types';
import firebase from '../firebase/firebase-init';
const { SET_USER } = userActionTypes;

const setUser = user => async dispatch => {
  console.log(user);

  if (user) {
    const idToken = await firebase.auth().currentUser.getIdToken(true);

    // Set default request headers/content-type
    axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  dispatch({ type: SET_USER, payload: user });
};

export const userActions = {
  setUser
};
