import {
  TRANSACTION_FILTER,
  TRANSACTION_LIST,
  TRANSACTION_VIEW,
} from "../constants/actionTypes";

export default (
  state = {
    transactionlist: [],
    totalcount: 0,
    pagelimit:0,
    userfilter: false,
    selectedPage: 1,
    transactionview:false
  },
  action
) => {
  switch (action.type) {
    case TRANSACTION_LIST:
      return {
        ...state,
        transactionlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
    case TRANSACTION_VIEW:
      return {
        ...state,
        transactionview: action.payload.result[0] || [],
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
