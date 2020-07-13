import {
  CATELOG_SUBCATEGORY_EDIT_L1_LIST,
  CATELOG_EDIT_CAT,
  CATELOG_ADD_CAT,
  CATELOG_CLEAR_FROM,
  CATELOG_ADD_L1CAT,
  CATELOG_ADD_L2CAT,
  CATELOG_EDIT_L1CAT,
  CATELOG_EDIT_L2CAT,
  UPDATE_CAT_IMAGES,
  SET_CAT_IMAGES,
  DELETE_CAT_IMAGES,
  UPDATE_CAT_THUMB_IMAGES,
  DELETE_CAT_THUMB_IMAGES,
  SET_CAT_THUMB_IMAGES,
} from "../constants/actionTypes";

export default (
  state = {
    category_list: [],
    subcat_L1: [],
    subcat_L2: [],
    Signature:[],
    ThumbPath:[],
    isCatUpdate: false,
  },
  action
) => {
  switch (action.type) {
    // case CATELOG_CATEGORY_LIST:
    //   return {
    //     ...state,
    //     category_list: action.payload.result || [],
    //   };
    case CATELOG_SUBCATEGORY_EDIT_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.result || [],
      };
    // case CATELOG_SUBCATEGORY_L2_LIST:
    //   return {
    //     ...state,
    //     subcat_L2: action.payload.result || [],
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
          img_url: action.payload.result.Location,
          type: action.imgtype
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath]
        };
        case UPDATE_CAT_THUMB_IMAGES:
        var imageThumbPath = {
          img_url: action.payload.result.Location,
          type: action.imgtype
        };
        return {
          ...state,
          ThumbPath: [...state.ThumbPath, imageThumbPath]
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
        case SET_CAT_THUMB_IMAGES:
        var imagethuPath2 = {
          img_url: action.image,
          type: 0
        };
        return {
          ...state,
          ThumbPath: [...state.ThumbPath, imagethuPath2]
        };
        case DELETE_CAT_IMAGES:
        return {
          ...state,
          Signature: []
        };
        case DELETE_CAT_THUMB_IMAGES:
          return {
            ...state,
            ThumbPath: []
          };
    default:
      return state;
  }
};
