import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import sample from './reducers/sample'
import auth from './reducers/auth';

export default combineReducers({
  router: routerReducer,
  form: formReducer,
  auth,
  sample,
});
