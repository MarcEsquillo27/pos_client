import axios from "axios";
import secret_key from "../plugins/md5decrypt";

let apiUrl = process.env.VUE_APP_API_URL
const httpRequest = {
// GET INVENTORY
  fetchProducts(token,currentPage,itemsPerPage) {
    return Promise.resolve(
        axios
        .get(`${apiUrl}/inventory/api/getInventory`, {
          params: {
            page: currentPage,
            page_size: itemsPerPage,
          },
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    );
  },

  //GET PER ITEM
  fetchPerProduct(token,val){
    return Promise.resolve(
        axios
        .get(`${apiUrl}/inventory/api/getPerItem/${val}`, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
// UPDATE INVENTORY
  updateProduct(token,products){
    return Promise.resolve(
        axios
        .post(`${apiUrl}/inventory/api/updateInventoryStock`, products, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
  
  addProduct(token,data){
    return Promise.resolve(
      axios
        .post(`${apiUrl}/inventory/api/addInventory`, data, {
          headers: {
            authorization: `Bearer ${secret_key(token)}`, // Assuming Bearer token
          },
        })
    )
  },
  testFunction(a, b){
    return a + b;
  }
};

export default httpRequest;
