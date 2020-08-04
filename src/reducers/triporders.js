import {
  TRIP_ORDER_LIST,
  TRIP_ORDER_REPORT,
  TRACK_SELECT_SOLT,
  TRIP_ORDER_SEARCH,
  TRIP_ORDER_LIST_FILTER,
  TRACK_SELECT_STATUS,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  ORDER_ACTION_CLEAR,
  TRIP_ORDER_UNASSIGN,
} from "../constants/actionTypes";
const defult_slot = {
  id: -1,
  status: "All",
};
export default (
  state = {
    dayorderlist: [],
    triporderreport: [],
    totalcount: 0,
    pagelimit: 0,
    selectedPage: 0,
    datafilter: false,
    isReturnordered:false,
    isOrderUpdated:false,
    orderSelectedStatus: defult_slot,
    orderSelectedSolt: defult_slot,
    returnReasonList:[],
    orderSlot: [
      { id: -1, status: "All" },
      { id: 1, status: "11 PM to 7 PM" },
      { id: 2, status: "7 PM to 11 PM" },
    ],
    actionList: [
      { id: 1, name: "Unassign Orders" }
    ],
  },
  action
) => {
  switch (action.type) {
    case TRIP_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
      case TRIP_ORDER_REPORT:
      return {
        ...state,
        triporderreport: action.payload.result || [],
      };
      case TRIP_ORDER_SEARCH:
      return {
        ...state,
        moveitlist: action.payload.moveitlist || [],
        triplist: action.payload.triplist || [],
      };
    case TRIP_ORDER_LIST_FILTER:
      return {
        ...state,
        datafilter: action.data || false,
        selectedPage: action.data ? action.data.page : 1,
      };
    case TRACK_SELECT_STATUS:
      return {
        ...state,
        orderSelectedStatus: action.selectedStatus || false,
      };
    case TRACK_SELECT_SOLT:
      return {
        ...state,
        orderSelectedSolt: action.selectedSlot || false,
      };
      case ORDER_RETURN_REASON:
      return {
        ...state,
        returnReasonList: action.payload.result || [],
      };
      case POST_RETURN_ORDER:
      return {
        ...state,
        isReturnordered: action.payload.status || false,
      };
      case TRIP_ORDER_UNASSIGN:
        return {
          ...state,
          isOrderUpdated: action.payload.status || false,
        };
      
      case ORDER_ACTION_CLEAR:
      return {
        ...state,
        isReturnordered: false,
        isOrderUpdated: false,
      };
    default:
      return state;
  }
};
