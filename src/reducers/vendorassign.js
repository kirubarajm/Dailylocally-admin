import { PR_VENDOR_ASSIGN_LIST,GET_VENDOR_LIST,UPDATE_VENDOR_LIST, CREATE_PO, CLEAR_PO } from "../constants/actionTypes";


export default (state = {pocreatelist:[],poCreated:false,vendor_list:[]}, action) => {
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
      case UPDATE_VENDOR_LIST:
      return {
        ...state,
        pocreatelist: state.pocreatelist.map((item) => {
          if (action.data.pridList.includes(""+item.prid)) {
            return Object.assign({}, item, {
              buyer_comment: action.data.buyer_comment,
              exp_date: action.data.exp_date,
              vendor_name:action.data.suplier.name,
              vendor_code:action.data.suplier.vid,
              other_charges: action.data.suplier.other_charges,
              rate: action.data.suplier.base_price,
              amount:(action.data.suplier.base_price*item.quantity),
            })
          }
          return item
        }),
      };
    default:
      return state;
  }

};
