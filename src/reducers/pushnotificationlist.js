import { PUSH_NOTIFICATION_SEND, PUSH_NOTIFICATION_CLEAR,UPDATE_PUSH_IMAGES,DELETE_PUSH_IMAGES} from '../constants/actionTypes';

export default (state = {sendpush:false,usertype:1,Signature:[]}, action) => {
  switch (action.type) {
  
      case PUSH_NOTIFICATION_SEND:
        return{
          ...state,
          sendpush:action.payload.status || false
        }
        case UPDATE_PUSH_IMAGES:
          var imagePath = {
            img_url: action.payload.result.Location,
            type: action.imgtype
          };
          return {
            ...state,
            Signature: [...state.Signature, imagePath]
          };
        case PUSH_NOTIFICATION_CLEAR:
        return{
          ...state,
          sendpush:false
        }
        case DELETE_PUSH_IMAGES:
          return {
            ...state,
            Signature: []
          };
        
    default:
      return state;
  }
};
