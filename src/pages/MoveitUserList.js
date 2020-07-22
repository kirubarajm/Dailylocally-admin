import React from "react";
import AxiosRequest from "../AxiosRequest";
import SearchInput from "../components/SearchInput";
import PasswordShow from "../components/PasswordShow";
import {
  MOVEIT_USERS_LIST,
  MOVEIT_USERS_FILTER,
} from "../constants/actionTypes";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
} from "reactstrap";
import {
  FaMoneyBillAlt,
  FaMixcloud,
  FaRegDotCircle,
  FaMapMarkedAlt,
} from "react-icons/fa";

const mapStateToProps = (state) => ({ ...state.moveituserlist });
const mapDispatchToProps = (dispatch) => ({
  onGetUser: (data) =>
    dispatch({
      type: MOVEIT_USERS_LIST,
      payload: AxiosRequest.Moveit.getAll(data),
    }),
  onSetFilter: (search, online_status) =>
    dispatch({ type: MOVEIT_USERS_FILTER, search, online_status }),
});

class MoveitUserList extends React.Component {
  componentWillMount() {
    this.onFiltersApply(this.props.search, this.props.online_status);

    this.onSearch = (e) => {
      // if (e.keyCode === 13 && e.shiftKey === false) {
      // e.preventDefault();
      this.props.onSetFilter(e.target.value, this.props.online_status);
      this.onFiltersApply(e.target.value, this.props.online_status);
      //}
    };
    this.filterUser = this.filterUser.bind(this);
    this.onNavigateToMap = this.onNavigateToMap.bind(this);
  }
  onFiltersApply(search, online_status) {
    var filter = { search: search, online_status: online_status, zone_id: 1 };
    this.props.onGetUser(filter);
  }
  filterUser(id) {
    this.props.onSetFilter(this.props.search, id);
    this.onFiltersApply(this.props.search, id);
  }
  onNavigateToMap = () => {
    this.props.history.push("/moveit-current-location");
    //this.props.history.push('/zone-draw')
  };

  render() {
    const moveituserlist = this.props.moveituserlist || [];
    const online_status = this.props.online_status;
    return (
      <div className="pd-8">
        <Card>
          <CardHeader>
            Drivers
            <Row className="float-right">
              {/* <Col><FaMapMarkedAlt className='makeit-view-map-icon' onClick={()=>this.onNavigateToMap()}/></Col>
              <Col>
                <ButtonGroup size="sm">
                  <Button
                    color="primary"
                    onClick={()=>this.filterUser(-1)}
                    active={online_status === -1}
                  >
                    All
                  </Button>
                  <Button
                    color="primary"
                    onClick={()=>this.filterUser(1)}
                    active={online_status === 1}
                  >
                    Live
                  </Button>
                  <Button
                    color="primary"
                    onClick={()=>this.filterUser(0)}
                    active={online_status === 0}
                  >
                    Unlive
                  </Button>
                  <Button
                    color="primary"
                    onClick={()=>this.filterUser(-2)}
                    active={online_status === -2}
                  >
                    Inorders
                  </Button>
                </ButtonGroup>
              </Col> */}
              <Col className="txt-align-right">
              <Link to={`/moveit-add`} className="preview-link"><Button size="sm">Driver add</Button></Link>
              </Col>
              <Col>
                <SearchInput
                  onSearch={this.onSearch}
                  value={this.props.search}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="scrollbar pd-0">
            <Table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Online status</th>
                  <th>Zone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {moveituserlist.map((item, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <th scope="row">{item.userid}</th>
                    <td>{item.name}</td>
                    <td>{item.phoneno}</td>
                    <td>
                      {item.online_status == 1 ? (
                        <FaMixcloud color={"green"} size={20} />
                      ) : (
                        <FaRegDotCircle color={"red"} size={20} />
                      )}
                    </td>
                    <td>{item.Zonename}</td>
                    {/* <td>
                      <PasswordShow password={item.password} />
                    </td> */}
                    <td>
                      <Link
                        to={`/viewmoveituser/${item.userid}`}
                        className="preview-link"
                      >
                        <i className="fa fa-external-link-alt" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MoveitUserList);
