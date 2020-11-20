import {
  ZONE_LIST_VIEW,
  TOAST_SHOW,
  ZONE_SELECT_ITEM,
  ZONE_ITEM_REFRESH,
  ADMIN_USER_DETAIL,
  HOME_REDIRECT,
  LOGOUT,
  REDIRECT,
  PAGE_TITLE,
} from "../constants/actionTypes";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";

export default (
  state = { zone_list: [], zoneItem: false, zoneRefresh: false,userdetail:false,title:"Home" },
  action
) => {
  switch (action.type) {
    case ZONE_LIST_VIEW:
      return {
        ...state,
        zone_list: action.payload.result || [],
      };
    case ZONE_SELECT_ITEM:
      return {
        ...state,
        zoneItem: action.zoneItem || false,
        zoneRefresh: true,
      };
      case PAGE_TITLE:
        return{
          ...state,
          title:action.title ||"",
        }
    case ZONE_ITEM_REFRESH:
      return {
        ...state,
        zoneRefresh: false,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case HOME_REDIRECT:
      return {
        ...state,
        redirectTo: action.redirectTo ? action.redirectTo : "/login",
      };
    case ADMIN_USER_DETAIL:
      return {
        ...state,
        userdetail: action.payload.result[0]||false,
      };
    case LOGOUT:
      return { ...state, redirectTo: "/login", token: null, currentUser: null };
    case TOAST_SHOW:
      notify.show(action.message, "custom", 7000, notification_color);
      return { ...state };
    default:
      return state;
  }
};
