import axios from 'axios'

//const BASE_URL_LIVE='http://dailylocally.co.in:7000/';
const BASE_URL_LIVE = 'http://localhost:4000/';
let token = window.localStorage.getItem('jwt');
const responseBody = res => res.data;
const fileUploadHeader= {'headers':{'Content-Type': 'multipart/form-data'}};
const AppVersion_1="1.0.0";
const AppVersion_2="2.0.0";
const setheader=(version) =>{
  return ({headers: {'accept-version': version,'Authorization':'Token '.concat(token)}});
}
const requests = {
  del: (url,version) =>
  axios.del(`${BASE_URL_LIVE}${url}`,setheader(version)).then(responseBody),
  get: (url,version) =>
  axios.get(`${BASE_URL_LIVE}${url}`,setheader(version)).then(responseBody),
  put: (url, body,version) =>
  axios.put(`${BASE_URL_LIVE}${url}`, body,setheader(version)).then(responseBody),
  post: (url, body,version) =>
  axios.post(`${BASE_URL_LIVE}${url}`, body,setheader(version)).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};



export default {
  BASE_URL_LIVE,
  Auth,
  setToken: _token => { token = _token; }
};