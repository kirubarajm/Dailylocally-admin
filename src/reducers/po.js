import {
  PO_LIST,
  PO_REPORT,
  PO_VIEW,
  PO_DELETE,
  PO_CLOSE,
  PO_CLEAR,
  PO_DELETE_REASON_LIST,
} from "../constants/actionTypes";

export default (
  state = {
    movetopo: false,
    po_reason_list: false,
    poList: [],
    poreport: [],
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
      { id: 0, name: "Request" },
      { id: 1, name: "Received" },
      { id: 2, name: "Un Received" },
      { id: 3, name: "Close" },
      { id: 4, name: "Delete" },
    ],
    totalcount: 0,
    pagelimit: 0,
  },
  action
) => {
  switch (action.type) {
    case PO_LIST:
      return {
        ...state,
        poList: action.payload.result || [],
        totalcount: action.payload.totalcount || 0,
        pagelimit: action.payload.pagelimit || 0,
      };
    case PO_REPORT:
      return {
        ...state,
        poreport: action.payload.result || [],
      };
    case PO_DELETE_REASON_LIST:
      return {
        ...state,
        po_reason_list: action.payload.result || [],
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
        deleteStatus: false,
        closeStatus: false,
      };

    default:
      return state;
  }
};
