import { ZONE_LIST_VIEW } from "../constants/actionTypes";


export default (state = {zone_list:[]}, action) => {
  switch (action.type) {
    case ZONE_LIST_VIEW:
      return {
        ...state,
        zone_list: action.payload.data || [],
      };
    default:
      return state;
  }

};
