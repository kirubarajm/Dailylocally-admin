import { GET_COLLECTION, REORDER_COLLECTION,ONREORDER_CLEAR } from "../constants/actionTypes";

export default (
  state = {
    collectionlist: [],
    collectiondraglist: [
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 2 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 2 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 2 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
      { tile_type: 1 },
    ],
    Card_type: [
      { id: 1, name: "Vertical" },
      { id: 2, name: "Horizontal" },
    ],
    isUpdate: false,
  },
  action
) => {
  switch (action.type) {
    case GET_COLLECTION:
      return {
        ...state,
        collectionlist: action.payload.result || [],
      };

    case REORDER_COLLECTION:
      return {
        ...state,
        isUpdate: action.payload.status || false,
      };
    case ONREORDER_CLEAR:
      return {
        ...state,
        isUpdate: false,
      };

    default:
      return state;
  }
};
