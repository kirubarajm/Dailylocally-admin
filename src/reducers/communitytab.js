import {COMMUNITY_SELECTED_TAB } from "../constants/actionTypes";


export default (state = {community_tab_type:0}, action) => {
  switch (action.type) {
    case COMMUNITY_SELECTED_TAB:
      return {
        ...state,
        community_tab_type: action.tab_type || 0,
      };
    default:
      return state;
  }

};
