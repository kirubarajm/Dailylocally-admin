import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import sample from './reducers/sample'
import auth from './reducers/auth';
import catalog from './reducers/catalog'
import productview from './reducers/productview'
import productaddedit from './reducers/productaddedit'
import catsubaddedit from './reducers/catsubaddedit'
import vendoredit from './reducers/vendoredit'
export default combineReducers({
  router: routerReducer,
  form: formReducer,
  auth,
  sample,
  catalog,
  productview,
  productaddedit,
  catsubaddedit,
  vendoredit
});
