import {
  STOCK_CATEGORY_LIST,
  STOCK_L1CATEGORY_LIST,
  STOCK_KEEPING_CLEAR,
  STOCK_KEEPING_EDIT,
  MISSING_REPORT,
  STOCK_KEEPING_DELETE,
  STOCK_KEEPING_VIEW,
  MISSING_LIST,
} from "../constants/actionTypes";
//{ id: 2, name: "UnReceiving" },
export default (
  state = {
    missing_list: [],
    missing_report:[],
    category_list: [],
    subcat_L1: [],
    totalcount:0,
    pagelimit:0,
    receving_update: false,
    stock_keeping_edit: false,
    stock_keeping_view: false,
    stock_keeping_delete: false,
    receivingAction: [{ id: 1, name: "Receiving" }],
  },
  action
) => {
  switch (action.type) {
    case STOCK_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.result || [],
      };
    case STOCK_L1CATEGORY_LIST:
      return {
        ...state,
        subcat_L1: action.payload.result || [],
      };
    case MISSING_LIST:
      return {
        ...state,
        missing_list: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
    case STOCK_KEEPING_DELETE:
      return {
        ...state,
        stock_keeping_delete: action.payload.status || false,
      };
    case STOCK_KEEPING_VIEW:
      return {
        ...state,
        stock_keeping_view: action.payload.result[0] || false,
      };
    case STOCK_KEEPING_EDIT:
      return {
        ...state,
        stock_keeping_edit: action.payload.status || false,
      };
      case MISSING_REPORT:
      return {
        ...state,
        missing_report: action.payload.result || [],
      };
    case STOCK_KEEPING_CLEAR:
      return {
        ...state,
        stock_keeping_delete: false,
      };
    default:
      return state;
  }
};
