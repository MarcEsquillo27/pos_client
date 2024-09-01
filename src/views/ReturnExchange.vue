<template>
  <div>
    <v-container fluid>
      <h1>Return and Exchange<v-icon>mdi-cash-refund</v-icon></h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field
            v-model="search"
            outlined
            rounded
            color="primary"
            dense
            label="Search"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :search="search"
                :items="all_products"
                dense
              >
                <template slot="item.actions" slot-scope="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                        @click="returnItems(item)"
                      >
                        mdi-cash-refund
                      </v-icon>
                    </template>
                    <span>Return Items</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- DIALOG FOR RETURN ITEMS -->
    <v-dialog v-model="return_dialog" width="40%">
      <v-card>
        <v-card-title> Return Item </v-card-title>
        <v-card-text>
          <v-simple-table class="border">
            <thead>
              <tr>
                <th v-for="(items, index) in headers_products" :key="index">
                  {{ items.text }}
                </th>
                <th colspan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items, index) in saled_items" :key="index">
                <td>{{ items.item }}</td>
                <td>{{ items.salesPrice }}</td>
                <td>{{ items.quantity }}</td>
                <td>{{ items.total }}</td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="success"
                        v-bind="attrs"
                        v-on="on"
                        @click="editItems(items)"
                        >mdi-pencil</v-icon
                      >
                    </template>
                    <span>Edit Quantity</span>
                  </v-tooltip>
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="error"
                        @click="toggleDelete(items)"
                        >mdi-cash-refund</v-icon
                      >
                    </template>
                    <span>Refund Item</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG FOR EXCHANGE ITEM -->
    <v-dialog v-model="exchange_dialog" width="500">
      <v-card>
        <v-card-title> Edit Item </v-card-title>
        <v-card-text>
          <v-autocomplete
            outlined
            clearable
            color="primary"
            dense
            label="Product"
            :items="list_of_products"
            :item-text="
              (elem) => {
                return elem.productNumber + ' : ' + elem.item;
              }
            "
            item-value="productNumber"
            v-model="toUpdate.productNumber"
            @change="getItemDetails(toUpdate.productNumber)"
          />
          Remaining Stock {{ toUpdate.stock }}
          <v-text-field
            type="number"
            v-model="toUpdate.salesPrice"
            label="Price"
            readonly
            outlined
            dense
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="quantity"
            @change="computeTotal()"
            label="Quantity"
            outlined
            dense
          ></v-text-field>
          Total: {{ total }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="toExchange ? true : false"
            color="primary"
            @click="updateSales()"
            >Exchange</v-btn
          >
          <v-btn
            :disabled="!toExchange ? true : false"
            color="success"
            @click="returnItem(toUpdate)"
            >Return</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import secret_key from "../plugins/md5decrypt";
export default {
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      total: null,
      toExchange: true,
      remaining_stock: null,
      search: "",
      quantity: "",
      editModeReturn: false,
      return_dialog: false,
      showDatePicker: false,
      exchange_dialog: false,
      from_date: null,
      all_products: [],
      saled_items: [],
      list_of_products: [],
      menu: false,
      date: "",
      headers: [
        { text: "Sales ID", value: "salesID" },
        { text: "Item Count", value: "item_count" },
        { text: "Total Sum", value: "total_sum" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      headers_products: [
        { text: "Item", value: "item" },
        { text: "Price", value: "salesPrice" },
        { text: "Quantity", value: "quantity" },
        { text: "Total", value: "total" },
      ],
      toUpdate: {
        productNumber: null,
        stock: null,
        price: null,
      },
      toOldItem: [],
    };
  },
  methods: {
    returnItem() {
      console.log(this.toUpdate);
      // let old_quantity = val.stock
      let stock_toAdd = this.toUpdate.quantity - this.quantity;
      this.toUpdate.stock = this.toUpdate.stock + stock_toAdd;
      this.toUpdate.quantity = this.quantity;
      this.toUpdate.total = this.toUpdate.salesPrice * this.quantity;
      axios.post(`${this.apiUrl}/sales/api/updateSales`, this.toUpdate, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      axios.post(`${this.apiUrl}/sales/api/updateInventoryStock`, this.toUpdate, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      Swal.fire({
        title: "Item Changed",
        icon: "success",
        timer: 1500,
      });
      location.reload();
    },
    async updateSales() {
      this.toUpdate.quantity = this.quantity;
      this.toUpdate.total = this.toUpdate.salesPrice * this.quantity;
      this.toUpdate.stock = this.toUpdate.stock - this.quantity;
      await axios.post(`${this.apiUrl}/sales/api/updateSales`, this.toUpdate, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      await axios.post(`${this.apiUrl}/sales/api/updateInventoryStock`, this.toUpdate, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      // console.log(this.toOldItem)
      this.toOldItem[0].stock = this.toOldItem[0].stock + this.toOldItem[0].quantity;
      await axios.post(
        `${this.apiUrl}/sales/api/updateInventoryStockReturn`,
        this.toOldItem[0],
        {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        }
      );
      Swal.fire({
        title: "Item Changed",
        icon: "success",
        timer: 1500,
      });
      location.reload();
    },
    computeTotal() {
      this.total = this.toUpdate.salesPrice * this.quantity;
    },
    getItemDetails(val) {
      this.toExchange = false;
      axios
        .get(`${this.apiUrl}/inventory/api/getPerItem/${val}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            this.toUpdate.stock = element.stock;
            this.toUpdate.salesPrice = element.salesPrice;
          }
        });
      this.quantity = null;
    },
    editItems(val) {
      const oldItem = JSON.parse(JSON.stringify(val));
      this.toOldItem.push(oldItem);
      console.log(this.toOldItem, "221");
      this.toUpdate = val;
      this.quantity = val.quantity;
      this.exchange_dialog = true;
      this.total = this.toUpdate.salesPrice * this.toUpdate.quantity;
    },
    getAllItems() {
      axios
        .get(`${this.apiUrl}/inventory/api/getAllInvetory`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.list_of_products = res.data.filter((rec) => {
            if (rec.stock > 0) {
              return rec;
            }
          });
          console.log(res.data);
        });
    },
    toggleExchange() {
      this.exchange_dialog = true;
    },
    getAllProducts() {
      axios
        .get(`${this.apiUrl}/sales/api/getAllSales`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          console.log(res.data);
          this.all_products = res.data;
        });
    },
    toggleEditModeReturn(item) {
      console.log(item);
      item.editModeReturn = true;
    },
    saveChanges(item) {
      console.log(item);
      item.stock = item.stock + parseInt(item.quantity);
      // console.log(item.stock , test)
      item.editModeReturn = false;
      item.total = item.salesPrice * item.quantity;
      let updatedTotal = this.saled_items.reduce(
        (acc, product) => acc + product.total,
        0
      );
      let index = this.all_products.findIndex(
        (product) => product.salesID === item.salesID
      );
      this.all_products[index].total_sum = updatedTotal;
      axios.post(`${this.apiUrl}/sales/api/updateSales`, item, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      axios.post(`${this.apiUrl}/sales/api/updateInventoryStock`, item, {
        headers: {
          authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
        },
      });
      this.return_dialog = false;

      // .then((res)=>{

      // })
    },
    returnItems(val) {
      console.log(val);
      this.toUpdate.salesID = val.salesID;
      axios
        .get(`${this.apiUrl}/sales/api/getbySalesId/${val.salesID}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.saled_items = [];
          this.return_dialog = true;
          let arr_product = res.data;
          for (let i = 0; i < arr_product.length; i++) {
            const element = arr_product[i];
            element.editModeReturn = false;
            this.saled_items.push(element);
          }
        });
      // this.saled_items = [];
      // this.return_dialog = true;
      // let arr_product = JSON.parse(val.products);
      // for (let i = 0; i < arr_product.length; i++) {
      //   const element = arr_product[i];
      //   element.editModeReturn = false;
      //   this.saled_items.push(element);
      // }
    },
    toggleDelete(item) {
      console.log(item);
      let confirmation = confirm("Are you sure you want to Return Item?");
      if (confirmation) {
        axios.get(`${this.apiUrl}/sales/api/deletebySalesId/${item.id}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        });
        let get_index = this.saled_items.indexOf(item);
        this.saled_items.splice(get_index, 1);
      this.saveChanges(item)
      window.location.reload();

        // this.total =this.total - item.subtotal
        // this.products_code = ""
        // this.cash = 0
        // this.change = 0
      }
    },
  },
  mounted() {
    this.getAllProducts();
    this.getAllItems();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
