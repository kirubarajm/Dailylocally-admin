import { TRACK_ORDER_VIEW } from "../constants/actionTypes";

export default (
  state = {
    orderview: {
      items: [
        { pid:1,product_name: "Raise", price: 25, quantity: 2 },
        {  pid:2,product_name: "Apple", price: 25, quantity: 2 },
        {  pid:3,product_name: "Gee", price: 350, quantity: 1 },
        {  pid:4,product_name: "Bread", price: 40, quantity: 1 },
        {  pid:5,product_name: "Egg", price: 5, quantity: 10 },
      ],
    },
    actionList: [
      { id: 1, name: "Cancel" },
      { id: 2, name: "Reorder" },
      { id: 3, name: "Book Return" },
      { id: 4, name: "Refund" },
      { id: 5, name: "Reassign" },
      { id: 6, name: "Send notification to driver" },
      { id: 7, name: "Send notification to customer" },
      { id: 8, name: "Raise Ticket" },
    ],
    cancelList: [
      { id: 1, name: "Enter Cancellation reason" },
      { id: 2, name: "Red zone" },
      { id: 3, name: "Truck breakdown" },
      { id: 4, name: "Customer given incorrect address" },
      { id: 5, name: "Customer doesnt want delivery due to bad quality" },
      { id: 6, name: "Customer not reachable" },
      { id: 7, name: "Post delivery timing (9PM)" },
    ]
  },
  action
) => {
  
  switch (action.type) {
    case TRACK_ORDER_VIEW:
      return {
        ...state,
        orderview: action.payload.result || [],
      };
    default:
      return state;
  }
};
