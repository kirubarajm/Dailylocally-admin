import {
  DAT_ORDER_LIST,
  MOVE_TO_PROCUREMENT,
  ON_CLEAR_PROCUREMENT,
} from "../constants/actionTypes";

export default (
  state = {
    movetoprocurement: false,
    dayorderlist: [],
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
        id: 7,
        status: "Moveit Assign",
      },
      {
        id: 8,
        status: "Moveit Pickup",
      },
      {
        id: 9,
        status: "Moveit Delivered",
      },
      {
        id: 10,
        status: "Completed",
      },
      {
        id: 11,
        status: "Cancel",
      },
    ],
  },
  action
) => {
  switch (action.type) {
    case DAT_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
      };
    case MOVE_TO_PROCUREMENT:
      return {
        ...state,
        movetoprocurement: action.payload.status || false,
      };
    case ON_CLEAR_PROCUREMENT:
      return {
        ...state,
        movetoprocurement: false,
      };
    default:
      return state;
  }
};
