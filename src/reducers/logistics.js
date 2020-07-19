import {
  TRACK_ORDER_LIST,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
  QA_CHECK_LIST,
  POST_QA_CHECK_LIST,
  LOGISTICS_CLEAR,
  POST_DUNZO_ASSIGN,
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
        id: 9,
        status: "Completed",
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
    case TRACK_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
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
      case POST_DUNZO_ASSIGN:
      return {
        ...state,
        orderStatusUpdate: action.payload.status || false,
      };

      case POST_TRIP_ASSIGN:
      return {
        ...state,
        orderStatusUpdate: action.payload.status || false,
      };
      
    case TRACK_ORDER_LIST_FILTER:
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
