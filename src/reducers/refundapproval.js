import {
  REFUND_ORDER_LIST,
  REFUND_ORDER_REPORT,
  REFUND_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
  QA_CHECK_LIST,
  POST_QA_CHECK_LIST,
  LOGISTICS_CLEAR,
  REFUND_POST_REPAYMENT,
  POST_TRIP_ASSIGN,
  TRACK_SELECT_TRIP,
} from "../constants/actionTypes";
const defult_slot = {
  id: -1,
  status: "All",
};
export default (
  state = {
    dayorderlist: [],
    refundorderreport: [],
    totalcount: 0,
    pagelimit: 0,
    selectedPage: 0,
    datafilter: false,
    orderSelectedStatus: defult_slot,
    orderSelectedSolt: defult_slot,
    driverlist: [],
    triporderlist: [],
    qualityUpdate: false,
    orderStatusUpdate:false,
    orderSlot: [
      { id: -1, status: "All" },
      { id: 1, status: "11 PM to 7 PM" },
      { id: 2, status: "7 PM to 11 PM" },
    ],
    qualitytype: [],
    orderStatus: [
      {
        id: -1,
        status: "All",
      },
      {
        id: 5,
        status: "QC",
      },
      {
        id: 6,
        status: "Ready to Dispatch",
      },
      {
        id: 7,
        status: "Moveit Assign",
      },
      {
        id: 8,
        status: "Moveit Pickup",
      },
      {
        id: 10,
        status: "Delivered",
      },
      {
        id: 11,
        status: "Cancel",
      },
      {
        id: 12,
        status: "Return",
      },
    ],
  },
  action
) => {
  switch (action.type) {
    case REFUND_ORDER_LIST:
      var list=action.payload.result || [];
      return {
        ...state,
        dayorderlist:list,
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
      case REFUND_ORDER_REPORT:
        var lists=action.payload.result || [];
        return {
          ...state,
          refundorderreport:lists,
        };
    case ZONE_TRIP_ORDER_LIST:
      return {
        ...state,
        triporderlist: action.payload.result || [],
      };
    case TRIP_DRIVER_LIST:
      return {
        ...state,
        driverlist: action.payload.result || [],
      };
    case QA_CHECK_LIST:
      return {
        ...state,
        qualitytype: action.payload.result || [],
      };
    case POST_QA_CHECK_LIST:
      return {
        ...state,
        qualityUpdate: action.payload.status || false,
      };
      case REFUND_POST_REPAYMENT:
      return {
        ...state,
        orderStatusUpdate: action.payload.status || false,
      };

      case POST_TRIP_ASSIGN:
      return {
        ...state,
        orderStatusUpdate: action.payload.status || false,
      };
      
    case REFUND_ORDER_LIST_FILTER:
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
      case TRACK_SELECT_TRIP:
      return {
        ...state,
        orderSelectedTrip: action.selectedStatus || false,
      };
    case TRACK_SELECT_SOLT:
      return {
        ...state,
        selectedTrip: action.selectedTrip || false,
      };
    case LOGISTICS_CLEAR:
      return {
        ...state,
        qualityUpdate: false,
        orderStatusUpdate:false
      };
    default:
      return state;
  }
};
