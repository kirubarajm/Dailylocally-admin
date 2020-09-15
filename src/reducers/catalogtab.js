import {CATALOG_SELECTED_TAB,CATALOG_ZONE_SELECTED} from "../constants/actionTypes";


export default (state = {catalog_tab_type:0,zoneItem:false}, action) => {
  switch (action.type) {
    case CATALOG_SELECTED_TAB:
      return {
        ...state,
        catalog_tab_type: action.tab_type || 0,
      };
    case CATALOG_ZONE_SELECTED:
      return {
        ...state,
        zoneItem: action.item || false,
        isLoadingZone:false
      };
    default:
      return state;
  }

};
