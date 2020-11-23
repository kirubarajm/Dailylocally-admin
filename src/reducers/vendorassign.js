import {
  PR_VENDOR_ASSIGN_LIST,
  GET_VENDOR_LIST,
  UPDATE_VENDOR_LIST,
  CREATE_PO,
  CLEAR_PO,
  EDIT_QUANTITY_BUTTON_ENABLE,
  EDIT_QUANTITY_PO_LIST,
  PO_EDIT_COUNT_UPDATE,
  CLEAR_VENDOR,
  DELETE_VENDOR_ITEM,
} from "../constants/actionTypes";

export default (
  state = {
    pocreatelist: [],
    submitbutton:0,
    poCreated: false,
    poItemDelete:false,
    vendor_list: [],
    vendor_drop_list:[],
    vendor_assign_updated:false,
    poEdittQuantity: false,
    poEditQuantityStatus: false,
  },
  action
) => {
  switch (action.type) {
    case PR_VENDOR_ASSIGN_LIST:
      return {
        ...state,
        pocreatelist: action.payload.result || [],
        vendor_drop_list: action.payload.vendorlist || [],
        submitbutton:action.payload.submitbutton||0,
      };
    case GET_VENDOR_LIST:
      return {
        ...state,
        vendor_list: action.payload.result || [],
      };
    case CREATE_PO:
      return {
        ...state,
        poCreated: action.payload.status || false,
      };
    case CLEAR_PO:
      return {
        ...state,
        poCreated: false,
        poItemDelete:false,
      };
      case CLEAR_VENDOR:
      return {
        ...state,
        vendor_assign_updated: false,
      };
    case UPDATE_VENDOR_LIST:
      return {
        ...state,
        vendor_assign_updated:action.payload.status || false,
      };
    case PO_EDIT_COUNT_UPDATE:
      return {
        ...state,
        poEdittQuantity: action.payload.success,
        poEditQuantityStatus: action.payload.status,
      };
      case DELETE_VENDOR_ITEM:
      return {
        ...state,
        poItemDelete: action.payload.status,
      };
      

    case EDIT_QUANTITY_PO_LIST:
      return {
        ...state,
        pocreatelist: state.pocreatelist.map((item, index) => {
          if (index === action.index) {
            return Object.assign({}, item, (item.editquantity = action.quantity));;
          } 
          return item;
        }),
      };
    case EDIT_QUANTITY_BUTTON_ENABLE:
      return {
        ...state,
        poEdittQuantity: false,
        poEditQuantityStatus: false,
        pocreatelist: state.pocreatelist.map((item, index) => {
          if (index === action.index) {
            item.editquantity = item.requested_quantity===null?item.actual_quantity:item.requested_quantity;
            return Object.assign({}, item, (item.isEdit = action.isEdit || false));
          }else return item;
        }),
      };
    default:
      return state;
  }
};
