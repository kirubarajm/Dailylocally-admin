import {
  TRACK_ORDER_LIST,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
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
    driverlist:[],
    triporderlist:[],
    orderSlot: [
      { id: -1, status: "All" },
      { id: 1, status: "11 PM to 7 PM" },
      { id: 2, status: "7 PM to 11 PM" },
    ],
    qualitytype: [
      { qaid: 1, name: "Invoice/Checklist" },
      { qaid: 2, name: "Stickers" },
      { qaid: 3, name: "President letter" },
      { qaid: 4, name: "Footprint package" },
    ],
    orderStatus: [
      {
        id: -1,
        status: "All",
      },
      {
        id: 0,
        status: "Open",
      },
      {
        id: 1,
        status: "SCM",
      },
      {
        id: 6,
        status: "Ready to Dispatch",
      },
      {
        id: 10,
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
        totalcount: action.payload.totalcount || 40,
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
    case TRACK_SELECT_SOLT:
      return {
        ...state,
        orderSelectedSolt: action.selectedSlot || false,
      };
    default:
      return state;
  }
};
