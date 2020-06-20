import { PO_LIST } from "../constants/actionTypes";

export default (
  state = {
    movetopo: false,
    poList: [],
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
    default:
      return state;
  }
};
