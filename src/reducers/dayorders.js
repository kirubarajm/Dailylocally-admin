import { DAT_ORDER_LIST, MOVE_TO_PROCUREMENT,ON_CLEAR_PROCUREMENT} from "../constants/actionTypes";

export default (
  state = { movetoprocurement: false, dayorderlist: [] },
  action
) => {
  switch (action.type) {
    case DAT_ORDER_LIST:
      return {
        ...state,
        dayorderlist: action.payload.result || [],
      };
    case MOVE_TO_PROCUREMENT:
      return {
        ...state,
        movetoprocurement: action.payload.status || false,
      };
    case ON_CLEAR_PROCUREMENT:
      return {
        ...state,
        movetoprocurement: false,
      };
    default:
      return state;
  }
};
