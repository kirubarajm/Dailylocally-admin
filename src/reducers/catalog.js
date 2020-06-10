import {
  CATELOG_CATEGORY_LIST,
  CATELOG_PRODUCT_LIST,
  CATELOG_SUBCATEGORY_L2_LIST,
  CATELOG_SUBCATEGORY_L1_LIST,
  CATEGORY_LIVE_UNLIVE,
  CATEGORY_LIVE_ITEM,
  CATEGORY_LIVE_POPUP_CLEAR,
  L1_SUBCATEGORY_LIVE_UNLIVE,
  L1_SUB_CATEGORY_LIVE_ITEM,
  L1_SUB_CATEGORY_LIVE_POPUP_CLEAR,
  CATELOG_SELECTED_CAT,
  CATELOG_SELECTED_L1CAT,
  CATELOG_SELECTED_L2CAT,
  CATELOG_SELECTED_TAB,
  CATELOG_PRODUCT_ADD_SELECT,
  CATELOG_SEARCH,
  CATELOG_SEARCH_SELECT,
  ZONE_LIST_VIEW,
  L2_SUBCATEGORY_LIVE_UNLIVE,
  L2_SUB_CATEGORY_LIVE_ITEM,
  L2_SUB_CATEGORY_LIVE_POPUP_CLEAR,
  PRODUCT_LIVE_UNLIVE,
  PRODUCT_LIVE_UNLIVE_LIVE_ITEM,
  PRODUCT_LIVE_UNLIVE_LIVE_POPUP_CLEAR,
  ZONE_SELECTED
} from "../constants/actionTypes";

export default (
  state = {
    catalog_tab_type: 0,
    category_list: [],
    subcat_L1: [],
    subcat_L2: [],
    product: [],
    search_data: [],
    zone_list:[],
    isLoadingZone:false,
    zoneItem: false,
    search: "",
    selected_cat: -1,
    selected_cat_sub1: -1,
    selected_cat_sub2: -1,
    isAddProduct:false,
    iscategorylive:false,
    iscategoryitem:false,
    iscategoryindex:0,
    isL1subcategorylive:false,
    isL1subcategoryitem:false,
    isL1subcategoryindex:0,
    isL2subcategorylive:false,
    isL2subcategoryitem:false,
    isL2subcategoryindex:0,
    isProductlive:false,
    isProductitem:false,
    isProductindex:0
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
        isAddProduct: false,
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
      case CATEGORY_LIVE_UNLIVE:
        var data=action.payload.data[0];
        return {
          ...state,
          iscategorylive: action.payload.status || false,
          category_list :Object.assign([], state.category_list, {[state.iscategoryindex]: data})
        };

        case CATEGORY_LIVE_ITEM:
          return {
            ...state,
            iscategoryitem: action.item || false,
            iscategoryindex: action.i || 0,
          };
        
          case CATEGORY_LIVE_POPUP_CLEAR:
          return {
            ...state,
            iscategoryitem:  false,
            iscategoryindex:  0,
            iscategorylive:false
          };

          case L1_SUBCATEGORY_LIVE_UNLIVE:
             var data=action.payload.data[0];
            return {
              ...state,
              isL1subcategorylive: action.payload.status || false,
              subcat_L1 :Object.assign([], state.subcat_L1, {[state.isL1subcategoryindex]: data})
            }; 

          case L1_SUB_CATEGORY_LIVE_ITEM:
            return {
                ...state,
                isL1subcategoryitem: action.item || false,
                isL1subcategoryindex: action.i || 0,
              };
            
          case L1_SUB_CATEGORY_LIVE_POPUP_CLEAR:
            return {
                ...state,
                isL1subcategoryitem:  false,
                isL1subcategoryindex:  0,
                isL1subcategorylive: false
              };


          case L2_SUBCATEGORY_LIVE_UNLIVE:
                var data=action.payload.data[0];
               return {
                 ...state,
                 isL2subcategorylive: action.payload.status || false,
                 subcat_L2 :Object.assign([], state.subcat_L2, {[state.isL2subcategoryindex]: data})
               }; 
   
          case L2_SUB_CATEGORY_LIVE_ITEM:
               return {
                   ...state,
                   isL2subcategoryitem: action.item || false,
                   isL2subcategoryindex: action.i || 0,
                 };
               
          case L2_SUB_CATEGORY_LIVE_POPUP_CLEAR:
               return {
                   ...state,
                   isL2subcategoryitem:  false,
                   isL2subcategoryindex:  0,
                   isL2subcategorylive: false
                 };
   
          case PRODUCT_LIVE_UNLIVE:
                  var data=action.payload.data[0];
                 return {
                   ...state,
                   isProductlive: action.payload.status || false,
                   product :Object.assign([], state.product, {[state.isProductindex]: data})
                 }; 
     
            case PRODUCT_LIVE_UNLIVE_LIVE_ITEM:
                 return {
                     ...state,
                     isProductitem: action.item || false,
                     isProductindex: action.i || 0,
                   };
                 
            case PRODUCT_LIVE_UNLIVE_LIVE_POPUP_CLEAR:
                 return {
                     ...state,
                     isProductitem:false,
                       isProductindex:0,
                     isProductlive: false
                   };
     

      case CATELOG_SEARCH:
      return {
        ...state,
        search_data: action.payload.data || [],
      };
    case ZONE_LIST_VIEW:
      return {
        ...state,
        zone_list: action.payload.data || [],
        isLoadingZone:true
      };
      case ZONE_SELECTED:
      return {
        ...state,
        zoneItem: action.item || false,
        isLoadingZone:false
      };
    case CATELOG_SEARCH_SELECT:
      var category = action.payload.category || [];
      var l1subcategory = action.payload.l1subcategory || [];
      var l2subcategory = action.payload.l2subcategory || [];
      var sCat = category.length ? category[0] : -1;
      var sL1Cat = l1subcategory.length ? l1subcategory[0] : -1;
      var sL2Cat = l2subcategory.length ? l2subcategory[0] : -1;
      return {
        ...state,
        category_list: category,
        subcat_L1: l1subcategory,
        subcat_L2: l2subcategory,
        product: action.payload.product || [],
        selected_cat: sCat,
        selected_cat_sub1: sL1Cat,
        selected_cat_sub2: sL2Cat,
      };

    default:
      return state;
  }
};
