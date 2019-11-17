import axios from 'axios';
import { deviceActionTypes } from './types';

const { FETCH_DEVICES } = deviceActionTypes;

const fetchDevices = () => async dispatch => {
  const res = await axios.get('/api/devices');
  dispatch({
    type: FETCH_DEVICES,
    payload: { data: res.data, status: 'fetched' }
  });
};

const addDevice = id => async dispatch => {
  const res = await axios.post('/api/addDevice', {
    id,
    date: new Date()
  });

  dispatch({
    type: FETCH_DEVICES,
    payload: { data: res.data, status: 'created' }
  });
};

const updateDevice = values => async dispatch => {
  const res = await axios.post('/api/updateDevice', values);
  dispatch({
    type: FETCH_DEVICES,
    payload: { data: res.data, status: 'updated' }
  });
};

const deleteDevice = (_id, id) => async dispatch => {
  const res = await axios.delete('/api/device', { params: { _id, id } });
  window.location.replace('/dashboard');
  dispatch({
    type: FETCH_DEVICES,
    payload: { data: res.data, status: 'deleted' }
  });
};

const resetDeviceStatus = devices => dispatch => {
  dispatch({
    type: FETCH_DEVICES,
    payload: { data: devices, status: 'reset' }
  });
};

export const deviceActions = {
  fetchDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  resetDeviceStatus
};
