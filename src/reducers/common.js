import { ZONE_LIST_VIEW, TOAST_SHOW } from "../constants/actionTypes";
import {notify} from 'react-notify-toast';
import {notification_color } from '../utils/constant'

export default (state = {zone_list:[]}, action) => {
  switch (action.type) {
    case ZONE_LIST_VIEW:
      return {
        ...state,
        zone_list: action.payload.result || [],
      };
      case TOAST_SHOW:
      notify.show(action.message,"custom", 7000,notification_color);
      return{...state}
    default:
      return state;
  }

};
