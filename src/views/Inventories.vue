<template>
  <div>
    <v-container fluid>
      <h1>Inventories</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="6" sm="3" class="text-right">
          <v-btn
            :style="hasAccess('Inventories', 'add') ? '' : 'display:none;'"
            @click="openDialog()"
            rounded
            color="primary"
            dense
            >Add Item</v-btn
          >
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
        <v-col cols="6" sm="3">
          <v-btn @click="extractionData()" color="success">
            <v-icon>mdi-microsoft-excel</v-icon> Extract Data
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-card elevation-24 @click="resetFilters()">
            <v-card-title class="no-padding"
              ><h2>
                Total Products <v-icon style="color: white">mdi-archive</v-icon>
              </h2></v-card-title
            >
            <v-card-title class="justify-center"
              ><h1>{{ allProductStocks() }}</h1></v-card-title
            >
          </v-card></v-col
        >
        <v-col cols="12" md="4">
          <v-card elevation-24 @click="toggleLowStockFilter()">
            <v-card-title class="no-padding"
              ><h2>
                Low Stock Products<v-icon style="color: white"
                  >mdi-archive-arrow-down</v-icon
                >
              </h2></v-card-title
            >
            <v-card-title class="justify-center"
              ><h1>{{ lowStockProducts() }}</h1></v-card-title
            >
          </v-card></v-col
        >
        <v-col cols="12" md="4">
          <v-card elevation-24 @click="toggleNoStockFilter()">
            <v-card-title class="no-padding"
              ><h2>
                Out of Stock Products<v-icon style="color: white"
                  >mdi-archive-cancel</v-icon
                >
              </h2></v-card-title
            >
            <v-card-title class="justify-center"
              ><h1>{{ outOfStockProducts() }}</h1></v-card-title
            >
          </v-card></v-col
        >
      </v-row>

      <v-row>
        <v-col cols="12">
  <v-data-table
    :items="InventoriesProduct"
    :items-per-page="10"
    :search="search"
    class="elevation-1"
    dense
  >
  <template v-slot:header>
    <thead>
      <tr>
        <th
          v-for="column in headers"
          :key="column.value"
          :style="{
            backgroundColor: '#1976D2',  // Default background color for all headers
            color: '#fff',  // White text for contrast
            padding: '10px',  // Adjust padding as needed
          }"
        >
          {{ column.text }}
        </th>
      </tr>
    </thead>
  </template>
    <!-- Custom Row Rendering with v-slot -->
    <template v-slot:item="{ item }">
      <tr
       :style="item.stock === 0? 'background-color: #CE4257':'' 
       || item.stock <= 5? 'background-color: #FFBB64':''" 
      >
        <td>{{ item.productNumber }}</td>
        <td>{{ item.item }}</td>
        <td>{{ item.unit }}</td>
        <td>{{ item.brand }}</td>
        <td>{{ item.categoryName }}</td>
        <td>{{ item.description }}</td>
        <td>
          <span :class="item.stock === 0 ? 'blink' : ''">
            {{ item.stock === 0 ? 'OUT OF STOCK' : item.stock }}
          </span>
        </td>
        <td>{{ item.discount }}%</td>
        <td>&#8369; {{ item.originalPrice }}</td>
        <td>&#8369; {{ item.salesPrice }}</td>
        <td>&#8369; {{ totalPrice(item) }}</td>
        <td>
          <v-icon
            :style="hasAccess('Inventories', 'edit') ? '' : 'display:none;'"
            color="primary"
            @click="editInventory(item)"
          >
            mdi-pencil
          </v-icon>
        </td>
      </tr>
    </template>
 
  </v-data-table>
</v-col>


      </v-row>
      <!-- <v-row
        ><v-col>
          <v-pagination
            style="padding-bottom: 30px;"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            color="primary"
          /> </v-col
      ></v-row> -->
      <v-dialog v-model="add_dialog" width="40%">
        <v-card>
          <v-card-title> {{ editButton?'Update':'Add' }} Item </v-card-title>
          <v-card-text>
            <v-btn class="mb-2" dense x-small color="primary" @click="barcodeGenerate()"
              >Generate Barcode</v-btn
            >
            <v-text-field
              v-model="insertItem.productNumber"
              label="Product Number"
              outlined
              dense
              @change="checkSameBarcode(insertItem.productNumber)"
            ></v-text-field>
            <v-text-field
              v-model="insertItem.item"
              label="Item"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.unit"
              label="Unit"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="insertItem.brand"
              label="Brand"
              outlined
              dense
            ></v-text-field>
            <v-autocomplete
              outlined
              v-model="insertItem.categoryID"
              clearable
              color="primary"
              dense
              label="Category"
              :items="list_of_category"
              :item-text="(elem) => elem.categoryName"
              :item-value="(elem) => elem.categoryID"
            />
            {{ insertItem.category }}
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
            <!-- <v-text-field
              v-model="insertItem.discount"
              type="number"
              label="Discount Price"
              outlined
              dense
            ></v-text-field> -->
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
    <v-footer class="footer" dense>
      <v-row>
        <v-col>
          Legends: <v-icon style="color: white">mdi-square</v-icon> - Active Stock
          <v-icon style="color: #FFBB64">mdi-square</v-icon> - Low Stock
          <v-icon style="color: #CE4257">mdi-square</v-icon> - Out of Stock
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

import Excel from "exceljs";
import { saveAs } from "file-saver";
import secret_key from "../plugins/md5decrypt";
import Inventory from "../functions/Inventory"
import Audit from "../functions/Audit"
export default {
  data: () => {
    return {
      // apiUrl: process.env.VUE_APP_API_URL,
      search: "",
      dialog: false,
      dialogDelete: false,
      dialogEdit: false,
      actualStock:0,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
      addButton: false,
      editButton: false,
      add_dialog: false,
      showDatePicker: false,
      from_date: null,
      list_of_category: [],
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
        { text: "Product Number", value: "productNumber" },
        { text: "Item", value: "item" },
        { text: "Unit", value: "unit" },
        { text: "Brand ", value: "brand" },
        { text: "Category ", value: "category" },
        { text: "Description ", value: "description" },
        { text: "Stock", value: "stock" },
        { text: "Discount", value: "discount" },
        { text: "Orignal Price", value: "originalPrice" },
        { text: "Sales Price", value: "salesPrice" },
        { text: "Total", value: "total" },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },

  computed: {
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
    
    extractionData() {
      console.log(this.all_);
      const firstProcess = () => {
        return new Promise((resolve) => {
          const headers = {
            productNumber: "Product Number",
            item: "Item",
            unit: "Unit",
            brand: "Brand",
            category: "Category",
            description: "Description",
            stock: "Stock",
            originalPrice: "Orignal Price",
            salesPrice: "Sales Price",
          };
          const excel_data = [...this.all_products];
          const workbook = new Excel.Workbook();
          const DetailedSheet = workbook.addWorksheet("Detailed");
          // let indexCell = { detailed: 1, summary: 1 };

          DetailedSheet.columns = [
            { key: "A1", width: 25 },
            { key: "B1", width: 25 },
            { key: "C1", width: 25 },
            { key: "D1", width: 25 },
            { key: "E1", width: 25 },
            { key: "F1", width: 25 },
            { key: "G1", width: 25 },
            { key: "H1", width: 25 },
            { key: "I1", width: 25 },
          ];

          excel_data.unshift(headers);
          // console.log(filterExtractedDate);

          excel_data.forEach((value, index) => {
            DetailedSheet.getRow(index).height = 25;

            let column = [
              { key: "A", value: value.productNumber },
              { key: "B", value: value.item },
              {
                key: "C",
                value: value.unit,
              },
              { key: "D", value: value.brand },
              { key: "E", value: value.category },
              { key: "F", value: value.description },
              { key: "G", value: value.stock },
              { key: "H", value: value.originalPrice },
              { key: "I", value: value.salesPrice },
            ];

            let headers = value.ReceivedDate == "Customer Code" ? true : false;
            let borders = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            // let alignment = { wrapText: true };
            let headerFont = { name: "Arial", size: 10, bold: true };
            let Font = { name: "Arial", size: 10, bold: false };

            column.forEach((letter) => {
              // DetailedSheet.getCell(`${letter.key}${index + 1}`).alignment =
              //   letter.key == "M" ? alignment : {};
              DetailedSheet.getCell(`${letter.key}${index + 1}`).border = borders;
              DetailedSheet.getCell(`${letter.key}${index + 1}`).font = headers
                ? headerFont
                : Font;
              DetailedSheet.getCell(`${letter.key}${index + 1}`).value = letter.value;
              if (index + 1 > 1) {
                let heightCell = 0;
                if (letter.key == "S") {
                  let kahitano = letter.value.split("\n");
                  heightCell = kahitano.length * 11;
                  DetailedSheet.getRow(index + 1).height = heightCell;
                }
              }
              if (letter.key !== "S") {
                DetailedSheet.getCell(`${letter.key}${index + 1}`).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
              }
            });
          });

          const buffer = workbook.xlsx.writeBuffer();
          resolve(buffer);
        });
      };
      firstProcess().then((val) => {
        const blob = new Blob([val], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Extraction Master(${moment().format("YYYY-MM-DD")})`);
      });
      // const buffer = workbook.csv.writeBuffer();
      //     resolve(buffer);
      //   });
      // };
      // firstProcess().then((val) => {
      //   const blob = new Blob([val], {
      //     type: "text/csv",
      //   });
      //   saveAs(blob, `Extraction Master(${moment().format("YYYY-MM-DD")})`);
      // });
    },

    checkSameBarcode(val) {
      Inventory.fetchPerProduct(this.$store.state.storedEmp.token,val)
        .then((res) => {
        
          if (res.data.length) {
            console.log(res.data)
            this.insertItem = res.data[0]
            Swal.fire({
              title: "Product Code Exist!",
              text: "update product code",
              icon: "warning",
            });
            this.actualStock += this.insertItem.stock
            // this.insertItem.stock 
            delete this.insertItem.discount_value;
            this.addButton =false
            this.editButton = true
            // this.insertItem.productNumber = "";
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
    fetchProducts() {
      Inventory.getAllProducts(this.$store.state.storedEmp.token)
        .then((res) => {
          const data = res.data;
          this.all_products = data;
        });
    },
    updateInventory(val) {
      if(!this.insertItem.productNumber || 
      !this.insertItem.item || 
      !this.insertItem.unit || 
      !this.insertItem.brand || 
      !this.insertItem.categoryID || 
      !this.insertItem.description || 
      !this.insertItem.stock || 
      !this.insertItem.originalPrice || 
      !this.insertItem.salesPrice

      ){

        Swal.fire("Please complete the details", "", "error");
        
        return false
      }
      // this.actualStock = this.insertItem.stock
            if(val.stock <=this.actualStock){
              alert("Not less than from actual stock")
              return false
            }
            
      val.date = moment(val.date).format("YYYY-MM-DD hh:ss:mm");
      delete val.discount_value;
      delete val.categoryName;
      Inventory.updateProduct(this.$store.state.storedEmp.token,val)
        .then(() => {
          // this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
          let audit_logs = {
            action: `Update Item`,
            description: `Update Item: ${val.productNumber} stock: ${val.stock}`,
            product_number: val.productNumber,
            quantity: val.stock,
            drawer_link: `Inventories`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };

          Audit.AddLogs(this.$store.state.storedEmp.token,audit_logs)
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
      if(!this.insertItem.productNumber || 
      !this.insertItem.item || 
      !this.insertItem.unit || 
      !this.insertItem.brand || 
      !this.insertItem.categoryID || 
      !this.insertItem.description || 
      !this.insertItem.stock || 
      !this.insertItem.originalPrice || 
      !this.insertItem.salesPrice

      ){

        Swal.fire("Please complete the details", "", "error");
        
        return false
      }
      this.insertItem.date = moment().format("YYYY-MM-DD hh:mm:ss");
      let add_data = this.insertItem;
      Inventory.addProduct(this.$store.state.storedEmp.token,add_data)
        .then(() => {
          this.all_products.push(this.insertItem);
          alert("NEW ITEM ADDED");
          this.add_dialog = false;

          let audit_logs = {
            action: `Added New Item`,
            description: `NEW Item: ${this.insertItem.productNumber} stock: ${this.insertItem.stock}`,
            product_number: this.insertItem.productNumber,
            quantity: this.insertItem.stock,
            drawer_link: `Inventories`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
          
          Audit.AddLogs(this.$store.state.storedEmp.token,audit_logs)

        })
        .catch((err) => {
          alert(err);
        });
    },
    getAllCategories() {
      axios
        .get(`${this.apiUrl}/category/api/getCategory`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.list_of_category = res.data;
        });
    },
  },
  mounted() {
    this.fetchProducts();
    this.getAllCategories();
    this.authorization = secret_key(this.$store.state.storedEmp.token);
  },
};
</script>

<style scoped>
/* Apply custom styles to remove padding */
.no-padding {
  background-color: #1976d2;
  color: white;
}
.out-of-stock {
  background-color: #CE4257;
}

.low-stock {
  background-color: #FFBB64;
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
