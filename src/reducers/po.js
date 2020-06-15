import { PO_LIST} from "../constants/actionTypes";

export default (
  state = { movetopo: false, poList: [] },
  action
) => {
  switch (action.type) {
    case PO_LIST:
      return {
        ...state,
        poList: action.payload.data || [],
      };
    default:
      return state;
  }
};
