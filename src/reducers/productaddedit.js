import { PRODUCT_VIEW, CLEAR_PRODUCT_DATA,UPDATE_PRODUCT_IMAGES, UOM_LIST_VIEW, ZONE_LIST_VIEW, BRAND_LIST_VIEW, DELETE_PRODUCT_IMAGES, CATELOG_SUBCATEGORY_L2_LIST, CATELOG_SUBCATEGORY_L1_LIST, CATELOG_CATEGORY_LIST, SET_PRODUCT_IMAGES, PRODUCT_EDIT, PRODUCT_ADD, TAG_LIST_VIEW, PRODUCT_SUBCATEGORY_L2_LIST, PRODUCT_SUBCATEGORY_L1_LIST, PRODUCT_CATEGORY_LIST } from "../constants/actionTypes";

export default (
  state = {
    productdetail: false,
    isProductUpdated:false,
    UOMList: [],
    ZoneList: [],
    BrandList: [],
    Signature:[],
    TagList:[],
    category_list: [], subcat_L1: [], subcat_L2: [],
    Perishable:[{id:1,name:"Yes"},{id:2,name:"No"}],
    ProductType:[{id:0,name:"Veg"},{id:1,name:"Non Veg"},{id:2,name:"Vegan"}]
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.data || [],
      };
    case PRODUCT_SUBCATEGORY_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.data || [],
      };
    case PRODUCT_SUBCATEGORY_L2_LIST:
      return {
        ...state,
        subcat_L2: action.payload.data || [],
      };
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
      case TAG_LIST_VIEW:
      return {
        ...state,
        TagList: action.payload.data || [],
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
      case UPDATE_PRODUCT_IMAGES:
        var imagePath = {
          img_url: action.payload.data.Location,
          type: action.imgtype
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath]
        };
        case SET_PRODUCT_IMAGES:
        var imagePath2 = {
          img_url: action.image,
          type: 0
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath2]
        };
        case DELETE_PRODUCT_IMAGES:
        return {
          ...state,
          Signature: []
        };
        case CLEAR_PRODUCT_DATA:
        return {
          ...state,
          isProductUpdated:false
        };
        case PRODUCT_EDIT:
        case PRODUCT_ADD:
          return {
            ...state,
            isProductUpdated: action.payload.status,
            productdetail:false
          };
     
    default:
      return state;
  }
};
