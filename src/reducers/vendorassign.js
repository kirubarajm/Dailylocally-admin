import { PR_VENDOR_ASSIGN_LIST,GET_VENDOR_LIST } from "../constants/actionTypes";


export default (state = {pocreatelist:[]}, action) => {
  switch (action.type) {
    case PR_VENDOR_ASSIGN_LIST:
      return {
        ...state,
        pocreatelist: action.payload.data || [],
      };
      case GET_VENDOR_LIST:
      return {
        ...state,
        vendor_list: action.payload.data || [],
      };
    default:
      return state;
  }

};
