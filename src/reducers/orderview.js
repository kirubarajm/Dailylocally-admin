import {
  TRACK_ORDER_VIEW,
  ORDER_CANCEL_REASON,
  POST_ORDER_CANCEL,
  ORDER_ACTION_CLEAR,
  ORDER_REORDER_REASON,
  DELETE_PROOF_IMAGES,
  UPDATE_PROOF_IMAGES,
} from "../constants/actionTypes";

export default (
  state = {
    orderview: {},
    actionList: [
      { id: 1, name: "Cancel" },
      { id: 2, name: "Reorder" },
      { id: 3, name: "Book Return" },
      { id: 4, name: "Refund" },
      { id: 5, name: "Reassign" },
      { id: 6, name: "Send notification to driver" },
      { id: 7, name: "Send notification to customer" },
      { id: 8, name: "Raise Ticket" },
    ],
    cancelList: [],
    reorderList: [],
    ProofImage: [],
    isCanceled: false,
  },
  action
) => {
  switch (action.type) {
    case TRACK_ORDER_VIEW:
      return {
        ...state,
        orderview: action.payload.result[0] || [],
      };
    case ORDER_CANCEL_REASON:
      return {
        ...state,
        cancelList: action.payload.result || [],
      };
    case ORDER_REORDER_REASON:
      return {
        ...state,
        reorderList: action.payload.result || [],
      };
    case POST_ORDER_CANCEL:
      return {
        ...state,
        isCanceled: action.payload.status || false,
      };
    case UPDATE_PROOF_IMAGES:
      var imagePath = {
        img_url: action.payload.result.Location,
        type: action.imgtype,
      };
      return {
        ...state,
        ProofImage: [...state.ProofImage, imagePath],
      };
    case DELETE_PROOF_IMAGES:
      return {
        ...state,
        ProofImage: [],
      };
    case ORDER_ACTION_CLEAR:
      return {
        ...state,
        isCanceled: false,
      };
    default:
      return state;
  }
};
