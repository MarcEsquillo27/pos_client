import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {

  addPwd(token,data){
    return Promise.resolve(
      axios
        .post(`${apiUrl}/pwd/api/addPwdDetails`, data, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
  getPwd(token,from_date,to_date){
    return Promise.resolve(
        axios
              .get(`${apiUrl}/pwd/api/getPwd/${from_date}/${to_date}`, {
                headers: {
                  authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
                },
              })
      )
  }
};

export default httpRequest;
