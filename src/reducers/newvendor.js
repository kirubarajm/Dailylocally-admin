import { EDIT_VENDOR,ADD_VENDOR,ADDCLEAR_VENDOR } from "../constants/actionTypes";

export default (state = { isVendorUpdate: false }, action) => {
  switch (action.type) {
    case ADD_VENDOR:
      return {
        ...state,
        isVendorUpdate: action.payload.status,
      };
    case EDIT_VENDOR:
      return {
        ...state,
        isVendorUpdate: action.payload.status,
      };
    case ADDCLEAR_VENDOR:
      return {
        ...state,
        isVendorUpdate: false,
      };
    default:
      return state;
  }
};
