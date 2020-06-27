import {
  PO_LIST,
  PO_VIEW,
  PO_DELETE,
  PO_CLOSE,
  PO_CLEAR,
} from "../constants/actionTypes";

export default (
  state = {
    movetopo: false,
    poList: [],
    poview: false,
    deleteStatus: false,
    closeStatus: false,
    receving: [
      { id: -1, name: "All" },
      { id: 0, name: "Receving" },
      { id: 1, name: "Not Receving" },
    ],
    postatus: [
      { id: -1, name: "All" },
      { id: 0, name: "Open" },
      { id: 1, name: "Close" },
    ],
  },
  action
) => {
  switch (action.type) {
    case PO_LIST:
      return {
        ...state,
        poList: action.payload.result || [],
      };
    case PO_VIEW:
      return {
        ...state,
        poview: action.payload.result[0] || false,
      };

    case PO_DELETE:
      return {
        ...state,
        deleteStatus: action.payload.status || false,
      };

    case PO_CLOSE:
      return {
        ...state,
        closeStatus: action.payload.status || false,
      };
      case PO_CLEAR:
      return {
        ...state,
        deleteStatus:false,
        closeStatus: false,
      };

    default:
      return state;
  }
};
