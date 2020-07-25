import React from "react";
import {
  MOVEIT_VIEW_DETAIL,
  MOVEIT_FORCE_LOGOUT,
} from "../constants/actionTypes";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import ViewMoveitUser from "./ViewMoveitUser";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
const mapStateToProps = (state) => ({ ...state.viewmoveit });

const mapDispatchToProps = (dispatch) => ({
  onGetUser: (id) =>
    dispatch({
      type: MOVEIT_VIEW_DETAIL,
      payload: AxiosRequest.Moveit.getView(id),
    }),
  onMoveitForceLogout: (data) =>
    dispatch({
      type: MOVEIT_FORCE_LOGOUT,
      payload: AxiosRequest.Moveit.forceLogout(data),
    }),
});

class ViewMoveitPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      pageRefresh: false,
    };
  }
  componentWillMount() {
    const userid = this.props.match.params.userid;
    this.props.onGetUser({ userid: userid });
    this.togglelogout = this.togglelogout.bind(this);
    this.confirmToLogout = this.confirmToLogout.bind(this);
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.props.pageRefresh) {
      const userid = this.props.match.params.userid;
      if (this.state.logout) {
        this.setState((prevState) => ({
          logout: !prevState.logout,
        }));
        this.props.onGetUser({ userid: userid });
      }
    }
  }
  togglelogout() {
    this.setState((prevState) => ({
      logout: !prevState.logout,
    }));
  }
  confirmToLogout() {
    var propdata = this.props.viewmoveituser;
    var login_status = 1; //propdata.login_status==1?3
    if (propdata.login_status === 1 || propdata.login_status === 2)
      login_status = 3;
    else if (propdata.login_status === 3) login_status = 2;
    var data = {
      userid: propdata.userid,
      phoneno: propdata.phoneno,
      login_status: login_status,
    };
    this.props.onMoveitForceLogout(data);
  }
  render() {
    var propMoveitdata=this.props.viewmoveituser;
    var logout_state=(propMoveitdata.login_status===1||propMoveitdata.login_status===2)?'Disable':'Enable';
    return (
      <div className="pd-8">
        <ViewMoveitUser
          title="Details"
          forceLogout={this.togglelogout}
          propdata={this.props.viewmoveituser}
        />
        <Modal
          isOpen={this.state.logout}
          toggle={this.togglelogout}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={this.togglelogout}>confirmation</ModalHeader>
          <ModalBody>Are you sure? you want to {logout_state} this moveit user.</ModalBody>
          <ModalFooter>
            <Button color="secondary" size="sm" onClick={this.confirmToLogout}>
              Yes
            </Button>{" "}
            <Button color="danger" size="sm" onClick={this.togglelogout}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewMoveitPage);
