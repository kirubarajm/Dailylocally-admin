import {
  BRAND_LIST,
  BRAND_REPORT,
  ADD_BRAND,
  EDIT_BRAND,
  ADDCLEAR_BRAND
} from "../constants/actionTypes";

export default (
  state = {
    brand_list: [],
    brand_report: [],
    totalcount: 0,
    pagelimit: 0,
    isBrandUpdate:false
  },
  action
) => {
  switch (action.type) {
    case BRAND_LIST:
      return {
        ...state,
        brand_list: action.payload.result || [],
        totalcount: action.payload.totalcount || 10,
        pagelimit: action.payload.pagelimit || 1,
      };
    case BRAND_REPORT:
      return {
        ...state,
        brand_report: action.payload.result || [],
      };
      case ADD_BRAND:
      return {
        ...state,
        isBrandUpdate: action.payload.status,
      };
    case EDIT_BRAND:
      return {
        ...state,
        isBrandUpdate: action.payload.status,
      };
    case ADDCLEAR_BRAND:
      return {
        ...state,
        isBrandUpdate: false,
      };
    default:
      return state;
  }
};
