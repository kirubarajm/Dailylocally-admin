import { QA_LIST,QA_QUALITY_LIST,UPDATE_QA_LIST, ORDERS_QA_SUBMIT,ORDERS_QA_CLEAR} from "../constants/actionTypes";

export default (
  state = {qaList: [],quality:[{id:0,name:"No"},{id:1,name:"Yes"}],qualitytype:[],qa_submitted:false },
  action
) => {
  switch (action.type) {
    case QA_LIST:
      return {
        ...state,
        qaList: action.payload.result || [],
      };
      case QA_QUALITY_LIST:
      return {
        ...state,
        qualitytype: action.payload.result || [],
      };
      case UPDATE_QA_LIST:
        return {
          ...state,
          qaList: Object.assign([], state.qaList, {
            [action.index]: action.item,
          }),
        };
        case ORDERS_QA_SUBMIT:
        return {
          ...state,
          qa_submitted:action.payload.status ||false
        };
        case ORDERS_QA_CLEAR:
          return {
            ...state,
            qa_submitted:false
          };
    default:
      return state;
  }
};
