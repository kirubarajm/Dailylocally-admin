import {
  TRANSACTION_FILTER,
  TRANSACTION_LIST
} from "../constants/actionTypes";

export default (state = {transactionlist:[],totalcount:0,userfilter:false,selectedPage:1}, action) => {
  switch (action.type) {
    case TRANSACTION_LIST:
      return {
        ...state,
        transactionlist: action.payload.result || [],
        totalcount: action.totalcount || 40,
      };
    case TRANSACTION_FILTER:
      return {
        ...state,
        userfilter: action.userfilter || false,
        selectedPage: action.userfilter ? action.userfilter.page : 1,
      };
    default:
      return state;
  }

};
