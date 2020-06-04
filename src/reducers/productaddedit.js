import { PRODUCT_VIEW } from "../constants/actionTypes";

export default (
  state = {
    productdetail: productdetail,
    UOMList: [],
    ZoneList: [],
    BrandList: [],
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_VIEW:
      return {
        ...state,
        productdetail: action.payload.date[0] || false,
      };
    case UOM_LIST_VIEW:
      return {
        ...state,
        UOMList: action.payload.data || [],
      };
    case ZONE_LIST_VIEW:
      return {
        ...state,
        ZoneList: action.payload.data || [],
      };
    case BRAND_LIST_VIEW:
      return {
        ...state,
        BrandList: action.payload.data || [],
      };
    default:
      return state;
  }

  return state;
};
