<template>
  <div>
    <v-container fluid>
      <h1>Account</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn
            :style="hasAccess('Account Registration', 'add') ? '' : 'display:none;'"
            @click="openDialog()"
            rounded
            color="primary"
            dense
            >Add Employee</v-btn
          >
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-simple-table class="border">
            <thead>
              <tr style="background-color: #1976d2">
                <th style="color: white">Name</th>
                <th style="color: white">Username</th>
                <th style="color: white">Acces Right</th>
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
                <td>{{ items.fullname }}</td>
                <td>{{ items.username }}</td>
                <td>
                  <v-btn color="primary" x-small @click="viewAccessDialog(items.access)"
                    >View Access</v-btn
                  >
                </td>
                <td>
                  <v-icon
                    :style="
                      hasAccess('Account Registration', 'edit') ? '' : 'display:none;'
                    "
                    color="primary"
                    @click="editInventory(items)"
                    >mdi-pencil</v-icon
                  >
                </td>
                <td>
                  <v-icon
                    :style="
                      hasAccess('Account Registration', 'delete') ? '' : 'display:none;'
                    "
                    color="error"
                    @click="deleteAccount(items)"
                    >mdi-delete</v-icon
                  >
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
          <v-card-title> {{editButton?"Update":'Add'}} Employee </v-card-title>
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
            <v-btn :disabled="editButton?false:true" small color="primary" @click="autoGeneratePassword()">Generate Password</v-btn>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Drawer Link</th>
                  <th>Access Right</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableData" :key="index">
                  <td>{{ row.drawerLink }}</td>
                  <td>
                    <label>
                      <input type="checkbox" v-model="row.accessRights.add" />
                      Add
                    </label>
                    <label>
                      <input type="checkbox" v-model="row.accessRights.read" />
                      Read
                    </label>
                    <label>
                      <input type="checkbox" v-model="row.accessRights.edit" />
                      Edit
                    </label>
                    <label>
                      <input type="checkbox" v-model="row.accessRights.delete" />
                      Delete
                    </label>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- <v-autocomplete
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
            ></v-autocomplete> -->

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
      <!-- ACCESS TABLE -->
      <v-dialog v-model="openAccess">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Drawer Link</th>
                  <th>Access Right</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in viewAccessTable" :key="index">
                  <td>{{ row.drawerLink }}</td>
                  <td>
                    <label>
                      <!-- <input disabled type="checkbox" v-model="row.accessRights.add" /> -->
                      <v-icon v-if="row.accessRights.add">mdi-check</v-icon>
                      <v-icon v-else>mdi-radiobox-blank</v-icon>Add
                    </label>
                    <label>
                      <v-icon v-if="row.accessRights.read">mdi-check</v-icon>
                      <v-icon v-else>mdi-radiobox-blank</v-icon>Read
                    </label>
                    <label>
                      <v-icon v-if="row.accessRights.edit">mdi-check</v-icon>
                      <v-icon v-else>mdi-radiobox-blank</v-icon>Edit
                    </label>
                    <label>
                      <v-icon v-if="row.accessRights.delete">mdi-check</v-icon>
                      <v-icon v-else>mdi-radiobox-blank</v-icon>Delete
                    </label>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
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
import secret_key from "../plugins/md5decrypt";

export default {
  data: () => {   
    return {
      openAccess: false,
      viewAccessTable: [],
      tableData: [
        {
          drawerLink: "POS",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "PWD",  
          accessRights: { add: false, read: true, edit: false, delete: false }, 
        },
        {
          drawerLink: "Delivery",  
          accessRights: { add: false, read: true, edit: false, delete: false }, 
        },
        {
          drawerLink: "Inventories",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Discount",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Return and Exchange",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Sale Report",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Category",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Transaction Logs",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Void Logs",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Account Registration",
          accessRights: { add: false, read: false, edit: false, delete: false },
        },
        {
          drawerLink: "Settings",
          accessRights: { add: false, read: false, edit: false, delete: false },
        },
      ],
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
    viewAccessDialog(access) {
      this.openAccess = true;
      // console.log( access)
      this.viewAccessTable = [...JSON.parse(access)];
      console.log(this.viewAccessTable);
    },
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

          axios.post(`${this.apiUrl}/account/api/deleteAccount`, val, {
            headers: {
              authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
            },
          });
          window.location.reload();
        }
      });
    },
    editInventory(val) {
      val.password = ""
      this.tableData = JSON.parse(val.access);
      this.addButton = false;
      this.insertItem = {};
      this.add_dialog = true;
      this.insertItem = val;
      this.editButton = true;
      // this.autoGeneratePassword();
    },
    openDialog() {
      this.add_dialog = true;
      this.addButton = true;
      this.editButton = false;
      this.insertItem = {};
      // this.tableData =
      this.tableData = [
        {
          drawerLink: "POS",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "PWD",  
          accessRights: { add: false, read: true, edit: false, delete: false }, 
        },
        
        {
          drawerLink: "Delivery",  
          accessRights: { add: false, read: true, edit: false, delete: false }, 
        },
        {
          drawerLink: "Inventories",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Discount",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Return and Exchange",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Sale Report",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Category",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Transaction Logs",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Void Logs",
          accessRights: { add: false, read: true, edit: false, delete: false },
        },
        {
          drawerLink: "Account Registration",
          accessRights: { add: false, read: false, edit: false, delete: false },
        },
        {
          drawerLink: "Settings",
          accessRights: { add: false, read: false, edit: false, delete: false },
        },
      ]
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
      axios
        .get(`${this.apiUrl}/account/api/getAccount`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.all_products = res.data.filter((rec) => {
            // rec.access = JSON.parse(rec.access);
            // rec.drawer_access = JSON.parse(rec.drawer_access);
            return rec;
          });
          console.log(this.all_products);
        });
    },
    updateInventory(val) {
      // console.log(val);
      val.access = this.tableData;
      axios
        .post(`${this.apiUrl}/account/api/updateAccount`, val, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then(() => {
          // this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
          let audit_logs = {
            action: `Update Account`,
            description: `Update Employee: ${this.insertItem.full}`,
            product_number: val.productNumber,
            quantity: 1,
            drawer_link: `Accounts`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
          axios.post(`${this.apiUrl}/audit/api/addLogs`, audit_logs, {
            headers: {
              authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
            },
          });
          window.location.reload();
          this.getAllProducts();
        })
        .catch((err) => {
          alert(err);
        });
    },
    insertInventory() {
      if(!this.insertItem.fullname || !this.insertItem.username || !this.insertItem.password){
        Swal.fire("Please complete the details", "", "error");
        return false
      }
      console.log(this.tableData);
      this.insertItem.access = this.tableData;
      let add_data = this.insertItem;
      console.log(add_data);
      axios
        .post(`${this.apiUrl}/account/api/addAccount`, add_data, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then(() => {
          this.all_products.push(this.insertItem);
          this.add_dialog = false;

          let audit_logs = {
            action: `Added New Employee`,
            description: `NEW Employee: ${this.insertItem.full}`,
            product_number: null,
            quantity: 1,
            drawer_link: `Accounts`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
          axios
            .post(`${this.apiUrl}/audit/api/addLogs`, audit_logs, {
              headers: {
                authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
              },
            })
            .then(() => {
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
