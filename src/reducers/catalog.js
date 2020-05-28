import {
  CATELOG_CATEGORY_LIST,
  CATELOG_PRODUCT_LIST,
  CATELOG_SUBCATEGORY_L2_LIST,
  CATELOG_SUBCATEGORY_L1_LIST,
} from "../constants/actionTypes";

export default (
  state = {category_list: [], subcat_L1: [], subcat_L2: [], product: [] },
  action
) => {
  switch (action.type) {
    case CATELOG_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.result,
      };
    case CATELOG_SUBCATEGORY_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.result,
      };
    case CATELOG_SUBCATEGORY_L2_LIST:
      return {
        ...state,
        subcat_L2: action.payload.result,
      };
    case CATELOG_PRODUCT_LIST:
      return {
        ...state,
        product: action.payload.result,
      };
    default:
      return state;
  }

  return state;
};
