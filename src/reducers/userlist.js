import { USER_LIST, USER_FILTER, USER_ADD_ADDRESS,USER_CLEAR } from "../constants/actionTypes";

export default (
  state = { Userlist: [], userfilter: false, totalcount: 0, selectedPage: 1,pagelimit:0,address_updated:false},
  action
) => {
  switch (action.type) {
    case USER_LIST:
      return {
        ...state,
        Userlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
      case USER_ADD_ADDRESS:
      return {
        ...state,
        address_updated: action.payload.status || false,
      };
      case USER_CLEAR:
      return {
        ...state,
        address_updated:false,
      };
      
    case USER_FILTER:
      return {
        ...state,
        userfilter: action.userfilter || false,
        selectedPage: action.userfilter ? action.userfilter.page : 1,
      };
    default:
      return state;
  }
};
