import React from "react";
import { connect } from "react-redux";
import { COMMENT_ENTER_FORM } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col } from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import { IoMdSend } from "react-icons/io";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import { FaRocketchat, FaTimes } from "react-icons/fa";
import { MentionsInput, Mention } from "react-mentions";
import {
  POST_COMMENTS,
  CLEAR_COMMENT,
  UPDATE_COMMENT_IMAGES,
  DELETE_COMMAND_IMAGES,
} from "../constants/actionTypes";
import { getLoginDetail, getAdminId } from "../utils/ConstantFunction";
const mapStateToProps = (state) => ({ ...state.commententer });

const mapDispatchToProps = (dispatch) => ({
  onOrderPostComments: (data) =>
    dispatch({
      type: POST_COMMENTS,
      payload: AxiosRequest.CRM.postComment(data),
    }),
  onClear: () =>
    dispatch({
      type: CLEAR_COMMENT,
    }),
  onUpdateCommentmages: (data, imgtype) =>
    dispatch({
      type: UPDATE_COMMENT_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onDeleteImages: (imgType, index) =>
    dispatch({
      type: DELETE_COMMAND_IMAGES,
      imgType,
      index,
    }),
});
var kitchenSignatureImg = [1, 1];
var LoginName = null;
var userrole = null;
var loginDetail = null;
class CommentEditBox extends React.Component {
  UNSAFE_componentWillMount() {
    this.onAttach = this.onAttach.bind(this);
    this.onAttachClose = this.onAttachClose.bind(this);
    this.commentSubmit = this.commentSubmit.bind(this);
    this.setState({
      isAttched: false,
      mentionData: false,
      plainComment: false,
      comment: "",
    });
    loginDetail = getLoginDetail();
    if (loginDetail) {
      LoginName = loginDetail.logindetail.name;
      userrole = loginDetail.logindetail.usertype;
    }
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isCommentUpdate) {
      this.props.onClear();
      this.setState({
        comment: "",
        plainComment: false,
        mentionData: [],
      });
      this.props.update();
    }
  }

  componentDidCatch() {}

  onAttach = () => {
    this.setState({ isAttched: true });
  };
  onAttachClose = () => {
    this.setState({ isAttched: false });
  };
  commentSubmit = () => {
    var data = {};
    data.comments = this.state.plainComment;
    data.doid = this.props.dayorderdata.id;
    data.done_by = getAdminId();
    data.done_type = 1;
    data.type = 1;
    var emailids = [];
    if (this.state.mentionData.length!==0) {
      var mData = this.state.mentionData;
      for (var i = 0; i < mData.length; i++) {
        emailids.push(this.props.adminuserlist[mData[i].id].email);
      }
      data.email_list = emailids;
    }
    if (this.props.CommentImg.length > 0) {
      data.Img1 = this.props.CommentImg[0].img_url;
      if (this.props.CommentImg.length > 1)
        data.Img2 = this.props.CommentImg[1].img_url;
    }
    this.props.onOrderPostComments(data);
  };

  handleonRemove = (index) => {
    this.props.onDeleteImages(0, index);
  };

  handleCommantimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 1;
    data.append("type", type);
    this.props.onUpdateCommentmages(data, 0);
  };

  handleChangeComment = (event, newValue, newPlainTextValue, mentions) => {
    this.setState({
      comment: newValue,
      plainComment: newPlainTextValue,
      mentionData: mentions,
    });
    // console.log("men-->",mentions);
    // for (var i = 0; i < mentions.length; i++) {
    //   console.log("-----",this.props.adminuserlist[mentions[i].id].email);
    // }
  };

  render() {
    const userMentionData = this.props.adminuserlist.map((myUser,i) => ({
      id:i,
      display: myUser.name
    }));
    return (
      <div className="flex-column">
        <div className="flex-row">
          <div className="border-none">
            <FaRocketchat size="50" className="border-none" />
          </div>
          <div className="width-150 mr-l-10 pd-t-10 mr-r-10 font-size-14">
            <div>Name -{LoginName}</div>
            <div>{userrole}</div>
          </div>
          <MentionsInput
            style={{ width: "80%" }}
            className="comments-textarea"
            value={this.state.comment}
            onChange={this.handleChangeComment}
          >
            <Mention
              trigger="@"
              displayTransform={this.handleDisplayTextForMention}
              data={userMentionData}
              markup="@@@____id__^^____display__@@@^^^"
            />
          </MentionsInput>
          <Button
            className="btn btn-us"
            disabled={!this.state.plainComment}
            onClick={() => this.commentSubmit()}
          >
            <IoMdSend />
          </Button>
          <Button onClick={this.onAttach} hidden={this.state.isAttched} className="width-120">
            Attach File
          </Button>
          <Button onClick={this.onAttachClose} hidden={!this.state.isAttched} className="width-120">
            <FaTimes /> close
          </Button>
        </div>
        <Row
          className="mr-t-20 image-upload-parentpd-0"
          hidden={!this.state.isAttched}
        >
          <Col lg="12" className="flex-row" style={{marginLeft:'205px'}}>
          {kitchenSignatureImg.map((item, i) => (
            <div key={i}>
              <Field
                name={"L1SC" + i}
                index={i}
                component={DropzoneFieldMultiple}
                type="file"
                imgPrefillDetail={
                  this.props.CommentImg.length ? this.props.CommentImg[i] : ""
                }
                label="Photogropy"
                handleonRemove={() => this.handleonRemove(i)}
                handleOnDrop={() => this.handleCommantimages}
              />
           </div>
          ))}
           </Col>
        </Row>
      </div>
    );
  }
}
CommentEditBox = reduxForm({
  form: COMMENT_ENTER_FORM, // a unique identifier for this form
})(CommentEditBox);
export default connect(mapStateToProps, mapDispatchToProps)(CommentEditBox);
