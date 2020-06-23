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
} from "../constants/actionTypes";

export default (
  state = {
    pocreatelist: [],
    poCreated: false,
    vendor_list: [],
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
        // pocreatelist: state.pocreatelist.map((item) => {
        //   if (action.data.pridList.includes("" + item.prid)) {
        //     return Object.assign({}, item, {
        //       buyer_comment: action.data.buyer_comment,
        //       exp_date: action.data.exp_date,
        //       vendor_name: action.data.suplier.name,
        //       vendor_code: action.data.suplier.vid,
        //       other_charges: action.data.suplier.other_charges,
        //       rate: action.data.suplier.base_price,
        //       amount: action.data.suplier.base_price * item.quantity,
        //     });
        //   }
        //   return item;
        // }),
      };
    case PO_EDIT_COUNT_UPDATE:
      return {
        ...state,
        poEdittQuantity: action.payload.success,
        poEditQuantityStatus: action.payload.status,
      };

    case EDIT_QUANTITY_PO_LIST:
      return {
        ...state,
        pocreatelist: state.pocreatelist.map((item, index) => {
          if (index === action.index) {
            return Object.assign(
              {},
              item,
              (item.editquantity = action.quantity)
            );
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
            item.editquantity = (item.requested_quantity || item.actual_quantity);
            return Object.assign({}, item, (item.isEdit = action.isEdit || false));
          }
          return item;
        }),
      };
    default:
      return state;
  }
};
