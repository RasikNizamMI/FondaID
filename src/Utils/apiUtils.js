import axios from 'axios';

// All helpers resolve with the response body and reject with the original axios error,
// so callers can keep checking `error.response.status`.
const unwrap = response => response.data;

export const postRequest = (url, data, headers = {}) =>
  axios.post(url, data, {headers}).then(unwrap);

export const getRequest = (url, params = {}, headers = {}) =>
  axios.get(url, {params, headers}).then(unwrap);

export const putRequest = (url, data, headers = {}) =>
  axios.put(url, data, {headers}).then(unwrap);
