import {
  STOCK_CATEGORY_LIST,
  STOCK_L1CATEGORY_LIST,
  STOCK_KEEPING_CLEAR,
  STOCK_KEEPING_LIST,
  STOCK_KEEPING_EDIT,
  STOCK_KEEPING_REPORT,
  STOCK_KEEPING_DELETE,
  STOCK_KEEPING_VIEW,
} from "../constants/actionTypes";
//{ id: 2, name: "UnReceiving" },
export default (
  state = {
    stock_keeping_list: [],
    stock_keeping_report:[],
    category_list: [],
    subcat_L1: [],
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
    case STOCK_KEEPING_LIST:
      return {
        ...state,
        stock_keeping_list: action.payload.result || [],
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
      case STOCK_KEEPING_REPORT:
      return {
        ...state,
        stock_keeping_report: action.payload.result || [],
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
