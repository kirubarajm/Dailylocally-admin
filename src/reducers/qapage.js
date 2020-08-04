import {
  QA_LIST,
  QA_REPORT,
  QA_QUALITY_LIST,
  UPDATE_QA_LIST,
  ORDERS_QA_SUBMIT,
  ORDERS_QA_CLEAR,
  SORTING_SUBMIT_REPORT
} from "../constants/actionTypes";

export default (
  state = {
    qaList: [],
    qcreport: [],
    quality: [
      { id: 0, name: "No" },
      { id: 1, name: "Yes" },
    ],
    report_sorting: [
      { id: 1, report: "Bad quality products" },
      { id: 2, report: "Quantity shown is not available" },
    ],
    qualitytype: [],
    qa_submitted: false,
    isReportSubmiting:false,
    totalcount:0,
    pagelimit:0
  },
  action
) => {
  switch (action.type) {
    case QA_LIST:
      return {
        ...state,
        qaList: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
      case QA_REPORT:
      return {
        ...state,
        qcreport: action.payload.result || [],
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
        qa_submitted: action.payload.status || false,
      };
    case ORDERS_QA_CLEAR:
      return {
        ...state,
        qa_submitted: false,
        isReportSubmiting: false,
      };
    case SORTING_SUBMIT_REPORT:
      return {
        ...state,
        isReportSubmiting: action.payload.status || false,
      };
    default:
      return state;
  }
};
