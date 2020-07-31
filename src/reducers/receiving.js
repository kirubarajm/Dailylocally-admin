import { RECEIVING_LIST, RECEIVING_UPDATE,RECEIVING_CLEAR, UNRECEIVING_UPDATE, MOVE_TO_SORTING } from "../constants/actionTypes";
//{ id: 2, name: "UnReceiving" },
export default (
  state = {
    recevingList: [],
    receving_update:false,
    sorting_update:false,
    receivingAction: [
      { id: 1, name: "Receiving" },
      { id: 2, name: "UnReceiving" },
    ],
    unreceivingAction: [
      { id: 2, name: "UnReceiving" },
    ],
    totalcount:0,
    pagelimit:0
  },
  action
) => {
  switch (action.type) {
    case RECEIVING_LIST:
      return {
        ...state,
        recevingList: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
    case RECEIVING_UPDATE:
      return {
        ...state,
        receving_update: action.payload.status || false,
      };
      case UNRECEIVING_UPDATE:
      return {
        ...state,
        receving_update: action.payload.status || false,
      };
      case MOVE_TO_SORTING:
      return {
        ...state,
        sorting_update: action.payload.status || false,
      };
      case RECEIVING_CLEAR:
        return {
          ...state,
          receving_update: false,
          sorting_update:false,
        };
    default:
      return state;
  }
};
