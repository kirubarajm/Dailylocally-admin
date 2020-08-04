import {
  MOVEIT_USERS_LIST,
  MOVEIT_USERS_REPORT,
  MOVEIT_USERS_FILTER,
} from "../constants/actionTypes";

export default (
  state = {
    moveituserlist: [],
    moveituserreport: [],
    search: "",
    online_status: -1,
    zoneItem: { id: -1, Zonename: "All" },
  },
  action
) => {
  switch (action.type) {
    case MOVEIT_USERS_LIST:
      return {
        ...state,
        moveituserlist: action.payload.result,
      };
    case MOVEIT_USERS_REPORT:
      return {
        ...state,
        moveituserreport: action.payload.result || [],
      };
    case MOVEIT_USERS_FILTER:
      return {
        ...state,
        search: action.search,
        online_status: action.online_status,
        zoneItem: action.item,
      };
    default:
      return state;
  }
};
