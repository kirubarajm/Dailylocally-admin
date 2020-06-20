import {
  MasterOrderStatus,
  MasterOrderStatusV,
  LoginType,
} from "../utils/constant";

export const getOrderStatus = (orderstatus) => {
  orderstatus = orderstatus || 0;
  orderstatus = orderstatus > 7 ? 0 : orderstatus;
  var morder = MasterOrderStatus[orderstatus];
  return morder;
};


export const getdeliveryOrderStatus = (orderstatus) => {
  orderstatus = orderstatus || 0;
  orderstatus = orderstatus > 7 ? 0 : orderstatus;
  var morder = MasterOrderStatus[orderstatus];
  return morder;
};
export const getOrderNextStatusValue = (orderstatus) => {
  var morder = MasterOrderStatus[getOrderNextStatus(orderstatus)];
  return morder;
};
export const getOrderNextStatusValueV = (orderstatus) => {
  var morder = MasterOrderStatusV[getOrderNextStatus(orderstatus)];
  return morder;
};

export const getOrderNextStatus = (orderstatus) => {
  orderstatus = orderstatus || 0;
  orderstatus = orderstatus > 7 ? 0 : orderstatus;
  orderstatus = orderstatus + 1;
  orderstatus = orderstatus === 2 ? 3 : orderstatus;
  return orderstatus;
};

export const isLoggedInUser = () => {
  var loginDetail = getLoginDetail();
  var type = 0;
  if (loginDetail && loginDetail.loginsuccess) {
    type = loginDetail.logindetail.user_roleid;
  }
  return type;
};

export const getAdminId = () => {
  var loginDetail = getLoginDetail();
  var type = 0;
  if (loginDetail) {
    type = loginDetail.logindetail.admin_userid;
  }
  return type;
};

export const getLoginTypeName = (login_type) => {
  if (login_type) return LoginType[login_type];
  return LoginType[isLoggedInUser()];
};

export const getLoginDetail = () => {
  let token = window.localStorage.getItem("locally_login_detail") || false;
  var loginDetail = null;
  if (token) {
    loginDetail = JSON.parse(token);
  }
  return loginDetail;
};
