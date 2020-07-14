import { USER_LIST, USER_FILTER } from "../constants/actionTypes";

export default (
  state = { Userlist: [], userfilter: false, totalcount: 0, selectedPage: 1 },
  action
) => {
  switch (action.type) {
    case USER_LIST:
      return {
        ...state,
        Userlist: action.payload.result || [],
        totalcount: action.totalcount || 40,
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
