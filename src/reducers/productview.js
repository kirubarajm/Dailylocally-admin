import { PRODUCT_VIEW } from "../constants/actionTypes";

var productdetail = {
  category: "Milk",
  subCategory1: "Avain",
  subCategory2: "Blue Color",
  itemname: "Milk 500",
  itemcode: "ML005",
  weight: "100 Kg",
  uom: "KG",
  packet_size: "10",
  vendor_list: [
    {
      vendorname: "Suresh",
      vendorcode: "SH002",
      expdate: "12/05/2018",
      baseprice:"25",
      costprice:"105",
      othercharges:"20"

    },
    {
      vendorname: "Basheer",
      vendorcode: "BA002",
      expdate: "12/08/2020",
      baseprice:"55",
      costprice:"1005",
      othercharges:"20"

    },
    {
      vendorname: "Aravind",
      vendorcode: "AR008",
      expdate: "20/10/2020",
      baseprice:"95",
      costprice:"305",
      othercharges:"20"

    },
    {
      vendorname: "Dhanes",
      vendorcode: "DH002",
      expdate: "12/5/2021",
      baseprice:"25",
      costprice:"105",
      othercharges:"20"

    },
  ],
};

export default (state = { productdetail: productdetail }, action) => {
  switch (action.type) {
    case PRODUCT_VIEW:
      return {
        ...state,
        productdetail: action.payload.date[0] || false,
      };
    default:
      return state;
  }

  return state;
};
