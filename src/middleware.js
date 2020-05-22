import AxiosRequest from './AxiosRequest';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  TOAST_SHOW,
} from './constants/actionTypes';
const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        if(res.message)
        store.dispatch({ type: TOAST_SHOW, message: res.message });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        action.error = true;
        if(error.response!==undefined)
        action.payload = error.response;
        else action.payload =error.message;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        if(error.response&&error.response.data&&error.response.data.message)
        store.dispatch({ type: TOAST_SHOW, message: error.response.data.message });
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  if (action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem('admin_login_status',action.payload.status);
      window.localStorage.setItem('admin_user_detail',JSON.stringify({logindetail:action.payload.result[0]}));
      AxiosRequest.setToken(action.payload.token);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('admin_login_status',false);
    window.localStorage.setItem('admin_user_detail',JSON.stringify(''));
    AxiosRequest.setToken(null);
  } 
  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware}
