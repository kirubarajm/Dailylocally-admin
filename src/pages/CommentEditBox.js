import React from "react";
import { connect } from "react-redux";
import { COMMENT_ENTER_FORM } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col } from "reactstrap";
import { required } from "../utils/Validation";
import AxiosRequest from "../AxiosRequest";
import { IoMdSend } from "react-icons/io";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import { FaRocketchat, FaTimes } from "react-icons/fa";
import {
  POST_COMMENTS,
  CLEAR_COMMENT,
  UPDATE_COMMENT_IMAGES,
  DELETE_COMMAND_IMAGES,
} from "../constants/actionTypes";
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

const Replies = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div
      style={{ border: touched && error ? "1px solid red" : "none" }}
      className="replies_field"
    >
      <textarea
        style={{ padding: "5px" }}
        {...input}
        placeholder={label}
        type={type}
        autoComplete="off"
        cols={custom.cols}
        rows={custom.rows}
      />
      <span style={{ flex: "0", WebkitFlex: "0", height: "20px" }}>
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </span>
    </div>
  );
};

var kitchenSignatureImg = [1, 1];
class CommentEditBox extends React.Component {
  UNSAFE_componentWillMount() {
    this.onAttach = this.onAttach.bind(this);
    this.onAttachClose = this.onAttachClose.bind(this);
    this.commentSubmit = this.commentSubmit.bind(this);
    this.setState({
      isAttched: false,
    });
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isCommentUpdate) {
      this.props.onClear();
      this.props.initialize({ comments: "" });
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
  commentSubmit = (values) => {
    var data = {};
    data.comments = values.comments;
    data.doid = this.props.dayorderdata.id;
    data.done_by = 1;
    data.done_type = 1;
    data.type = 1;
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

  render() {
    return (
      <div className="width-85">
        <form
          onSubmit={this.props.handleSubmit(this.commentSubmit)}
        >
          <div className="flex-row height-100 mr-b-20">
            <div className="border-none">
              <FaRocketchat size="50" className="border-none"/>{" "}
            </div>

            <div className="mr-l-10 pd-t-10 mr-r-10">Name - {"Admin"}</div>
            <Field
              name="comments"
              type="text"
              component={Replies}
              validate={[required]}
              cols="40"
              rows="3"
            />
            <Button
              onClick={this.onAttach}
              hidden={this.state.isAttched}
            >
              Attach File
            </Button>
            <Button
              onClick={this.onAttachClose}
              hidden={!this.state.isAttched}
            >
              <FaTimes /> close
            </Button>
            <Button type="submit">
              <IoMdSend />
            </Button>
          </div>

          <Row
            className="mr-t-20 image-upload-parent mr-l-250 pd-0"
            hidden={!this.state.isAttched}
          >
            {kitchenSignatureImg.map((item, i) => (
              <Col key={i}>
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
              </Col>
            ))}
          </Row>
        </form>
      </div>
    );
  }
}
CommentEditBox = reduxForm({
  form: COMMENT_ENTER_FORM, // a unique identifier for this form
})(CommentEditBox);
export default connect(mapStateToProps, mapDispatchToProps)(CommentEditBox);
