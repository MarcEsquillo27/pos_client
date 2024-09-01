import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
  // Add Void
addVoid(token,void_items){
    return Promise.resolve(
      axios
            .post(`${apiUrl}/void/api/addVoid`, void_items, {
              headers: {
                authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
              },
            })
    )
  }
};

export default httpRequest;
