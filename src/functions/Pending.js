import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
 // GET PENDING LIST IN POS
 fetchPending(token){
    return Promise.resolve(
      axios
        .get(`${apiUrl}/pending/api/getPending`, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`,
          },
        })
    )
  },
//   DELETE PENDING
  deletePending(token,id){
    return Promise.resolve(
      axios.delete(`${apiUrl}/pending/api/deletePending`, {
        data:{id:id},
        headers: {
          authorization: `Bearer ${secret_key(token)}`,
        },
        
      })
    )
  },
//   ADD PENDING
  addPending(token,item){
    return Promise.resolve(
      axios.post(`${apiUrl}/pending/api/addPending`, item, {
        headers: {
          authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
      })
    )
  },
};

export default httpRequest;
