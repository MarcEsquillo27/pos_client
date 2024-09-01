import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
// GET CATEGORY
getCategory(token){
    return Promise.resolve(
        axios
        .get(`${apiUrl}/category/api/getCategory`, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
};

export default httpRequest;
