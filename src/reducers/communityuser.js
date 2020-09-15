import {
  COMMUNITY_USER_LIST,
  COMMUNITY_USER_REPORT,
  COMMUNITY_APPROVAL,
  COMMUNITY_CLEAR,
  COMMUNITY_UPDATE,
} from "../constants/actionTypes";

export default (
  state = {
    community_user_list: [],
    community_user_report: [],
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
    case COMMUNITY_USER_LIST:
      return {
        ...state,
        community_user_list: action.payload.result || [],
        totalcount: action.payload.totalcount || 10,
        pagelimit: action.payload.pagelimit || 1,
      };
    case COMMUNITY_USER_REPORT:
      return {
        ...state,
        community_user_report: action.payload.result || [],
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
