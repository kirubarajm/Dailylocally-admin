import { PRODUCT_VIEW, UPDATE_PRODUCT_IMAGES, UOM_LIST_VIEW, ZONE_LIST_VIEW, BRAND_LIST_VIEW, DELETE_PRODUCT_IMAGES, CATELOG_SUBCATEGORY_L2_LIST, CATELOG_SUBCATEGORY_L1_LIST, CATELOG_CATEGORY_LIST } from "../constants/actionTypes";

export default (
  state = {
    productdetail: false,
    UOMList: [],
    ZoneList: [],
    BrandList: [],
    Signature:[],
    category_list: [], subcat_L1: [], subcat_L2: [],
    Perishable:[{id:1,name:"Yes"},{id:2,name:"No"}],
    ProductType:[{id:1,name:"Veg"},{id:2,name:"Vegan"},{id:3,name:"Non Veg"}]
  },
  action
) => {
  switch (action.type) {
    case CATELOG_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.data || [],
      };
    case CATELOG_SUBCATEGORY_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.data || [],
      };
    case CATELOG_SUBCATEGORY_L2_LIST:
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
          img_url: action.payload.data.Location || "https://eattovo.s3.amazonaws.com/upload/admin/makeit/1588002283587-1.jpg.jpg",
          type: 0
        };
        return {
          ...state,
          Signature: [...state.Signature, imagePath]
        };
        case DELETE_PRODUCT_IMAGES:
        return {
          ...state,
          Signature: []
        };
     
    default:
      return state;
  }
};
