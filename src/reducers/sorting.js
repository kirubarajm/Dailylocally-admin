import {
  SORTING_LIST,
  SORTING_SUBMIT_ITEM,
  SORTING_SAVING_ITEM,
  SORTING_CLEAR,
  SORTING_SUBMIT_REPORT,
} from "../constants/actionTypes";

export default (
  state = {
    sortingList: [],
    report_sorting: [
      { id: 1, report: "Bad quality products" },
      { id: 2, report: "Quantity shown is not available" },
    ],
    isSaving: false,
    isSubmiting: false,
    isReportSubmiting:false,
  },
  action
) => {
  switch (action.type) {
    case SORTING_LIST:
      return {
        ...state,
        sortingList: action.payload.result || [],
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
