import axios from "axios";

//const BASE_URL_LIVE='http://dailylocally.co.in:7000/';
const BASE_URL_LIVE = "http://68.183.87.233:5000/";
//const BASE_URL_LIVE = "http://68.183.87.233:9000/";
//const BASE_URL_LIVE = "http://dailylocally.co.in:5000/";
//const BASE_URL_LIVE = 'http://localhost:4000/';
const ADMIN_URL = BASE_URL_LIVE + "admin";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjkwOTQ5MzkzNDciLCJpYXQiOjE1NjYyMTEyNDZ9.jOg5m2fkw6U6dGyhKpNWn594N34deElh5kqKemXe_x8"; //window.localStorage.getItem('jwt');
const responseBody = (res) => res.data;
const fileUploadHeader = { headers: { "Content-Type": "multipart/form-data" } };
const AppVersion_1 = "1.0.0";
const AppVersion_2 = "2.0.0";
const setheader = (version) => {
  return {
    headers: {
      "accept-version": version,
      Authorization: "Bearer ".concat(token),
    },
  };
};
const requests = {
  del: (url, version) =>
    axios.del(`${ADMIN_URL}${url}`, setheader(version)).then(responseBody),
  get: (url, version) =>
    axios.get(`${ADMIN_URL}${url}`, setheader(version)).then(responseBody),
  put: (url, body, version) =>
    axios
      .put(`${ADMIN_URL}${url}`, body, setheader(version))
      .then(responseBody),
  post: (url, body, version) =>
    axios
      .post(`${ADMIN_URL}${url}`, body, setheader(version))
      .then(responseBody),
};

const requests_base = {
  del: (url, version) =>
    axios.del(`${BASE_URL_LIVE}${url}`, setheader(version)).then(responseBody),
  get: (url, version) =>
    axios.get(`${BASE_URL_LIVE}${url}`, setheader(version)).then(responseBody),
  put: (url, body, version) =>
    axios
      .put(`${BASE_URL_LIVE}${url}`, body, setheader(version))
      .then(responseBody),
  post: (url, body, version) =>
    axios
      .post(`${BASE_URL_LIVE}${url}`, body, setheader(version))
      .then(responseBody),
};

const Auth = {
  current: () => requests.get("/user"),
  login: (email, password) =>
    requests.post("/users/login", { user: { email, password } }),
  register: (username, email, password) =>
    requests.post("/users", { user: { username, email, password } }),
  save: (user) => requests.put("/user", { user }),
};

const Admin ={
  login: (user) =>
  requests.post('/login',user),
  update: (user) =>
  requests.put('/pushupdate',user),
  getuserdetail: (user) =>
  requests.post('/userdetails',user),
  getuserlist: (user) =>
  requests.post('/adminuserlist',user),
  logout: (user) =>
  requests.post('/logout',user),
}

const Catelog = {
  getCategory: (data) => requests.post("/categorylist", data),
  getSubCate1: (data) => requests.post("/subcategoryl1list", data),
  getSubCate2: (data) => requests.post("/subcategoryl2list", data),
  getProduct: (data) => requests.post("/productlist", data),
  getProductReport: (data) => requests.post("/productlist", data),
  getSearch: (data) => requests.post("/search/catalog", data),
  getSearchView: (data) => requests.post("/search/catalogdata", data),
  getProductDetail: (data) => requests.post("/view/product", data),
  getUOMList: (data) => requests.post("/uomlist", data),
  getVendorList: (data) => requests.post("/vendorlist", data),
  getZoneList: (data) => requests.post("/zonelist", data),
  getBrandList: (data) => requests.post("/brandlist", data),
  getTagList: (data) => requests.post("/taglist", data),
  fileUpload: (file) =>requests.post("/fileUpload",file,fileUploadHeader,AppVersion_1),
  onAddProduct:(data) => requests.post("/add/product", data),
  onEditProduct:(data) => requests.post("/edit/product", data),
  onEditVendor:(data) => requests.post("/edit/vendorproductmapping", data),
  onAddVendor:(data) => requests.post("/add/vendorproductmapping", data),
  categoryLiveUnlive:(data) => requests.put("/live/category", data),
  L1subcategoryLiveUnlive:(data) => requests.put("/live/subcategoryl1", data),
   onEditCat:(data) => requests.post("/edit/category", data),
   onEditL1Cat:(data) => requests.post("/edit/subcategoryl1", data),
   onEditL2Cat:(data) => requests.post("/edit/subcategoryl2", data),
   onAddCat:(data) => requests.post("/add/category", data),
   onAddL1Cat:(data) => requests.post("/add/subcategoryl1", data),
   onAddL2Cat:(data) => requests.post("/add/subcategoryl2", data),
   L2subcategoryLiveUnlive:(data) => requests.put("/live/subcategoryl2", data),
   ProductLiveUnlive:(data) => requests.put("/live/product", data),
   ProductDelete:(data) => requests.post("/delete/product", data),
   
};

const Warehouse = {
  dayorderlist:(data) => requests.post("/dayorderlist", data),
  dayorderreport:(data) => requests.post("/dayorderlist", data),
  createprocurement:(data) => requests.post("/procurement/create", data),
  procurementwaitinglist:(data) => requests.post("/procurement/list", data),
  procurementwaitingreport:(data) => requests.post("/procurement/list", data),
  createPo:(data) => requests.post("/procurement/movetopurchase", data),
  movetoStock:(data) => requests.post("/stock/autoassign", data),
  movetoPRRemove:(data) => requests.post("/po/removebohmapping", data),
  getPoList:(data) => requests.post("/po/getpolist", data),
  getPoReport:(data) => requests.post("/po/getpolist", data),
  getPoView:(data) => requests.post("/po/view", data),
  getPoDelete:(data) => requests.post("/po/delete", data),
  VendorItemDelete:(data) => requests.post("/po/deletepotemp", data),
  getPoClose:(data) => requests.post("/po/close", data),
  getPrWaitingList:(data) => requests.post("/po/waitingpolist", data),
  getVendorList:(data) => requests.post("/po/productwisevendorlist", data),
  updateEditQuantity:(data) => requests.post("/po/updatepotempquantity", data),
  updateVendorAssign:(data) => requests.post("/po/productvendorassign", data),
  createPoConfirm:(data) => requests.post("/po/createpo", data),
  getReceivingList:(data) => requests.post("/po/getporeceivelist", data),
  getReceivingReport:(data) => requests.post("/po/getporeceivelist", data),
  updateReceiving:(data) => requests.post("/po/updateporeceive", data),
  updateUNReceiving:(data) => requests.post("/po/updatepounreceive", data),
  movetoSorting:(data) => requests.post("/po/popsoring", data),
  getSortingList:(data) => requests.post("/sorting/getsortinglist", data),
  getSortingReport:(data) => requests.post("/sorting/getsortinglist", data),
  getReturnList:(data) => requests.post("/return/getreturnlist", data),
  getReturnReport:(data) => requests.post("/return/getreturnlist", data),
  getQaList:(data) => requests.post("/quality/dayorderlist", data),
  getQaReport:(data) => requests.post("/quality/dayorderlist", data),
  saveSorting:(data) => requests.post("/sorting/savesorting", data),
  submitSorting:(data) => requests.post("/sorting/movetoqa", data),
  submitReturning:(data) => requests.post("/return/updateorders", data),
  submitSortingReport:(data) => requests.post("/sorting/missingquantityreport", data),
  getQaQualityList:(data) => requests.post("/quality/type", data),
  submitQA:(data) => requests.post("/quality/qualitycheck", data),
  movetoStoring:(data) => requests.post("/return/reorder", data),
}

const StockKeeping= {
  getStockKeepingList:(data) => requests.post("/stockkeeping/list", data),
  getWastageList:(data) => requests.post("/stockkeeping/wastage/list", data),
  getMissingList:(data) => requests.post("/stockkeeping/missingitem/list", data),
  getStockKeepingReport:(data) => requests.post("/stockkeeping/list", data),
  getProductList:(data) => requests.post("/stockkeeping/openlist", data),
  deleteStockKeeping:(data) => requests.post("/stockkeeping/delete", data),
  viewStockKeeping:(data) => requests.post("/stockkeeping/view", data),
  addStockKeeping:(data) => requests.post("/stockkeeping/add", data),
  editStockKeeping:(data) => requests.post("/stockkeeping/edit", data),
}

const CRM= {
  getOrderList:(data) => requests.post("/crm/dayorderlist", data),
  getOrderReport:(data) => requests.post("/crm/dayorderlist", data),
  getOrderDetail:(data) => requests.post("/crm/dayorderview", data),
  getOrderLogs:(data) => requests.post("/dayorderlog", data),
  getRaiseTicketIssues:(data) => requests.post("/zendesk/issues", data),
  getRaiseTicketTag:(data) => requests.post("/zendesk/issuesdetails", data),
  getCancelReason:() => requests.get("/crm/cancel/reasonlist"),
  getReorderReason:() => requests.get("/crm/reorder/reasonlist"),
  getReturnReason:() => requests.get("/crm/bookreturn/reasonlist"),
  getRefundReason:() => requests.get("/crm/refund/reasonlist"),
  postOrderCancel:(data) => requests.post("/crm/productcancel",data),
  postReOrder:(data) => requests.post("/crm/reorder",data),
  postRefundOrder:(data) => requests.post("/crm/refundrequest",data),
  postReturnOrder:(data) => requests.post("/crm/bookreturn",data),
  postMessageToCustomer:(data) => requests.post("/crm/usersms",data),
  postZendeskCreation:(data) => requests.post("/zendesk/ticketcreate",data),
  postComment:(data) => requests.post("/ordercomments",data),
  getUserList:(data) => requests.post("/crm/userlist", data),
  getUserReport:(data) => requests.post("/crm/userlist", data),
  postUserAddress:(data) => requests_base.put("user/address", data),
  getTransactionList:(data) => requests.post("/transaction", data),
  getTransactionView:(data) => requests.post("/transaction/view", data),
  postRepayment:(data) => requests.post("/repayment", data),
  getRefundApprovalList:(data) => requests.post("/refundlist", data),
  getRefundApprovalReport:(data) => requests.post("/refundlist", data),
}

const Logistics= {
  getTripOrders:(data) => requests.post("/logistics/trip/templist", data),
  getOrdersList:(data) => requests.post("/logistics/readytodispatchlist", data),
  getOrderReport:(data) => requests.post("/logistics/readytodispatchlist", data),
  getDriverList:(data) => requests.post("/logistics/moveit/listwithtrip", data),
  getQACheckList:(data) => requests.post("/logistics/qa/type_list", data),
  getDunzoOrderList:(data) => requests.post("/logistics/dunzo/orderlist", data),
  getDunzoOrderReport:(data) => requests.post("/logistics/dunzo/orderlist", data),
  getTripList:(data) => requests.post("/logistics/trip/list", data),
  getTripReport:(data) => requests.post("/logistics/trip/list", data),
  getTripSearchList:(data) => requests.post("/logistics/trip/tripmoveitfilters", data),
  postQACheckList:(data) => requests.post("/logistics/qa/submit_checklist", data),
  postDunzoAssign:(data) => requests.post("/logistics/dunzo/assign", data),
  postDunzoPickedUp:(data) => requests.post("/logistics/dunzo/pickup", data),
  postDunzoDelivered:(data) => requests.post("/logistics/dunzo/delivered", data),
  postTripAssign:(data) => requests.post("/logistics/trip/create", data),
  postTripUnAssign:(data) => requests.post("/logistics/trip/unassign", data),
  
}

const Moveit ={
  userAdd: (user) =>
  requests.post('/logistics/moveit/add',user,AppVersion_1),
  userUpdate: (user) =>
  requests.post('/logistics/moveit/edit',user,AppVersion_1),
  getAll: (data) =>
  requests.post('/logistics/moveit/list',data,AppVersion_1),
  getUserReport: (data) =>
  requests.post('/logistics/moveit/list',data,AppVersion_1),
  getView: (data) =>
  requests.post('/logistics/moveit/view',data,AppVersion_1),
  fileUpload: (file) =>
  requests.post("/fileUpload",file,fileUploadHeader,AppVersion_1),
  forceLogout: (data) => 
  requests.post('/logistics/moveit/forcelogout',data,AppVersion_1),
}


const MobileNumberVerify ={
  MobileOtpSend: (data,roleType) =>
  requests.post('/logistics/moveit/sendotp',data,AppVersion_1),
  MobileOtpVerify: (data,roleType) =>
  requests.post('/logistics/moveit/otpverify',data,AppVersion_1),
}

const CommunityList= {
  getCommunityList:(data) => requests.post("/community/masterlist", data),
  getUserList:(data) => requests.post("/community/userlist", data),
  updateApproval:(data) => requests_base.post("user/communityapproval", data),
  updateCommunity:(data) => requests.put("/community/edit", data),
}

export default {
  BASE_URL_LIVE,
  Auth,
  Catelog,
  Warehouse,
  StockKeeping,
  CRM,
  Logistics,
  Moveit,
  MobileNumberVerify,
  Admin,
  CommunityList,
  setToken: (_token) => {
    token = _token;
  },
};
