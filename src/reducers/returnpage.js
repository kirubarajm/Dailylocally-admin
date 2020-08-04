import {
  RETURN_LIST,
  RETURN_REPORT,
  RETURN_SUBMIT_ITEM,
  SORTING_SAVING_ITEM,
  SORTING_CLEAR,
  SORTING_SUBMIT_REPORT,
  RETURN_SORTING_ITEM,
} from "../constants/actionTypes";

export default (
  state = {
    sortingList: [],
    returnReport: [],
    report_sorting: [
      { id: 1, report: "Bad quality products" },
      { id: 2, report: "Quantity shown is not available" },
    ],
    isSaving: false,
    isSubmiting: false,
    isReportSubmiting:false,
    totalcount:0,
    pagelimit:0
  },
  action
) => {
  switch (action.type) {
    case RETURN_LIST:
      return {
        ...state,
        sortingList: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
      case RETURN_REPORT:
        return {
          ...state,
          returnReport: action.payload.result || [],
        };
    case SORTING_SAVING_ITEM:
      return {
        ...state,
        isSaving: action.payload.status || false,
      };
    case RETURN_SUBMIT_ITEM:
      return {
        ...state,
        isSubmiting: action.payload.status || false,
      };
      case RETURN_SORTING_ITEM:
      return {
        ...state,
        isReturning: action.payload.status || false,
      };
      
      case SORTING_SUBMIT_REPORT:
      return {
        ...state,
        isReportSubmiting: action.payload.status || false,
      };
      
    case SORTING_CLEAR:
      return {
        ...state,
        isSubmiting: false,
        isSaving: false,
        isReportSubmiting:false,
        isReturning:false
      };
    default:
      return state;
  }
};
