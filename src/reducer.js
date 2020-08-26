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
import vendorassign from './reducers/vendorassign'
import receiving from './reducers/receiving'
import sorting from './reducers/sorting'
import qapage from './reducers/qapage'
import stockkeeping from './reducers/stockkeeping'
import stockkeepingadd from './reducers/stockkeepingadd'
import crm from './reducers/crm'
import orderview from './reducers/orderview'
import commententer from './reducers/commententer'
import userlist from './reducers/userlist'
import transaction from './reducers/transaction'
import logistics from './reducers/logistics'
import dunzoorders from './reducers/dunzoorders'
import triporders from './reducers/triporders'
import moveituser from './reducers/moveituser'
import moveituserlist from './reducers/moveituserlist'
import viewmoveit from './reducers/viewmoveit'
import mobileverify from './reducers/mobileverify'
import refundapproval from './reducers/refundapproval'
import returnpage from './reducers/returnpage'
import wastage from './reducers/wastage'
import missing from './reducers/missing'

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
  po,
  vendorassign,
  receiving,
  sorting,
  qapage,
  stockkeeping,
  stockkeepingadd,
  orderview,
  commententer,
  crm,
  transaction,
  logistics,
  userlist,
  dunzoorders,
  triporders,
  moveituser,
  moveituserlist,
  viewmoveit,
  mobileverify,
  refundapproval,
  returnpage,
  wastage,
  missing
});
