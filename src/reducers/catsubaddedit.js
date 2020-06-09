import {
  CATELOG_SUBCATEGORY_EDIT_L1_LIST,
  CATELOG_EDIT_CAT,
  CATELOG_ADD_CAT,
  CATELOG_CLEAR_FROM,
  CATELOG_ADD_L1CAT,
  CATELOG_ADD_L2CAT,
  CATELOG_EDIT_L1CAT,
  CATELOG_EDIT_L2CAT,
  UPDATE_PRODUCT_IMAGES,
  SET_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGES,
  UPDATE_CAT_IMAGES,
  SET_CAT_IMAGES,
  DELETE_CAT_IMAGES,
} from "../constants/actionTypes";

export default (
  state = {
    category_list: [],
    subcat_L1: [],
    subcat_L2: [],
    Signature:[],
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
      case UPDATE_CAT_IMAGES:
        var imagePath = {
          img_url: action.payload.data.Location,
          type: action.imgtype
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath]
        };
        case SET_CAT_IMAGES:
        var imagePath2 = {
          img_url: action.image,
          type: 0
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath2]
        };
        case DELETE_CAT_IMAGES:
        return {
          ...state,
          Signature: []
        };
    default:
      return state;
  }
};
