import {
  TRACK_ORDER_VIEW,
  ORDER_CANCEL_REASON,
  POST_ORDER_CANCEL,
  ORDER_ACTION_CLEAR,
  ORDER_REORDER_REASON,
  DELETE_PROOF_IMAGES,
  UPDATE_PROOF_IMAGES,
  POST_RE_ORDER,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  POST_MESSAGE_TO_CUSTOMER,
  ORDER_ZENDESK_ISSUES,
  POST_ZENDESK_TICKET,
  TRACK_ORDER_LOGS,
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
      { id: 6, name: "Send Message to customer" },
      { id: 7, name: "Raise Ticket" },
    ],
    cancelList: [],
    reorderList: [],
    returnReasonList: [],
    zendeskissuesList: [],
    OrderLogs: [],
    ProofImage: [],
    isCanceled: false,
    isReordered: false,
    isReturnordered: false,
    isMessageSented: false,
    isTicketCreated: false,
  },
  action
) => {
  switch (action.type) {
    case TRACK_ORDER_VIEW:
      return {
        ...state,
        orderview: action.payload.result[0] || [],
      };
    case TRACK_ORDER_LOGS:
      return {
        ...state,
        OrderLogs: action.payload.result || [],
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
    case ORDER_RETURN_REASON:
      return {
        ...state,
        returnReasonList: action.payload.result || [],
      };
    case ORDER_ZENDESK_ISSUES:
      return {
        ...state,
        zendeskissuesList: action.payload.result || [],
      };
    case POST_ORDER_CANCEL:
      return {
        ...state,
        isCanceled: action.payload.status || false,
      };
    case POST_RE_ORDER:
      return {
        ...state,
        isReordered: action.payload.status || false,
      };
    case POST_RETURN_ORDER:
      return {
        ...state,
        isReturnordered: action.payload.status || false,
      };
    case POST_MESSAGE_TO_CUSTOMER:
      return {
        ...state,
        isMessageSented: action.payload.status || false,
      };
    case POST_ZENDESK_TICKET:
      return {
        ...state,
        isTicketCreated: action.payload.status || false,
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
        isReordered: false,
        isReturnordered: false,
        isMessageSented: false,
        isTicketCreated: false,
        ProofImage: [],
      };

    default:
      return state;
  }
};
