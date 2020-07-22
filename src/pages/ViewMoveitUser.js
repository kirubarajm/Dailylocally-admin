import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Media,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { FaEdit, FaPowerOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import { history } from "../store";
import PasswordShow from "../components/PasswordShow";
var imgStyle = {
  maxWidth: "250px",
  maxHeight: "300px",
  padding: "10px",
};
function CardRowCol(props) {
  var lg = props.lg ? props.lg : "12";
  var lable = props.lable ? props.lable : "";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item">
        <Col lg={lg} className="lable">
          {lable}
        </Col>
        <Col>{props.value}</Col>
      </Row>
    );
  }

  return <div></div>;
}

function EnableDisableToggle(props) {
  //login_status 1- login,2-logout,3-forace logout.
  if (props.login_status === 1 || props.login_status === 2) {
    return (
      <Button className="mr-r-10" onClick={props.forceLogout} size="sm">
        Disable
      </Button>
    );
  } else if (props.login_status === 3) {
    return (
      <Button className="mr-r-10" onClick={props.forceLogout} size="sm">
        Enable
      </Button>
    );
  }

  return "";
}

class ViewMoveitUser extends React.Component {
  componentWillMount() {
    this.setState({ activeTab: "1" });
    this.tabsToggle = this.tabsToggle.bind(this);
  }

  tabsToggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const propdata = this.props.propdata;
    const name = propdata.name;
    const password = propdata.password;
    const email = propdata.email;
    const phonenumber = propdata.phoneno;
    const address = propdata.address;

    const proof = [];
    if (propdata.driver_lic)
      proof.push({ name: "Driving License", proof_url: propdata.driver_lic });
    if (propdata.vech_insurance)
      proof.push({
        name: "Vehicle Insurance",
        proof_url: propdata.vech_insurance,
      });
    if (propdata.vech_rcbook)
      proof.push({ name: "Vehicle RC Book", proof_url: propdata.vech_rcbook });
    if (propdata.photo)
      proof.push({ name: "Photo", proof_url: propdata.photo });
    if (propdata.legal_document)
      proof.push({
        name: "Legal Document",
        proof_url: propdata.legal_document,
      });
    return (
      <div className="pd-8">
        <Card>
          <CardHeader>
            {name}
            <span className="float-right">
              <Link
                to={`/moveit-edit/${propdata.userid}`}
                className="preview-link"
              >
                <Button color="link">
                  <FaEdit size={22} />
                </Button>
              </Link>
              <EnableDisableToggle
                login_status={propdata.login_status}
                forceLogout={this.props.forceLogout}
              />
              <Button className="mr-r-10" onClick={history.goBack} size="sm">
                Back
              </Button>
            </span>
          </CardHeader>
          <CardBody className="scrollbar pd-10 view-form">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "1" ? "active" : ""}
                  onClick={() => {
                    this.tabsToggle("1");
                  }}
                >
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "2" ? "active" : ""}
                  onClick={() => {
                    this.tabsToggle("2");
                  }}
                >
                  Account
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col lg="2" className="lable">
                    {" "}
                    Email :
                  </Col>
                  <Col> {email}</Col>
                </Row>
                <Row>
                  <Col lg="2" className="lable">
                    {" "}
                    Phone :
                  </Col>
                  <Col> {phonenumber}</Col>
                </Row>
                <Row>
                  <Col lg="2" className="lable">
                    Zone :
                  </Col>
                  <Col> {propdata.Zonename}</Col>
                </Row>
                <Row>
                  <Col lg="2" className="lable">
                    {" "}
                    Address :
                  </Col>
                  <Col> {address}</Col>
                </Row>
                <Row>
                  <Col lg="2" className="lable">
                    {" "}
                    Password :
                  </Col>
                  <Col>
                    {" "}
                    <PasswordShow password={password} />
                  </Col>
                </Row>
                <Row hidden={proof.length === 0}>
                  <Col lg="2" className="lable">
                    {" "}
                    Proof:
                  </Col>
                  <Col lg="10">
                    <Row className="pd-10 mr-t-10 image-gallery-parent">
                      {proof.map((item, i) => (
                        <Col key={i}>
                          <Media left key={i}>
                            <div className="txt-align-center lable">
                              {item.name}
                            </div>
                            <Media
                              className="gallary-img-style"
                              style={imgStyle}
                              object
                              src={item.proof_url}
                              alt={item.name}
                            />
                          </Media>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <CardRowCol
                  lg="2"
                  lable="Account No :"
                  value={propdata.bank_account_no || "-"}
                />
                <CardRowCol
                  lg="2"
                  lable="Bank Name :"
                  value={propdata.bank_name || "-"}
                />
                {/* <CardRowCol lg='2' lable='Holder Name :' value={propdata.bank_holder_name || '-'} /> */}
                <CardRowCol
                  lg="2"
                  lable="IFSC Code :"
                  value={propdata.ifsc || "-"}
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default ViewMoveitUser;
