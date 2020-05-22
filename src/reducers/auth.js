import {
  LOGIN,
  LOGOUT,
  ASYNC_START,
} from '../constants/actionTypes';

export default (state = {loginsuccess:false,logindetail:null,isRedirect:false}, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        inProgress: false,
        loginsuccess:action.payload.status,
        logindetail:action.payload.result[0],
        isRedirect:action.payload.status,
      };
    case LOGOUT:
      return {
        ...state,
        inProgress: false,
        //loginsuccess:action.payload.status,
        //logindetail:null
      };
  
    case ASYNC_START:
      if (action.subtype === LOGIN) {
        return { ...state, inProgress: true };
      }
      break;
    default:
      return state;
  }

  return state;
};
