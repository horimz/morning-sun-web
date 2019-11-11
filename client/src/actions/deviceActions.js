import axios from 'axios';
import { deviceActionTypes } from './types';

const { CREATE_DEVICE, FETCH_DEVICES } = deviceActionTypes;

const createDevice = values => async dispatch => {
  const res = await axios.post('/api/createNewDevice', values);
  dispatch({
    type: CREATE_DEVICE,
    payload: { data: res.data, status: 'created' }
  });
};

const fetchDevices = () => async dispatch => {
  const res = await axios.get('/api/devices');
  dispatch({
    type: FETCH_DEVICES,
    payload: { data: res.data, status: 'fetched' }
  });
};

export const deviceActions = {
  createDevice,
  fetchDevices
};
