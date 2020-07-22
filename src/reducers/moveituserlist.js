import { MOVEIT_USERS_LIST, MOVEIT_USERS_FILTER} from '../constants/actionTypes';

export default (state = {moveituserlist:[],search:'',online_status:-1}, action) => {
  switch (action.type) {
    case MOVEIT_USERS_LIST:
      return {
        ...state,
        moveituserlist:action.payload.result
      };
      case MOVEIT_USERS_FILTER:
      return {
        ...state,
        search:action.search,
        online_status:action.online_status
      };
    default:
      return state;
  }
};
