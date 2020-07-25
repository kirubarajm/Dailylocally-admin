import {
  MOVEIT_USRE_PAGE_LOADED,
  MOVEIT_VIEW_DETAIL,
  MOVEIT_USRE_PAGE_UNLOADED,
  MOVEIT_UPDATE_FIELD,
  MOVEIT_ADD_USER,
  MOVEIT_FORM_CLEAR,
  MOVEIT_USER_DETAIL,
  MOVEIT_UPDATE_IMAGE_FIELD,
  MOVEIT_CLEAR_IMAGE_FIELD,
  MOVEIT_USERS_EDIT
} from "../constants/actionTypes";

export default (
  state = {
    userAddSuccess: false,
    userEditSuccess: false,
    userPrefillSuccess: false,
    viewmoveittuser: {},
  },
  action
) => {
  switch (action.type) {
    case MOVEIT_USRE_PAGE_LOADED:
      return {
        ...state,
      };
    case MOVEIT_USRE_PAGE_UNLOADED:
      return {};
    case MOVEIT_UPDATE_FIELD:
      return { ...state, [action.key]: action.payload.result.Location };
    case MOVEIT_UPDATE_IMAGE_FIELD:
      return { ...state, [action.key]: action.data };
    case MOVEIT_ADD_USER:
      return {
        ...state,
        userAddSuccess: action.payload.status,
      };
      case MOVEIT_USERS_EDIT:
      return {
        ...state,
        userEditSuccess: action.payload.status,
      };
    case MOVEIT_FORM_CLEAR:
      return {
        ...state,
        userEditSuccess:false,
        userAddSuccess: false,
        userPrefillSuccess: false,
      };
    case MOVEIT_VIEW_DETAIL:
      return {
        ...state,
        viewmoveituser: action.payload.result[0],
        pageRefresh: false,
      };
    case MOVEIT_CLEAR_IMAGE_FIELD:
      return {
        ...state,
        driver_lic: null,
        vech_insurance: null,
        vech_rcbook: null,
        photo: null,
        legal_document: null,
      };
    case MOVEIT_USER_DETAIL:
      return {
        ...state,
        userPrefillSuccess: true,
        viewmoveittuser: action.payload.result[0],
      };
    default:
      return state;
  }
};
