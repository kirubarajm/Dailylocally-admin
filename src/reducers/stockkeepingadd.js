import { STOCK_KEEPING_LIST,STOCK_UPDATE_CLEAR,STOCK_UPDATE_PRODUCT_STOCK } from "../constants/actionTypes";


export default (state = {productList:[{pid:1}],isStackupdated:false}, action) => {
  switch (action.type) {
    case STOCK_KEEPING_LIST:
      return {
        ...state,
        productList: action.payload.result || [],
      };
      case STOCK_UPDATE_PRODUCT_STOCK:
      return {
        ...state,
        isStackupdated: action.payload.status || false,
      };
      case STOCK_UPDATE_CLEAR:
      return {
        ...state,
        isStackupdated: false,
      };
    default:
      return state;
  }

};
