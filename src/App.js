import React from "react";
import "./App.css";
import EmptyLayout from "./components/EmptyLayout";
import "./styles/reduction.css";
import { Switch, withRouter, Redirect } from "react-router-dom";
import LayoutRoute from "./components/LayoutRoute";
import Signup from "./pages/Signup";
import { connect } from "react-redux";
import { loadProgressBar } from "axios-progress-bar";
import Notifications from "react-notify-toast";
import { MainLayout } from "./components";
import Catalog from "./pages/Catalog";
import ProductView from "./pages/ProductView";
import ProductAddEdit from "./pages/ProductAddEdit";
import Warehouse from "./pages/Warehouse";
import {
  ZONE_LIST_VIEW,
  REDIRECT,
  ADMIN_USER_DETAIL,
  LOGOUT,
} from "./constants/actionTypes";
import AxiosRequest from "./AxiosRequest";
import VendorAssign from "./pages/VendorAssign";
import StockKeeping from "./pages/StockKeeping";
import StockKeepingAdd from "./pages/StockKeepingAdd";
import Crm from "./pages/Crm";
import OrderView from "./pages/OrderView";
import UserList from "./pages/UserList";
import TransactionList from "./pages/TransactionList";
import LogisticsOrders from "./pages/LogisticsOrders";
import DunzoOrders from "./pages/DunzoOrders";
import TripOrders from "./pages/TripOrders";
import AddMoveitUserForm from "./pages/AddMoveitUserForm";
import MoveitUserList from "./pages/MoveitUserList";
import ViewMoveitPage from "./pages/ViewMoveitPage";
import RefundApproval from "./pages/RefundApproval";
import {
  getLoginStatus,
  getAdminId,
  getLoginDetail,
} from "./utils/ConstantFunction";
import StockKeepingTab from "./pages/StockKeepingTab";
import CommunityTab from "./pages/CommunityTab";
import PushnotificationTab from "./pages/Pushnotification";
import CatalogTab from "./pages/CatalogTab";
import Vendor from "./pages/Vendor";
import Collection from "./pages/Collection";
import CollectionDragDrop from "./pages/CollectionDragDrop";
const mapStateToProps = (state) => ({ ...state.common });

const mapDispatchToProps = (dispatch) => ({
  onGetZone: (data) =>
    dispatch({
      type: ZONE_LIST_VIEW,
      payload: AxiosRequest.Catelog.getZoneList(data),
    }),
  onGetUserDetail: (data) =>
    dispatch({
      type: ADMIN_USER_DETAIL,
      payload: AxiosRequest.Admin.getuserdetail(data),
    }),
  onLogout: (data) =>
    dispatch({ type: LOGOUT, payload: AxiosRequest.Admin.logout(data) }),
  onRedirect: () => dispatch({ type: REDIRECT }),
});
class App extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    loadProgressBar();
    if (nextProps.redirectTo) {
      this.props.history.push(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }
  UNSAFE_componentWillMount() {
    this.setState({ isProfileUpdate: false });
    if (this.props.zone_list.length === 0) this.props.onGetZone();
    if (getLoginStatus() === 1)
      this.props.onGetUserDetail({ admin_userid: getAdminId() });
    if (this.props.redirectTo) {
      this.props.history.push(this.props.redirectTo);
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.props.userdetail && !this.state.isProfileUpdate) {
      this.setState({ isProfileUpdate: true });
      var localdetail = getLoginDetail();
      if (localdetail.logindetail.password === this.props.userdetail.password) {
        window.localStorage.setItem(
          "dl2admin_user_detail",
          JSON.stringify({ logindetail: this.props.userdetail })
        );
      } else {
        var data = { admin_userid: getAdminId() };
        this.props.onLogout(data);
      }
    }
  }

  render() {
    if (getLoginStatus() === 0) {
      return (
        <div>
          <Notifications options={{ zIndex: 1052, top: "0px" }} />
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={Signup}
            />
            <Redirect to="/login" />
          </Switch>
        </div>
      );
    } else {
      return (
        <div>
          <Notifications options={{ zIndex: 1052, top: "0px" }} />
          <Switch>
            {/* <LayoutRoute
              exact
              path="/dashboard"
              layout={MainLayout}
              component={Catalog}
            /> */}

            <LayoutRoute
              exact
              path="/product_view/:product_id"
              layout={MainLayout}
              component={ProductView}
            />

            <LayoutRoute
              exact
              path="/product_edit/:product_id"
              layout={MainLayout}
              component={ProductAddEdit}
            />

            <LayoutRoute
              exact
              path="/product_add"
              layout={MainLayout}
              component={ProductAddEdit}
            />
            <LayoutRoute
              exact
              path="/warehouse"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/warehouse/dayoders"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/warehouse/po"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/warehouse/procurement"
              layout={MainLayout}
              component={Warehouse}
            />

            <LayoutRoute
              exact
              path="/warehouse/receiving"
              layout={MainLayout}
              component={Warehouse}
            />

            <LayoutRoute
              exact
              path="/warehouse/sorting"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/warehouse/qc"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/warehouse/return"
              layout={MainLayout}
              component={Warehouse}
            />
            <LayoutRoute
              exact
              path="/vendor-assign"
              layout={MainLayout}
              component={VendorAssign}
            />

            <LayoutRoute
              exact
              path="/collection-reorder"
              layout={MainLayout}
              component={CatalogTab}
            />

            <LayoutRoute
              exact
              path="/stock/keeping"
              layout={MainLayout}
              component={StockKeepingTab}
            />

            <LayoutRoute
              exact
              path="/stock/wastage"
              layout={MainLayout}
              component={StockKeepingTab}
            />

            <LayoutRoute
              exact
              path="/stock/missing"
              layout={MainLayout}
              component={StockKeepingTab}
            />

            <LayoutRoute
              exact
              path="/stock-keeping-add"
              layout={MainLayout}
              component={StockKeepingAdd}
            />
            <LayoutRoute
              exact
              path="/crm"
              layout={MainLayout}
              component={Crm}
            />
            <LayoutRoute
              exact
              path="/user"
              layout={MainLayout}
              component={UserList}
            />
            <LayoutRoute
              exact
              path="/community/master"
              layout={MainLayout}
              component={CommunityTab}
            />

            <LayoutRoute
              exact
              path="/community/user"
              layout={MainLayout}
              component={CommunityTab}
            />

            <LayoutRoute
              exact
              path="/community/dashboard"
              layout={MainLayout}
              component={CommunityTab}
            />
            <LayoutRoute
              exact
              path="/crm/:userid"
              layout={MainLayout}
              component={Crm}
            />
            <LayoutRoute
              exact
              path="/logistics"
              layout={MainLayout}
              component={LogisticsOrders}
            />
            <LayoutRoute
              exact
              path="/dunzo_orders"
              layout={MainLayout}
              component={DunzoOrders}
            />
            <LayoutRoute
              exact
              path="/trip_orders"
              layout={MainLayout}
              component={TripOrders}
            />
            <LayoutRoute
              exact
              path="/transaction/:userid"
              layout={MainLayout}
              component={TransactionList}
            />
            <LayoutRoute
              exact
              path="/moveit-add"
              layout={MainLayout}
              component={AddMoveitUserForm}
            />
            <LayoutRoute
              exact
              path="/moveit-list"
              layout={MainLayout}
              component={MoveitUserList}
            />
            <LayoutRoute
              exact
              path="/refund-approval"
              layout={MainLayout}
              component={RefundApproval}
            />
            <LayoutRoute
              exact
              path="/moveit-edit/:userid"
              layout={MainLayout}
              component={AddMoveitUserForm}
            />
            <LayoutRoute
              exact
              path="/viewmoveituser/:userid"
              layout={MainLayout}
              component={ViewMoveitPage}
            />

            <LayoutRoute
              exact
              path="/orderview/:id"
              layout={MainLayout}
              component={OrderView}
            />

            <LayoutRoute
              exact
              path="/sendnotification"
              layout={MainLayout}
              component={PushnotificationTab}
            />

<LayoutRoute
              exact
              path="/catalog/view"
              layout={MainLayout}
              component={CatalogTab}
            />

            <LayoutRoute
              exact
              path="/catalog/edit"
              layout={MainLayout}
              component={CatalogTab}
            />

            <LayoutRoute
              exact
              path="/vendors"
              layout={MainLayout}
              component={CatalogTab}
            />

            <LayoutRoute
              exact
              path="/brands"
              layout={MainLayout}
              component={CatalogTab}
            />

            <LayoutRoute
              exact
              path="/collection"
              layout={MainLayout}
              component={CatalogTab}
            />

            <Redirect to="/catalog/view" />
          </Switch>
        </div>
      );
    }
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
