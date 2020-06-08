import {
  CATELOG_CATEGORY_LIST,
  CATELOG_PRODUCT_LIST,
  CATELOG_SUBCATEGORY_L2_LIST,
  CATELOG_SUBCATEGORY_L1_LIST,
  CATELOG_SELECTED_CAT,
  CATELOG_SELECTED_L1CAT,
  CATELOG_SELECTED_L2CAT,
  CATELOG_SELECTED_TAB,
  CATELOG_PRODUCT_ADD_SELECT,
  CATELOG_SEARCH,
  CATELOG_SEARCH_SELECT
} from "../constants/actionTypes";

export default (
  state = {
    catalog_tab_type: 0,
    category_list: [],
    subcat_L1: [],
    subcat_L2: [],
    product: [],
    search_data:[],
    search: "",
    selected_cat: -1,
    selected_cat_sub1: -1,
    selected_cat_sub2: -1,
    isAddProduct:false
  },
  action
) => {
  switch (action.type) {
    case CATELOG_SELECTED_TAB:
      return {
        ...state,
        catalog_tab_type: action.tab_type || 0,
      };
    case CATELOG_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.data || [],
        subcat_L1: [],
        subcat_L2: [],
        product: [],
        selected_cat: -1,
        selected_cat_sub1: -1,
        selected_cat_sub2: -1,
      };
    case CATELOG_SUBCATEGORY_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.data || [],
        subcat_L2: [],
        product: [],
        selected_cat_sub1: -1,
        selected_cat_sub2: -1,
      };
    case CATELOG_SUBCATEGORY_L2_LIST:
      var subL2 = [];
      subL2.push({ name: "No L2 SC", scl2_id: 0 });
      subL2 = subL2.concat(action.payload.data || []);
      return {
        ...state,
        subcat_L2: subL2,
        product: [],
        selected_cat_sub2: -1,
      };
    case CATELOG_PRODUCT_LIST:
      return {
        ...state,
        product: action.payload.data || [],
        isAddProduct:false
      };
    case CATELOG_SELECTED_CAT:
      return {
        ...state,
        selected_cat: action.Item,
      };
    case CATELOG_SELECTED_L1CAT:
      return {
        ...state,
        selected_cat_sub1: action.Item,
      };
    case CATELOG_SELECTED_L2CAT:
      return {
        ...state,
        selected_cat_sub2: action.Item,
      };
      case CATELOG_PRODUCT_ADD_SELECT:
      return {
        ...state,
        isAddProduct: true,
      };
      case CATELOG_SEARCH:
      return {
        ...state,
        search_data: action.payload.data || [],
      };
      case CATELOG_SEARCH_SELECT:
        var category=action.payload.category || [];
        var l1subcategory=action.payload.l1subcategory || [];
        var l2subcategory=action.payload.l2subcategory || [];
        var sCat=category.length?category[0]:-1
        var sL1Cat=l1subcategory.length?l1subcategory[0]:-1
        var sL2Cat=l2subcategory.length?l2subcategory[0]:-1
      return {
        ...state,
        category_list: category,
        subcat_L1:l1subcategory,
        subcat_L2:l2subcategory,
        product: action.payload.product || [],
        selected_cat:sCat,
        selected_cat_sub1:sL1Cat,
        selected_cat_sub2:sL2Cat,
      };
      
    default:
      return state;
  }
};
