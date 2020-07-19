import {
  DUNZO_ORDER_LIST,
  DUNZO_ORDER_FILTER,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  ORDER_ACTION_CLEAR,
  DUNZO_ORDER_PICKED_UP,
  DUNZO_ORDER_DELIVERED,
} from "../constants/actionTypes";
export default (
  state = {
    dayorderlist: [],
    totalcount: 0,
    pagelimit: 0,
    selectedPage: 0,
    datafilter: false,
    isReturnordered:false,
    isOrderUpdated:false,
    returnReasonList:[],
    actionList: [
      { id: 1, name: "Picked-up" },
      { id: 2, name: "Delivered" },
    ],
  },
  action
) => {
  switch (action.type) {
    case DUNZO_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
    case DUNZO_ORDER_FILTER:
      return {
        ...state,
        datafilter: action.data || false,
        selectedPage: action.data ? action.data.page : 1,
      };
      case ORDER_RETURN_REASON:
      return {
        ...state,
        returnReasonList: action.payload.result || [],
      };
      case DUNZO_ORDER_PICKED_UP:
      case DUNZO_ORDER_DELIVERED:
        return {
          ...state,
          isOrderUpdated: action.payload.status || false,
        };
      case POST_RETURN_ORDER:
      return {
        ...state,
        isReturnordered: action.payload.status || false,
      };
      case ORDER_ACTION_CLEAR:
      return {
        ...state,
        isReturnordered: false,
        isOrderUpdated:false
      };
    default:
      return state;
  }
};
