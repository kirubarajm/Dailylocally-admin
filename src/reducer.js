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
import warehouse from './reducers/warehouse'
import common from './reducers/common'
import dayorders from './reducers/dayorders'
import procurement from './reducers/procurement'
import po from './reducers/po'
export default combineReducers({
  router: routerReducer,
  form: formReducer,
  auth,
  sample,
  catalog,
  productview,
  productaddedit,
  catsubaddedit,
  vendoredit,
  warehouse,
  common,
  dayorders,
  procurement,
  po
});
