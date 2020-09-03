import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
} from "reactstrap";
import {
  COMMUNITY_SELECTED_TAB,
} from "../constants/actionTypes";
import Community from "./Community";
import StockKeeping from "./StockKeeping";
import CommunityUser from "./CommunityUser";

const mapStateToProps = (state) => ({
  ...state.communitytab,
});

const mapDispatchToProps = (dispatch) => ({
  onSelectTabType: (tab_type) =>
    dispatch({
      type: COMMUNITY_SELECTED_TAB,
      tab_type,
    }),
});

const path = "/community";
class CommunityTab extends React.Component {
  constructor() {
    super();
  }

  UNSAFE_componentWillMount() {
    const { path } = this.props.match;
    this.onCommunityTabClick = this.onCommunityTabClick.bind(this);

    if (path.includes("/community/master")) {
      this.props.onSelectTabType(0);
    } else if (path.includes("/community/user")) {
      this.props.onSelectTabType(1);
    } else if (path.includes("/community/dashboard")) {
      this.props.onSelectTabType(2);
    }
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    
  }
  componentDidCatch() {}
  
  onCommunityTabClick = (tab) => {
    this.props.onSelectTabType(tab);
    if (tab === 0) {
      this.props.history.push("/community/master");
    } else if (tab === 1) {
      this.props.history.push("/community/user");
    } 

    // else if (tab === 2) {
    //   this.props.history.push("/community/dashboard");
    // }
  };

  render() {
    return (
      <div className="pd-6 width-full" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-84">
            <Row>
              <Col>
                <ButtonGroup size="sm">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(0)}
                    active={this.props.community_tab_type === 0}
                  >
                    Community Master
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(1)}
                    active={this.props.community_tab_type === 1}
                  >
                    User
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(2)}
                    active={this.props.community_tab_type === 2}
                  >
                    Dashboard
                  </Button>
                </ButtonGroup>
              </Col>
              <Col>
                
              </Col>
            </Row>
            <Row>
              <Switch>
                <Route
                  path={`${path}/master`}
                  exact
                  component={Community}
                />
                <Route path={`${path}/user`} component={CommunityUser} />
                <Redirect to={`${path}/master`} />
              </Switch>
            </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CommunityTab);
