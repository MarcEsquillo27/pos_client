import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
// ADD LOGS
AddLogs(token,data){
    return Promise.resolve(
        axios
        .post(`${apiUrl}/audit/api/addLogs`, data, {
          headers: {
            authorization: `Bearer ${secret_key(
                token
            )}`, // Assuming Bearer token
          },
        })
    )
  },
};

export default httpRequest;
