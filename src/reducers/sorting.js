import {
  SORTING_LIST,
  SORTING_REPORT,
  SORTING_SUBMIT_ITEM,
  SORTING_SAVING_ITEM,
  SORTING_CLEAR,
  SORTING_SUBMIT_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    sortingList: [],
    sortingreport: [],
    report_sorting: [
      { id: 2, report: "Bad quality products" },
      { id: 1, report: "Quantity shown is not available" },
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
    case SORTING_LIST:
      return {
        ...state,
        sortingList: action.payload.result || [],
        totalcount:action.payload.totalcount || 0,
        pagelimit:action.payload.pagelimit || 0,
      };
      case SORTING_REPORT:
      return {
        ...state,
        sortingreport: action.payload.result || [],
      };
      
    case SORTING_SAVING_ITEM:
      return {
        ...state,
        isSaving: action.payload.status || false,
      };
    case SORTING_SUBMIT_ITEM:
      return {
        ...state,
        isSubmiting: action.payload.status || false,
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
      };
    default:
      return state;
  }
};
