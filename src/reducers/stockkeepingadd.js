import {
  STOCK_PRODUCT_LIST,
  STOCK_UPDATE_CLEAR,
  STOCK_UPDATE_PRODUCT_STOCK,
  DELETE_WASTAGE_IMAGES,
  UPDATE_WASTAGE_IMAGES,
  SET_WASTAGE_IMAGES,
} from "../constants/actionTypes";

export default (
  state = { productList: [], Signature: [], stock_list:[{id:0,name:"Daily"},{id:1,name:"Weekly"}],isStackupdated: false },
  action
) => {
  switch (action.type) {
    case STOCK_PRODUCT_LIST:
      return {
        ...state,
        productList: action.payload.result || [],
      };
    case STOCK_UPDATE_PRODUCT_STOCK:
      return {
        ...state,
        isStackupdated: action.payload.status || false,
      };
    case UPDATE_WASTAGE_IMAGES:
      var imagePath = {
        img_url: action.payload.result.Location,
        type: action.imgtype,
      };
      return {
        ...state,
        Signature: [...state.Signature, imagePath],
      };
    case SET_WASTAGE_IMAGES:
      var imagePath2 = {
        img_url: action.image,
        type: 0,
      };
      return {
        ...state,
        Signature: [...state.Signature, imagePath2],
      };
    case DELETE_WASTAGE_IMAGES:
      return {
        ...state,
        Signature: [],
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
