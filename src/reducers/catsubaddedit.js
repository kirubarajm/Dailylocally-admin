import {
  CATELOG_SUBCATEGORY_EDIT_L1_LIST,
  CATELOG_EDIT_CAT,
  CATELOG_ADD_CAT,
  CATELOG_CLEAR_FROM,
  CATELOG_ADD_L1CAT,
  CATELOG_ADD_L2CAT,
  CATELOG_EDIT_L1CAT,
  CATELOG_EDIT_L2CAT,
} from "../constants/actionTypes";

export default (
  state = {
    category_list: [],
    subcat_L1: [],
    subcat_L2: [],
    isCatUpdate: false,
  },
  action
) => {
  switch (action.type) {
    // case CATELOG_CATEGORY_LIST:
    //   return {
    //     ...state,
    //     category_list: action.payload.data || [],
    //   };
    case CATELOG_SUBCATEGORY_EDIT_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.data || [],
      };
    // case CATELOG_SUBCATEGORY_L2_LIST:
    //   return {
    //     ...state,
    //     subcat_L2: action.payload.data || [],
    //   };
    case CATELOG_ADD_CAT:
    case CATELOG_EDIT_CAT:
    case CATELOG_ADD_L1CAT:
    case CATELOG_EDIT_L1CAT:
    case CATELOG_ADD_L2CAT:
    case CATELOG_EDIT_L2CAT:
      return {
        ...state,
        isCatUpdate: action.payload.status || false,
      };
    case CATELOG_CLEAR_FROM:
      return {
        ...state,
        isCatUpdate: false,
      };
    default:
      return state;
  }
};
