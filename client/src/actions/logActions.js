import axios from 'axios';
import { logActionTypes } from './types';

const { FETCH_LOGS } = logActionTypes;

const fetchLogs = () => async dispatch => {
  const res = await axios.get('/api/logs');
  dispatch({
    type: FETCH_LOGS,
    payload: { data: res.data, status: 'fetched' }
  });
};

const deleteLogs = ids => async dispatch => {
  const res = await axios.post('/api/logs', { ids });
  dispatch({
    type: FETCH_LOGS,
    payload: { data: res.data, status: 'deleted' }
  });
};

const resetLogStatus = logs => dispatch => {
  dispatch({
    type: FETCH_LOGS,
    payload: { data: logs, status: 'reset' }
  });
};

export const logActions = {
  fetchLogs,
  deleteLogs,
  resetLogStatus
};
