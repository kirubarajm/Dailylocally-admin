import { LOGIN, LOGOUT, ASYNC_START, HOME_REDIRECT,LOGIN_PAGE_UNLOADED} from "../constants/actionTypes";

export default (
  state = { loginsuccess: false, logindetail: null, isRedirect: false },
  action
) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        inProgress: false,
        loginsuccess: action.payload.status,
        logindetail: action.payload.result[0],
        isRedirect: action.payload.status,
      };
    case LOGOUT:
      return {
        ...state,
        inProgress: false,
      };

    case ASYNC_START:
      if (action.subtype === LOGIN) {
        return { ...state, inProgress: true };
      }
      break;
      case LOGIN_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }

  return state;
};
