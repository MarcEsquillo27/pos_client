<template>
  <div>
    <v-container fluid>
      <h1>Account</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn @click="openDialog()" rounded color="primary" dense>Add Employee</v-btn>
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-simple-table class="border">
            <thead>
              <tr style="background-color: #1976d2">
                <th style="color: white">ID</th>
                <th style="color: white">Name</th>
                <th style="color: white">Username</th>
                <th style="color: white">Acces Right</th>
                <th style="color: white">Acces Drawer</th>
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
                v-for="(items, index) in all_products"
                :key="index"
              >
                <td>{{ items.id }}</td>
                <td>{{ items.fullname }}</td>
                <td>{{ items.username }}</td>
                <td>{{ items.access }}</td>
                <td>{{ items.drawer_access }}</td>
                <td>
                  <v-icon color="primary" @click="editInventory(items)"
                    >mdi-pencil</v-icon
                  >
                </td>
                <td>
                  <v-icon color="error" @click="deleteAccount(items)">mdi-delete</v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row
        ><v-col>
          <v-pagination
            v-model="currentPage"
            :length="numPages"
            @input="changePage"
          /> </v-col
      ></v-row>
      <v-dialog v-model="add_dialog" width="40%">
        <v-card>
          <v-card-title> Add Employee </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="insertItem.fullname"
              label="Full Name"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.username"
              label="Username"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.password"
              label="Password"
              outlined
              dense
              append-outer-icon="mdi-clipboard-outline"
              @click:append-outer="copyText"
            ></v-text-field>

            <v-autocomplete
              v-model="insertItem.access"
              multiple
              chips
              label="Acces Right"
              :items="['Read', 'Write', 'Edit', 'Delete']"
              outlined
              dense
            ></v-autocomplete>
            <v-autocomplete
              v-model="insertItem.drawer_access"
              multiple
              chips
              label="Acces Link"
              :items="[
                'Inventories',
                'Discount',
                'Return and Exchange',
                'Sale Report',
                'Category',
                'Transaction Logs',
                'Void Logs',
              ]"
              outlined
              dense
            ></v-autocomplete>

            <v-btn
              class="mt-1"
              :style="!addButton ? 'display:none;' : ''"
              @click="insertInventory(insertItem)"
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
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import copy from "copy-to-clipboard";
import Swal from "sweetalert2";
export default {
  data: () => {
    return {
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
      insertItem: {},
      menu: false,
      date: "",
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
    copyText() {
      copy(this.insertItem.password, {
        debug: true,
        message: "copied",
      });
      alert("copied");
    },
    changePage(page) {
      this.currentPage = page;
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
    deleteAccount(val) {
      console.log(val);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "The Account has been deleted.",
            icon: "success",
          });

          axios.post("https://pos-server-ktwz.vercel.app/account/api/deleteAccount", val);
          window.location.reload();
        }
      });
    },
    editInventory(val) {
      this.addButton = false;
      this.insertItem = {};
      this.add_dialog = true;
      this.insertItem = val;
      this.editButton = true;
      this.autoGeneratePassword();
    },
    openDialog() {
      this.add_dialog = true;
      this.addButton = true;
      this.editButton = false;
      this.insertItem = {};
      this.autoGeneratePassword();
    },
    autoGeneratePassword() {
      let length = 8;
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
      this.insertItem.password = password;
      // console.log(this.insertItem.password);
    },
    getAllProducts() {
      axios.get("https://pos-server-ktwz.vercel.app/account/api/getAccount").then((res) => {
        this.all_products = res.data.filter((rec) => {
          rec.access = JSON.parse(rec.access);
          rec.drawer_access = JSON.parse(rec.drawer_access);
          return rec;
        });
        console.log(this.all_products);
      });
    },
    updateInventory(val) {
      console.log(val);
      axios
        .post("https://pos-server-ktwz.vercel.app/account/api/updateAccount", val)
        .then(() => {
          this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
          let audit_logs = {
            action: `Update Account`,
            description: `Update Employee: ${this.insertItem.full}`,
            product_number: val.productNumber,
            quantity: val.stock,
            drawer_link: `Accounts`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
          };
          axios.post("https://pos-server-ktwz.vercel.app/audit/api/addLogs", audit_logs);
          // window.location.reload();
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
    insertInventory() {
      let add_data = this.insertItem;
      console.log(add_data);
      axios
        .post("https://pos-server-ktwz.vercel.app/account/api/addAccount", add_data)
        .then(() => {
          this.all_products.push(this.insertItem);
          alert("NEW ITEM ADDED");
          this.add_dialog = false;

          let audit_logs = {
            action: `Added New Employee`,
            description: `NEW Employee: ${this.insertItem.full}`,
            product_number: null,
            quantity: null,
            drawer_link: `Accounts`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
          };
          axios.post("https://pos-server-ktwz.vercel.app/audit/api/addLogs", audit_logs).then(() => {
            Swal.fire("Saved!", "", "success");
            window.location.reload();
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
