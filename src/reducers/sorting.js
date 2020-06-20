import { SORTING_LIST, SORTING_SUBMIT_ITEM, SORTING_SAVING_ITEM, SORTING_CLEAR} from "../constants/actionTypes";

export default (
  state = {sortingList: [],isSaving:false,isSubmiting:false},
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
      case SORTING_CLEAR:
      return {
        ...state,
        isSubmiting:false,
        isSaving:false
      };
    default:
      return state;
  }
};
