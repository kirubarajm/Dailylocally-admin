import axios from 'axios'

//const BASE_URL_LIVE='http://dailylocally.co.in:7000/';
const BASE_URL_LIVE='http://68.183.87.233:8000/';
//const BASE_URL_LIVE = 'http://localhost:4000/';
const ADMIN_URL= BASE_URL_LIVE+'admin';
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjkwOTQ5MzkzNDciLCJpYXQiOjE1NjYyMTEyNDZ9.jOg5m2fkw6U6dGyhKpNWn594N34deElh5kqKemXe_x8";//window.localStorage.getItem('jwt');
const responseBody = res => res.data;
const fileUploadHeader= {'headers':{'Content-Type': 'multipart/form-data'}};
const AppVersion_1="1.0.0";
const AppVersion_2="2.0.0";
const setheader=(version) =>{
  return ({headers: {'accept-version': version,'Authorization':'Bearer '.concat(token)}});
}
const requests = {
  del: (url,version) =>
  axios.del(`${ADMIN_URL}${url}`,setheader(version)).then(responseBody),
  get: (url,version) =>
  axios.get(`${ADMIN_URL}${url}`,setheader(version)).then(responseBody),
  put: (url, body,version) =>
  axios.put(`${ADMIN_URL}${url}`, body,setheader(version)).then(responseBody),
  post: (url, body,version) =>
  axios.post(`${ADMIN_URL}${url}`, body,setheader(version)).then(responseBody)
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

const Catelog = {
  getCategory: (data) =>
    requests.post('/categorylist',data),
    getSubCate1: (data) =>
    requests.post('/subcategoryl1list',data),
    getSubCate2: (data) =>
    requests.post('/subcategoryl2list',data),
    getProduct: (data) =>
    requests.post('/productlist',data),
    getProductDetail: (data) =>
    requests.post('/view/product',data),
    getUOMList: (data) =>
    requests.post('/uomlist',data),
    getZoneList: (data) =>
    requests.post('/zonelist',data),
    getBrandList: (data) =>
    requests.post('/brandlist',data),
};



export default {
  BASE_URL_LIVE,
  Auth,
  Catelog,
  setToken: _token => { token = _token; }
};