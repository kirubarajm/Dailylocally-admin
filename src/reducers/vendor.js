import {
  VENDOR_LIST,
  VENDOR_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    vendor_list: [],
    vendor_report: [],
    totalcount: 0,
    pagelimit: 0,
  },
  action
) => {
  switch (action.type) {
    case VENDOR_LIST:
      return {
        ...state,
        vendor_list: action.payload.result || [],
        totalcount: action.payload.totalcount || 10,
        pagelimit: action.payload.pagelimit || 1,
      };
    case VENDOR_REPORT:
      return {
        ...state,
        vendor_report: action.payload.result || [],
      };
    default:
      return state;
  }
};
