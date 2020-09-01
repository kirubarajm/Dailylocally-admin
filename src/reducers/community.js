import {
  COMMUNITY_SELECTED_TAB,
  COMMUNITY_LIST,
  COMMUNITY_APPROVAL,
  COMMUNITY_CLEAR,
  COMMUNITY_UPDATE,
  COMMUNITY_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    community_list: [],
    community_report: [],
    community_tab_type: 0,
    totalcount: 0,
    community_approval:false,
    pagelimit: 0,
    orderStatus: [
      {
        id: -1,
        status: "All",
      },
      {
        id: 0,
        status: "Awaiting approval",
      },
      {
        id: 1,
        status: "Approved",
      },
      {
        id: 2,
        status: "Not Approved",
      }
    ],
  },
  action
) => {
  switch (action.type) {
    case COMMUNITY_SELECTED_TAB:
      return {
        ...state,
        community_tab_type: action.tab_type || 0,
      };
    case COMMUNITY_LIST:
      return {
        ...state,
        community_list: action.payload.result || [],
        totalcount: action.payload.totalcount || 10,
        pagelimit: action.payload.pagelimit || 1,
      };
    case COMMUNITY_REPORT:
      return {
        ...state,
        community_report: action.payload.result || [],
      };
      case COMMUNITY_APPROVAL:
      return {
        ...state,
        community_approval: action.payload.status || false,
      };
      case COMMUNITY_UPDATE:
        return {
          ...state,
          community_approval: action.payload.status || false,
        };
        case COMMUNITY_CLEAR:
        return {
          ...state,
          community_approval:false,
        };
      
    default:
      return state;
  }
};
