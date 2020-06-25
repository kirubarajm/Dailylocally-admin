import { RECEIVING_LIST, RECEIVING_UPDATE,RECEIVING_CLEAR } from "../constants/actionTypes";
//{ id: 2, name: "UnReceiving" },
export default (
  state = {
    recevingList: [],
    receving_update:false,
    receivingAction: [
      { id: 1, name: "Receiving" }
    ],
  },
  action
) => {
  switch (action.type) {
    case RECEIVING_LIST:
      return {
        ...state,
        recevingList: action.payload.result || [],
      };
    case RECEIVING_UPDATE:
      return {
        ...state,
        receving_update: action.payload.status || false,
      };
      case RECEIVING_CLEAR:
        return {
          ...state,
          receving_update: false,
        };
    default:
      return state;
  }
};
