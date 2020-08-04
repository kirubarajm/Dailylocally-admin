import {
  DAT_ORDER_LIST,
  MOVE_TO_PROCUREMENT,
  ON_CLEAR_PROCUREMENT,
  DAT_ORDER_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    movetoprocurement: false,
    dayorderlist: [],
    dayorderreport:[],
    totalcount:0,
    pagelimit:0,
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
    case DAT_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
      case DAT_ORDER_REPORT:
        var product=action.payload.result||[];
        // product=product.map(function(item, i) {
        //   item.product = JSON.parse(item.product);
        // });
      return {
        ...state,
        dayorderreport: product || [],
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
