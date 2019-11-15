import axios from 'axios';
import { userActionTypes } from './types';
const { FETCH_USER, SET_USER } = userActionTypes;

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

const setUser = user => async dispatch => {
  dispatch({ type: SET_USER, payload: user });
};

const generateKey = () => async dispatch => {
  const res = await axios.get('/api/generateKey');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const userActions = {
  fetchUser,
  setUser,
  generateKey
};
