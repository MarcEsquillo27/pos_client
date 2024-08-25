<template>
  <div>
    <v-container fluid>
      <h1>Transaction Logs</h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col>
          <v-menu
            v-model="startdateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                dense
                rounded
                v-model="startDate"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="startdateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            v-model="enddateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                dense
                rounded
                v-model="endDate"
                label="End Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" @input="enddateMenu = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="filterLog()">Filter Date</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-simple-table class="border" dense>
                <thead>
                  <tr>
                    <th v-for="(items, index) in headers" :key="index">
                      {{ items.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :style="
                      items.stock <= 5 ? 'background-color:#CE4257;color:white;' : ''
                    "
                    v-for="(items, index) in paginatedItems"
                    :key="index"
                  >
                    <td>{{ items.action }}</td>
                    <td>{{ items.description }}</td>
                    <td>{{ items.product_number }}</td>
                    <td>{{ items.quantity }}</td>
                    <td>{{ items.transaction_by }}</td>
                    <td>{{ items.drawerLink }}</td>
                    <td>{{ fixedDate(items.date) }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
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
          <v-card-title> Add Item </v-card-title>
          <v-card-text>
            <v-btn class="mb-2" dense x-small color="primary" @click="barcodeGenerate()"
              >Generate Barcode</v-btn
            >
            <v-text-field
              v-model="insertItem.productNumber"
              label="Product Number"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.item"
              label="Item"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.brand"
              label="Brand"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.category"
              label="Category"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.description"
              label="Description"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.stock"
              type="number"
              label="Stock"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.originalPrice"
              type="number"
              label="Orginal Price"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.salesPrice"
              type="number"
              label="Sales Price"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.discount"
              type="number"
              label="Discount Price"
              outlined
              dense
            ></v-text-field>
            <v-row>
              <v-col
                ><h3 style="color: black">
                  Capital per Item: <span>&#8369;</span> {{ capitalPerItem(insertItem) }}
                </h3></v-col
              >
              <v-col
                ><h3 style="color: black">
                  Sales Total: <span>&#8369;</span> {{ overallCapital(insertItem) }}
                </h3></v-col
              >
            </v-row>
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
import secret_key from "../plugins/md5decrypt";

export default {
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      startdateMenu: false,
      enddateMenu: false,
      currentPage: 1, // Current page number
      itemsPerPage: 5,
      addButton: false,
      editButton: false,
      add_dialog: false,
      showDatePicker: false,
      from_date: null,
      all_products: [],
      insertItem: {
        productNumber: "",
      },
      menu: false,
      date: "",
      headers: [
        { text: "Action ", value: "action" },
        { text: "Description ", value: "description" },
        { text: "Product Number ", value: "product_number" },
        { text: "Quantity", value: "quantity" },
        { text: "Transaction By", value: "transaction_by" },
        { text: "Drawer Link", value: "drawerLink" },
        { text: "Date", value: "date" },
      ],
    };
  },
  computed: {
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.all_products.slice(startIndex, endIndex);
    },
    numPages() {
      return Math.ceil(this.all_products.length / this.itemsPerPage);
    },
  },

  methods: {
    filterLog() {
      axios
        .get(`${this.apiUrl}/audit/api/getLogs/${this.startDate}/${this.endDate}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.all_products = res.data;
          // console.log(res.data);
        });
    },
    changePage(page) {
      this.currentPage = page;
    },
    fixedDate(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
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
      axios
        .get(`${this.apiUrl}/audit/api/getLogs/${this.startDate}/${this.endDate}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.all_products = res.data;
          // console.log(res.data);
        });
    },
    updateInventory(val) {
      val.date = moment(val.date).format("YYYY-MM-DD hh:ss:mm");
      axios
        .post(`${this.apiUrl}/inventory/api/updateInventory`, val, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          console.log(res.data);
          // this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
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
      console.log("Generated Barcode:", twelveDigitNumber);
      this.$forceUpdate(); // Force Vue to update the view
    },
    insertInventory() {
      this.insertItem.date = moment().format("YYYY-MM-DD hh:mm:ss");
      let add_data = this.insertItem;
      axios
        .post(`${this.apiUrl}/inventory/api/addInventory`, add_data, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          console.log(res.data);
          this.all_products.push(this.insertItem);
          alert("NEW ITEM ADDED");
          this.add_dialog = false;
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
/* Add any custom styles here */
</style>
