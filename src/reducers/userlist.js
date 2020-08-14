import {
  USER_LIST,
  USER_FILTER,
  USER_ADD_ADDRESS,
  USER_SELECTED_TAB,
  USER_CLEAR,
  USER_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    Userlist: [],
    UserReport: [],
    userfilter: false,
    totalcount: 0,
    selectedPage: 1,
    pagelimit: 0,
    user_tab_type:0,
    address_updated: false,
  },
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
    case USER_REPORT:
      return {
        ...state,
        UserReport: action.payload.result || [],
      };
    case USER_ADD_ADDRESS:
      return {
        ...state,
        address_updated: action.payload.status || false,
      };
    case USER_CLEAR:
      return {
        ...state,
        address_updated: false,
      };
    case USER_SELECTED_TAB:
      return {
        ...state,
        user_tab_type: action.tab_type || 0,
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
