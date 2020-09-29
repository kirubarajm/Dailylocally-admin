import {
  GET_COLLECTION,
  GET_CLASSIFICATION,
  UPDATE_COLLECTION_IMAGES,
  DELETE_COLLECTION_IMAGES,
  GET_CLASSIFICATION_DATA,
  SET_COLLECTION_IMAGES,
  ADD_COLLECTION,
  EDIT_COLLECTION,
  ACTIVE_COLLECTION,
  FROMCLEAR
} from "../constants/actionTypes";

export default (
  state = {
    collectionlist: [],
    classification_Data:[],
    collection_report:[],
    Collection_Img:[],
    Card_type:[{id:1,name:"Vertical"},{id:2,name:"Horizontal"}],
    classification_list:[],
    isUpdate:false,
    isLive:false,
  },
  action
) => {
  switch (action.type) {
    case GET_COLLECTION:
      return {
        ...state,
        collectionlist: action.payload.result || [],
      };
      case GET_CLASSIFICATION:
      return {
        ...state,
        classification_list: action.payload.result || [],
      };

      case GET_CLASSIFICATION_DATA:
      return {
        ...state,
        classification_Data: action.payload.result || [],
      };
      case UPDATE_COLLECTION_IMAGES:
        var imagePath = {
          img_url: action.payload.result.Location,
          type: action.imgtype
        };
        
        return {
          ...state,
          Collection_Img: [...state.Collection_Img, imagePath]
        };
        case DELETE_COLLECTION_IMAGES:
        return {
          ...state,
          Collection_Img: []
        };
        case ADD_COLLECTION:
        case EDIT_COLLECTION:
          return{
            ...state,
            isUpdate:action.payload.status || false,
          }
          case ACTIVE_COLLECTION:
          return{
            ...state,
            isLive:action.payload.status || false,
          }
          case FROMCLEAR:
            return{
              ...state,
              isUpdate:false,
              Collection_Img:[],
              isLive:false,
            }
            case SET_COLLECTION_IMAGES:
        var imagePath2 = {
          img_url: action.image,
          type: 0
        };
        return {
          ...state,
          Collection_Img: [...state.Collection_Img, imagePath2]
        };
    default:
      return state;
  }
};
