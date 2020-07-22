import { MOVEIT_VIEW_DETAIL, MOVEIT_FORCE_LOGOUT } from '../constants/actionTypes';

export default (state = {viewmoveituser:{},pageRefresh:false}, action) => {
  switch (action.type) {
    case MOVEIT_VIEW_DETAIL:
      return {
        ...state,
        viewmoveituser:action.payload.result[0],
        pageRefresh:false
      };
      case MOVEIT_FORCE_LOGOUT:
        return {
          ...state,
          pageRefresh:action.payload.status
        }; 
    default:
      return state;
  }
};
