<template>
  <div>
    <v-container fluid>
      <h1>Category</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn :style="hasAccess('Category','add')?'':'display:none;'" @click="openDialog()" rounded color="primary" dense>Add Item</v-btn>
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-simple-table class="border">
            <thead>
              <tr style="background-color: #1976d2">
                <th style="color: white" v-for="(items, index) in headers" :key="index">
                  {{ items.text }}
                </th>
                <th style="color: white" colspan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                :style="
                  items.stock == 0
                    ? 'background-color:#FFBB64;'
                    : items.stock <= 5
                    ? 'background-color:#CE4257;color:white;'
                    : ''
                "
                v-for="(items, index) in paginatedItems"
                :key="index"
              >
                <td>{{ items.categoryID }}</td>
                <td>{{ items.categoryName }}</td>
                <td>{{ items.description }}</td>
                <td>{{ formatdate(items.date) }}</td>
                <td>
                  <v-icon :style="hasAccess('Category','edit')?'':'display:none;'" color="primary" @click="editInventory(items)"
                    >mdi-pencil</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row><v-col>
        <v-pagination v-model="currentPage" :length="numPages" @input="changePage" />
      </v-col></v-row>
      <v-dialog v-model="add_dialog" width="40%">
        <v-card>
          <v-card-title> Add Category </v-card-title>
          <v-card-text>
            <!-- <v-btn class="mb-2" dense x-small color="primary" @click="barcodeGenerate()"
              >Generate Barcode</v-btn
            > -->
            <v-text-field
              v-model="insertItem.categoryID"
              label="Category Number"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.categoryName"
              label="Name"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.description"
              label="Description"
              outlined
              dense
            ></v-text-field>
         
            <v-btn
              class="mt-1"
              :style="!addButton ? 'display:none;' : ''"
              @click="insertCategory(insertItem)"
              color="success"
              block
            >
              SAVE
            </v-btn>
            <v-btn
              class="mt-1"
              :style="!editButton ? 'display:none;' : ''"
              @click="updateInventory(insertItem)"
              color="success"
              block
            >
              UPDATE
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
    <v-footer class="footer" dense>
      <v-row>
        <v-col>
          Legends: <v-icon style="color: white">mdi-square</v-icon> - Active Stock
          <v-icon style="color: #ce4257">mdi-square</v-icon> - Low Stock
          <v-icon style="color: #ffbb64">mdi-square</v-icon> - Out of Stock
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import Swal from "sweetalert2";
import secret_key from "../plugins/md5decrypt";

export default {
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      currentPage: 1, // Current page number
      itemsPerPage: 5, // Number of items per page
      addButton: false,
      editButton: false,
      add_dialog: false,
      showDatePicker: false,
      from_date: null,
      all_products: [],
      low_products: false,
      filter_all: false,
      no_products: false,
      insertItem: {
        productNumber: "",
      },
      menu: false,
      date: "",
      headers: [
        { text: "Category ID", value: "categoryID" },
        { text: "Name", value: "categoryName" },
        { text: "Description", value: "description" },
        { text: "Date ", value: "Date" },
      ],
    };
  },
  computed: {
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.InventoriesProduct.slice(startIndex, endIndex);
    },
    numPages() {
      return Math.ceil(this.InventoriesProduct.length / this.itemsPerPage);
    },
    InventoriesProduct() {
      let filteredProducts = this.all_products;
      // Apply filter if necessary
      if (this.low_products) {
        filteredProducts = _.filter(filteredProducts, (item) => item.stock <= 5);
      } else if (this.no_products) {
        filteredProducts = _.filter(filteredProducts, (item) => item.stock === 0);
      }
      return filteredProducts;
    },
  },
  methods: {
    formatdate(val){
      return moment(val).format("YYYY-MM-DD hh:mm:ss")
    },
    changePage(page) {
      this.currentPage = page;
    },
    checkSameBarcode(val) {
      axios.get(`${this.apiUrl}/inventory/api/getPerItem/${val}`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res) => {
        if (res.data.length) {
          Swal.fire({
            title: "Product Code Exist!",
            text: "Change product code to avoid multiple code",
            icon: "error",
          });
          this.insertItem.productNumber = "";
          return false;
        }
      });
    },
    toggleLowStockFilter() {
      this.low_products = !this.low_products;
      this.no_products = false; // Reset no stock filter
      this.filter_all = false; // Reset total products filter
    },
    // Add method to toggle no stock filter
    toggleNoStockFilter() {
      this.no_products = !this.no_products;
      this.low_products = false; // Reset low stock filter
      this.filter_all = false; // Reset total products filter
    },
    // Add method to reset all filters
    resetFilters() {
      this.filter_all = true;
      this.low_products = false;
      this.no_products = false;
    },
    allProductStocks() {
      return this.all_products.length;
    },
    lowStockProducts() {
      let get_low_products = this.all_products.filter((rec) => {
        if (rec.stock <= 5 && rec.stock != 0) {
          return rec;
        }
      });
      return get_low_products.length;
    },
    outOfStockProducts() {
      let get_out_of_stocks_products = this.all_products.filter((rec) => {
        if (rec.stock == 0) {
          return rec;
        }
      });
      return get_out_of_stocks_products.length;
    },
    totalPrice(val) {
      return val.stock * val.salesPrice;
    },
    overallCapital(val) {
      var totalallCapital = null;
      totalallCapital = val.stock * val.salesPrice;
      //  totalCapital = val.salesPrice - val.originalPrice
      return !totalallCapital ? 0 : totalallCapital;
    },
    capitalPerItem(val) {
      var totalCapital = null;
      totalCapital = val.salesPrice - val.originalPrice;
      //  totalCapital = val.salesPrice - val.originalPrice
      return !totalCapital ? 0 : totalCapital;
    },
    editInventory(val) {
      this.addButton = false;
      this.insertItem = {};
      this.add_dialog = true;
      this.insertItem = val;
      this.editButton = true;
    },
    openDialog() {
      this.add_dialog = true;
      this.addButton = true;
      this.editButton = false;
      this.insertItem = {};
    },
    getAllProducts() {
      axios.get(`${this.apiUrl}/category/api/getCategory`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res) => {
        this.all_products = res.data;
      });
    },
    updateInventory(val) {
      val.date = moment(val.date).format("YYYY-MM-DD hh:ss:mm");
      axios
        .post(`${this.apiUrl}/category/api/updateCategory`, val,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
        .then(() => {
          this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
          let audit_logs = {
            action: `Update Category`,
            description: `Update Category: ${val.categoryName}`,
            product_number: val.categoryID,
            quantity: 1,
            drawer_link: `Category`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
          };
          axios.post(`${this.apiUrl}/audit/api/addLogs`, audit_logs,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      });
        })
        .catch((err) => {
          alert(err);
        });
    },
    barcodeGenerate() {
      let twelveDigitNumber = "";
      for (let i = 0; i < 12; i++) {
        twelveDigitNumber += Math.floor(Math.random() * 10); // Generate a random digit and concatenate
      }
      this.insertItem.productNumber = twelveDigitNumber;
      this.$forceUpdate(); // Force Vue to update the view
    },
    insertCategory() {
      this.insertItem.date = moment().format("YYYY-MM-DD hh:mm:ss");
      let add_data = this.insertItem;
      axios
        .post(`${this.apiUrl}/category/api/addCategory`, add_data,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
        .then(() => {
          this.all_products.push(this.insertItem);
          alert("NEW ITEM ADDED");
          this.add_dialog = false;

          let audit_logs = {
            action: `Added New Category`,
            description: `NEW Category: ${this.insertItem.categoryName}`,
            product_number: this.insertItem.categoryID,
            quantity: 1,
            drawer_link: `Category`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
          };
          axios.post(`${this.apiUrl}/audit/api/addLogs`, audit_logs,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
  mounted() {
    this.getAllProducts();
  },
};
</script>

<style scoped>
/* Apply custom styles to remove padding */
.no-padding {
  background-color: #1976d2;
  color: white;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
  padding: 1;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.blink {
  animation: blink 1s infinite;
}
</style>
