import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
  updateDiscount(token,toUpdate){
    return Promise.resolve(
      axios
      .post(`${apiUrl}/discount/api/updateDiscount`, toUpdate,{
      headers: {
          'authorization': `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
    })
    )
  },

    deleteDiscount(token,toUpdate){
    return Promise.resolve(
      axios
      .post(`${apiUrl}/discount/api/deleteDiscount`, toUpdate,{
      headers: {
          'authorization': `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
    })
    )
  },

  deactivateSatusDiscount(token,toUpdate){
    toUpdate.status = 1
    return Promise.resolve(
      axios
      .post(`${apiUrl}/discount/api/statusDiscount`, toUpdate,{
      headers: {
          'authorization': `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
    })
    )
  },
  activateSatusDiscount(token,toUpdate){
    toUpdate.status = 0
    return Promise.resolve(
      axios
      .post(`${apiUrl}/discount/api/statusDiscount`, toUpdate,{
      headers: {
          'authorization': `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
    })
    )
  },
  
}

export default httpRequest;
