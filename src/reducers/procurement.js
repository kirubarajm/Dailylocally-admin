import { PROCUREMENT_REPORT,PROCUREMENT_LIST, MOVE_TO_PO_WAITING,ON_CLEAR_PO_WAITING, MOVE_TO_PO_STOCK} from "../constants/actionTypes";

export default (
  state = { movetopo: false, movetoStock:false,procurmentlist: [],procurementreport:[],totalcount:0,pagelimit:0 },
  action
) => {
  switch (action.type) {
    case PROCUREMENT_LIST:
      return {
        ...state,
        procurmentlist: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
      case PROCUREMENT_REPORT:
      return {
        ...state,
        procurementreport: action.payload.result || [],
      };
      
    case MOVE_TO_PO_WAITING:
      return {
        ...state,
        movetopo: action.payload.status || false,
      };
      case MOVE_TO_PO_STOCK:
      return {
        ...state,
        movetoStock: action.payload.status || false,
      };
    case ON_CLEAR_PO_WAITING:
      return {
        ...state,
        movetopo: false,
        movetoStock:false
      };
    default:
      return state;
  }
};
