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
} from "../constants/actionTypes";

export default (
  state = {category_list: [], subcat_L1: [], subcat_L2: [], product: [],search:"",iscategorylive:false,iscategoryitem:false,iscategoryindex:0,
  isL1subcategorylive:false,
  isL1subcategoryitem:false,
  isL1subcategoryindex:0
},
  action
) => {
  switch (action.type) {
    case CATELOG_CATEGORY_LIST:
      return {
        ...state,
        category_list: action.payload.data || [],
        subcat_L1:[],
        subcat_L2:[],
        product:[]
      };
    case CATELOG_SUBCATEGORY_L1_LIST:
      return {
        ...state,
        subcat_L1: action.payload.data || [],
        subcat_L2:[],
        product:[]
      };
    case CATELOG_SUBCATEGORY_L2_LIST:
      return {
        ...state,
        subcat_L2: action.payload.data || [],
        product:[]
      };
    case CATELOG_PRODUCT_LIST:
      return {
        ...state,
        product: action.payload.data || [],
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
              subcat_L1 :Object.assign([], state.subcat_L1, {[state.iscategoryindex]: data})
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

    default:
      return state;
  }

};
