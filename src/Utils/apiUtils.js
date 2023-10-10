import axios from 'axios';

export const postRequest = (url, data, headers = {}) => {
  return axios.post(url, data, { headers })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getRequest = (url, params = {}, headers = {}) => {
  return axios.get(url, { params, headers })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const putRequest = (url, data, headers = {}) => {
  return axios.put(url, data, { headers })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};




