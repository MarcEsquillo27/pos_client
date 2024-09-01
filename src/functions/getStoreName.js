import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
  //******************************************************//
  //  GET CATEGORY REQUEST IN CategoryInformation TABLE  //
  //*****************************************************//
  getStoreData(data) {
    return Promise.resolve(
      axios
      .get(`${apiUrl}/storename/api/getStore`, {
        headers: {
          authorization: `Bearer ${secret_key(data)}`, // Assuming Bearer token
        },
      })
    );
  },

  getStore(token,paperPrint){
    return Promise.resolve(
      axios
      .put(`${apiUrl}/storename/api/updateRecieptStore/1/${paperPrint}`, {
        headers: {
          authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
      })
    )
  }


};

export default httpRequest;
