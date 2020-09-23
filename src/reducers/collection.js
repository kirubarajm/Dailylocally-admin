import {
  GET_COLLECTION,
} from "../constants/actionTypes";

export default (
  state = {
    collectionlist: [],
    collection_report:[]
  },
  action
) => {
  switch (action.type) {
    case GET_COLLECTION:
      return {
        ...state,
        collectionlist: action.payload.result || [],
      };
    default:
      return state;
  }
};
