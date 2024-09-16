<template>
  <div>
    <v-container fluid>
      <h1>Void Logs<v-icon>mdi-delete</v-icon></h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col>
          <!-- FROM DATE -->
          <v-menu
            ref="menu"
            v-model="first_date_menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="first_date"
                label="From Date"
                prepend-icon="mdi-calendar"
                readonly
                dense
                rounded
                outlined
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="first_date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <!-- TO DATE -->
          <v-menu
            ref="menu"
            v-model="second_date_menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="second_date"
                label="To Date"
                prepend-icon="mdi-calendar"
                readonly
                dense
                rounded
                outlined
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="second_date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-btn @click="filterDate()" color="primary"> Filter Date </v-btn>
        </v-col>
        <!-- <v-col>
            <v-btn @click="extractionData()" color="success">
             <v-icon>mdi-microsoft-excel</v-icon> Extract Data
            </v-btn>
          </v-col> -->
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="all_products"
                item-key="salesID"
                dense
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Products</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!-- Add any additional toolbar items here -->
                  </v-toolbar>
                </template>

                <template v-slot:item="{ item }">
                  <tr @dblclick="getVoidData(item.salesID)">
                    <td>{{dateDefault(item.date) }}</td>
                    <td>{{ item.salesID }}</td>
                    <td>{{ item.transaction_by }}</td>
                  </tr>
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
        <v-card-title> View Logs </v-card-title>
        <v-card-text>
          <v-simple-table class="border">
            <thead>
              <tr>
                <th v-for="(items, index) in headers_products" :key="index">
                  {{ items.text }}
                </th>
                <!-- <th colspan="2">Action</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items, index) in filter_data" :key="index">
                <td>{{ items.productNumber }}</td>
                <td>{{ items.item }}</td>
                <td >{{ items.quantity }}</td>
                <!-- <td v-if="!items.editModeReturn">
                    <v-icon color="primary" @click="items.editModeReturn = true"
                      >mdi-pencil</v-icon
                    >
                  </td>
                  <td v-else>
                    <v-icon color="primary" @click="items.editModeReturn = false"
                      >mdi-close</v-icon
                    >
                  </td>
  
                  <td>
                    <v-icon color="error" @click="toggleDelete(items)">mdi-delete</v-icon>
                  </td> -->
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import secret_key from "../plugins/md5decrypt";
import Void from "../functions/Void"

// import _ from "lodash"
export default {
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,

      sales_extracted: [],
      editModeReturn: false,
      return_dialog: false,
      showDatePicker: false,
      from_date: null,
      all_products: [],
      filter_products:[],
      filter_data:[],
      saled_items: [],
      first_date_menu: false,
      second_date_menu: false,
      first_date: moment().subtract(1, "month").format("YYYY-MM-DD"),
      second_date: moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Date", value: "productNumber" },
        { text: "Sales Number", value: "item" },
        { text: "Cashier Name", value: "date" },
        //   { text: "Action",sort:false },
        // Add more headers as needed
      ],
      headers_products: [
      { text: "Product Number", value: "productNumber" },
        { text: "Item", value: "item" },
        { text: "Quantity", value: "quantity" },
      ],
    };
  },
  methods: {
    getVoidData(data){
      this.filter_data = []
      this.return_dialog = true
    this.filter_data = this.filter_products.filter((rec)=>{
        if(data == rec.salesID){
          return rec
        }
      })
    },
    dateDefault(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
    },
    filterDate() {
      this.getAllProducts();
    },
    extractionData() {
      axios
        .get(
          `${this.apiUrl}/sales/api/getSalesExtraction/${this.first_date}/${this.second_date}`,
          {
            headers: {
              authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
            },
          }
        )
        .then((response) => {
          const sales_extracted = response.data;
          return this.firstProcess(sales_extracted);
        })
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, `Sales Extraction(${moment().format("YYYY-MM-DD")})`);
        })
        .catch((error) => {
          console.error("Error fetching sales data:", error);
        });
    },

    firstProcess(sales_extracted) {
      return new Promise((resolve, reject) => {
        const headers = {
          id: "ID",
          salesID: "Sale ID",
          productNumber: "Product Number",
          item: "Item",
          salesPrice: "Sales Price",
          quantity: "Quantity",
          total: "Total",
          date: "Date",
        };
        const excel_data = [headers, ...sales_extracted]; // Place headers first
        const workbook = new Excel.Workbook();
        const DetailedSheet = workbook.addWorksheet("Detailed");

        DetailedSheet.columns = [
          { key: "A", width: 25 },
          { key: "B", width: 25 },
          { key: "C", width: 25 },
          { key: "D", width: 25 },
          { key: "E", width: 25 },
          { key: "F", width: 25 },
          { key: "G", width: 25 },
          { key: "H", width: 25 },
        ];

        excel_data.forEach((value, index) => {
          DetailedSheet.getRow(index + 1).height = 25;

          Object.keys(value).forEach((key, columnIndex) => {
            DetailedSheet.getCell(
              `${String.fromCharCode(65 + columnIndex)}${index + 1}`
            ).value = value[key];
          });
        });

        workbook.xlsx
          .writeBuffer()
          .then((buffer) => {
            resolve(buffer);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    getAllProducts() {
    Void.getVoid(this.$store.state.storedEmp.token, this.first_date, this.second_date)
        .then((res) => {
            // Original data
            this.filter_products = res.data
            const products = res.data;

            // Create a map to store unique salesID
            const salesMap = {};

            // Iterate over the products
            products.forEach((product) => {
                if (!salesMap[product.salesID]) {
                    // If this salesID is not already in the map, add it
                    salesMap[product.salesID] = {
                        salesID: product.salesID,
                        date: product.date,
                        transaction_by: product.transaction_by
                    };
                }
            });

            // Convert the map to an array of unique sales
            const uniqueSales = Object.values(salesMap);

            // Now, `uniqueSales` will contain the filtered and grouped data
            console.log(uniqueSales);
            this.all_products = uniqueSales;
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
      // .then((res)=>{

      // })
    },
    returnItems(val) {
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
      let confirmation = confirm("Are you sure you want to delete?");
      if (confirmation) {
        let get_index = this.saled_items.indexOf(item);
        this.saled_items.splice(get_index, 1);
        // this.total =this.total - item.subtotal
        // this.products_code = ""
        // this.cash = 0
        // this.change = 0
      }
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
