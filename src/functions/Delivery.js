import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
// ADD INVENTORY
addDelivery(token,data){
    return Promise.resolve(
      axios
            .post(`${apiUrl}/delivery/api/addDelivery`, data, {
              headers: {
                authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
              },
            })  
    )
  },
  // SEARCH DELIVERY
  searchDelivery(token, data) {
    return Promise.resolve(
      axios
        .get(`${apiUrl}/delivery/api/searchSalesID/${data}`, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
  // UPDATE DELIVERY
  updateDelivery(token,id){
    return Promise.resolve(
       axios
      .put(`${apiUrl}/delivery/api/updateDelivery`,{id:id},{
        headers: {
          authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
        },
      })
    )
  },

  // GET DELIVERY
  getDelivery(token,currentPage,itemsPerPage){
    return Promise.resolve(
      axios
        .get(`${apiUrl}/delivery/api/getDelivery`, {
          params: {
            page: currentPage,
            page_size: itemsPerPage,
          },
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  }
};

export default httpRequest;
