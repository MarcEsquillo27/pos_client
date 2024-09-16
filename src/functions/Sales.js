import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
// GET INVENTORY
AddSales(token,fullname,epayment,cashpayment,products,nexSalesID){
    return Promise.resolve(
        axios
        .post(
          `${apiUrl}/sales/api/addSales/${fullname}/${epayment ? "E-Payment" : cashpayment ? "Cash" : "" }/${nexSalesID}`,
          products,
          {
            headers: {
              authorization: `Bearer ${secret_key(
                token
              )}`, // Assuming Bearer token
            },
          }
        )
    )
  },
  // GET SALE NUMBER latest
  getLatestSalesID(token){
    return Promise.resolve(
      axios
      .get(`${apiUrl}/sales/api/latestSalesID`, {
        headers: {
          authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
      })
    )
  } 
};

export default httpRequest;
