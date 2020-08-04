import {
  TRACK_ORDER_LIST,
  TRACK_ORDER_REPORT,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  TRACK_SELECT_TRIP,
  TRACK_SELECT_VIEW
} from "../constants/actionTypes";
const defult_slot={
  id: -1,
  status: "All",
}
export default (
  state = {
    dayorderlist: [],
    dayorderreport: [],
    totalcount: 0,
    pagelimit: 0,
    selectedPage: 0,
    datafilter: false,
    isViewed:false,
    orderSelectedStatus:defult_slot,
    orderSelectedSolt:defult_slot,
    orderSlot: [
      { id: -1, status: "All" },
      { id: 1, status: "11 PM to 7 PM" },
      { id: 2, status: "7 PM to 11 PM" },
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
        id: 5,
        status: "QC",
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
        id: 6,
        status: "Ready to Dispatch",
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
    case TRACK_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
        pagelimit: action.payload.pagelimit || 20,
        totalcount: action.payload.totalcount || 10,
      };
      case TRACK_ORDER_REPORT:
      return {
        ...state,
        dayorderreport: action.payload.result || [],
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
        orderSelectedSolt: action.selectedSlot || false,
      };
      case TRACK_SELECT_VIEW:
      return {
        ...state,
        isViewed: action.data || false,
      };
    default:
      return state;
  }
};
