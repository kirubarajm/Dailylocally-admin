import { STOCK_CATEGORY_LIST, STOCK_L1CATEGORY_LIST,RECEIVING_CLEAR, STOCK_KEEPING_LIST } from "../constants/actionTypes";
//{ id: 2, name: "UnReceiving" },
export default (
  state = {
    stock_keeping_list: [],
    category_list: [],
    subcat_L1: [],
    receving_update:false,
    receivingAction: [
      { id: 1, name: "Receiving" }
    ],
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
      case RECEIVING_CLEAR:
        return {
          ...state,
          receving_update: false,
        };
    default:
      return state;
  }
};
