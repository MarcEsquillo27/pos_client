import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
  // Add Void
addVoid(token,void_items,payment,cashpayment){
    return Promise.resolve(
      axios
            .post(`${apiUrl}/void/api/addVoid`, {void_items,payment,cashpayment}, {
              headers: {
                authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
              },
            })
    )
  },
  getVoid(token,first_date,second_date){
    return Promise.resolve(
      axios
            .get(`${apiUrl}/void/api/getVoid/${first_date}/${second_date}`, {
              headers: {
                authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
              },
            })
    )
  }
};

export default httpRequest;
