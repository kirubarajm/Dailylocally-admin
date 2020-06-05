import { EDIT_PRODUCT_VENDOR,CLEAR_PRODUCT_VENDOR } from "../constants/actionTypes";

export default (state = { isVendorUpdate: false }, action) => {
  switch (action.type) {
    case EDIT_PRODUCT_VENDOR:
      return {
        ...state,
        isVendorUpdate: action.payload.status,
      };
    case CLEAR_PRODUCT_VENDOR:
      return {
        ...state,
        isVendorUpdate: false,
      };
    default:
      return state;
  }
};
