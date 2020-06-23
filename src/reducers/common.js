import {
  ZONE_LIST_VIEW,
  TOAST_SHOW,
  ZONE_SELECT_ITEM,
  ZONE_ITEM_REFRESH,
} from "../constants/actionTypes";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";

export default (
  state = { zone_list: [], zoneItem: false, zoneRefresh: false },
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
    case ZONE_ITEM_REFRESH:
      return {
        ...state,
        zoneRefresh: false,
      };
    case TOAST_SHOW:
      notify.show(action.message, "custom", 7000, notification_color);
      return { ...state };
    default:
      return state;
  }
};
