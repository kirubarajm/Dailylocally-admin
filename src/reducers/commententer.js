import { POST_COMMENTS,CLEAR_COMMENT,UPDATE_COMMENT_IMAGES,DELETE_COMMAND_IMAGES } from "../constants/actionTypes";

export default (state = { isCommentUpdate: false,CommentImg:[] }, action) => {
  switch (action.type) {
    case POST_COMMENTS:
      return {
        ...state,
        isCommentUpdate: action.payload.status,
      };
    case CLEAR_COMMENT:
      return {
        ...state,
        isCommentUpdate: false,
        CommentImg:[]
      };
      case UPDATE_COMMENT_IMAGES:
        var imagePath = {
          img_url: action.payload.result.Location,
          type: action.imgtype
        };
        return {
          ...state,
          CommentImg: [...state.CommentImg, imagePath]
        };
        case DELETE_COMMAND_IMAGES:
        return {
          ...state,
          CommentImg:state.CommentImg.filter((v,i)=>i!==action.index)
        };
    default:
      return state;
  }
};
