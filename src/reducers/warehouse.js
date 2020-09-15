import {COMMUNITY_SELECTED_TAB,WARE_HOUSE_ZONE_SELECTED,WARE_HOUSE_SELECTED_TAB, STOCK_KEEP_SELECTED_TAB } from "../constants/actionTypes";


export default (state = {community_tab_type:0,warehouse_tab_type:0,stockkeeping_tab_type:0,zoneItem:false}, action) => {
  switch (action.type) {
    case WARE_HOUSE_SELECTED_TAB:
      return {
        ...state,
        warehouse_tab_type: action.tab_type || 0,
      };
    case WARE_HOUSE_ZONE_SELECTED:
      return {
        ...state,
        zoneItem: action.item || false,
        isLoadingZone:false
      };
      case STOCK_KEEP_SELECTED_TAB:
      return {
        ...state,
        stockkeeping_tab_type: action.tab_type || 0,
      };
      case COMMUNITY_SELECTED_TAB:
      return {
        ...state,
        community_tab_type: action.tab_type || 0,
      };
    default:
      return state;
  }

};
