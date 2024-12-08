<template>
  <div>
    <v-container fluid>
      <h1>Sales Report<v-icon>mdi-cash</v-icon></h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field v-model="search" outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col>
          <!-- FROM DATE -->
          <v-menu
        v-model="first_date_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="first_date"
            prepend-icon="mdi-calendar"
                readonly
                dense
                rounded
                outlined
            label="From Date"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="first_date"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
        </v-col>
        <v-col>
          <!-- TO DATE -->
          <v-menu
        v-model="second_date_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="second_date"
            label="To Date"
            prepend-icon="mdi-calendar"
            dense
                rounded
                outlined
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="second_date"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
        </v-col>
        <v-col>
          <v-btn @click="filterDate()" color="primary"> Filter Date </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="extractionData()" color="success">
            <v-icon>mdi-microsoft-excel</v-icon> Extract Data
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="all_products"
                item-key="salesID"
                :search="search"
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
                  <tr>
                    <td>{{ item.salesID }}</td>
                    <td>{{ item.reference_number?item.reference_number:'No reference number' }}</td>
                    <td>{{ item.mode_payment}}</td>
                    <td>{{ item.item_count }}</td>
                    <td>{{ item.total_sum }}</td>
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            @click="returnItems(item)"
                          >
                            mdi-eye
                          </v-icon>
                        </template>
                        <span>View Items</span>
                      </v-tooltip>
                    </td>
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
        <div style="overflow-y: hidden; padding: 1px">
          <div id="receipt-card" style="width: 100%">
            <div class="printable">
              <p style="text-align: center">
                <b>{{ this.$store.state.storeName.name }}</b>
              </p>
              <p style="text-align: center">Receipt No: {{ salesInvoice }}</p>
              <p style="text-align: center">
                Cashier Name: {{ this.$store.state.storedEmp.userdetails[0].fullname }}
              </p>
              <hr />
              <ul style="width: 100%; padding: 0">
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                >
                  <div>Items</div>
                  <div style="text-align: end">Total Price</div>
                </li>
                <li
                  v-for="(item, index) in saled_items"
                  :key="index"
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                >
                  <div>
                    <p>{{ item.quantity }} x {{ item.price }} {{ item.item }}</p>
                  </div>
                  <div style="text-align: end">
                    <p>{{ item.total }}</p>
                  </div>
                </li>
              </ul>
              <hr />
              <ul style="width: 100%; padding: 0">
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                >
                  <div>Total:</div>
                  <div>{{ total }} PHP</div>
                </li>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                ></li>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                >
                  <div>Paid Amount:</div>
                  <div>{{ cash }} PHP</div>
                </li>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                ></li>
              </ul>
            </div>
          </div>
        </div>
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
// import _ from "lodash"
export default {
  data: () => {
    return {
      search:"",
      total: "",
      salesInvoice: "",
      apiUrl: process.env.VUE_APP_API_URL,
      sales_extracted: [],
      editModeReturn: false,
      return_dialog: false,
      showDatePicker: false,
      from_date: null,
      all_products: [],
      saled_items: [],
      first_date_menu: false,
      second_date_menu: false,
      first_date: moment().subtract(1, "month").format("YYYY-MM-DD"),
      second_date: moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Sales ID", value: "salesID" },
        {text:"Reference Number", value:"reference_number"},
        {text:"Mode of payment", value:"mode_payment"},
        { text: "Item Count", value: "item_count" },
        { text: "Total Sum", value: "total_sum" },
        { text: "Action", sort: false },
        // Add more headers as needed
      ],
      headers_products: [
        { text: "Item", value: "item" },
        { text: "Price", value: "salesPrice" },
        { text: "Quantity", value: "quantity" },
        { text: "Total", value: "total" },
      ],
    };
  },
  methods: {
    filterDate() {
      this.getAllProducts();
    },
    async extractionData() {
      try {
        const response = await axios.get(
          `${this.apiUrl}/sales/api/getSalesExtraction/${this.first_date}/${this.second_date}`,
          {
            headers: {
              authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
            },
          }
        );
        const sales_extracted = response.data;

        // Process the data
        const processedData = await this.firstProcess(sales_extracted);

        // Group data by salesID
        const groupedData = processedData.reduce((acc, row) => {
          if (!acc[row.salesID]) {
            acc[row.salesID] = [];
          }
          acc[row.salesID].push(row);
          return acc;
        }, {});

        // Create a new workbook
        const workbook = new Excel.Workbook();

        // Create a summary sheet
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.columns = [
          { header: 'Sales ID', key: 'salesID', width: 20 },
          { header: 'Date', key: 'date', width: 30 },
          { header: 'Total', key: 'total', width: 20 },
        ];

        let overallTotal = 0;

        // Create a sheet for each unique salesID and add data
        for (const salesID in groupedData) {
          const sheetData = groupedData[salesID];
          const worksheet = workbook.addWorksheet(`SalesID_${salesID}`);

          // Add column headers
          worksheet.columns = Object.keys(sheetData[0]).map((key) => ({ header: key, key }));

          // Add rows to the worksheet
          sheetData.forEach((row) => {
            // Format the date using moment.js
            row.date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
            worksheet.addRow(row);
          });

          // Calculate the total for the 'total' column
          const totalColumnKey = 'total'; // Change this to the actual column key if different
          let salesIDTotal = 0;
          sheetData.forEach((row) => {
            salesIDTotal += parseFloat(row[totalColumnKey]) || 0;
          });

          // Add the total label and sum to the worksheet
          const totalRow = worksheet.addRow({});
          totalRow.getCell('D').value = 'Total:';
          totalRow.getCell('D').font = { bold: true };
          totalRow.getCell('E').value = salesIDTotal;
          totalRow.getCell('E').font = { bold: true };

          // Adjust column widths for better display
          worksheet.columns.forEach(column => {
            const maxLength = column.header.length > 10 ? column.header.length : 10;
            column.width = maxLength;
          });

          // Add salesID, date, and total to the summary sheet with hyperlink
          summarySheet.addRow({
            salesID: { text: salesID, hyperlink: `#'SalesID_${salesID}'!A1` },
            date: moment(sheetData[0].date).format('YYYY-MM-DD HH:mm:ss'),
            total: salesIDTotal,
          });

          // Add to overall total
          overallTotal += salesIDTotal;
        }

        // Add overall total to the summary sheet
        const overallTotalRow = summarySheet.addRow({});
        overallTotalRow.getCell('B').value = 'Overall Total:';
        overallTotalRow.getCell('B').font = { bold: true };
        overallTotalRow.getCell('C').value = overallTotal;
        overallTotalRow.getCell('C').font = { bold: true };

        // Convert the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create a blob from the buffer and save it
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `Sales Extraction(${moment().format('YYYY-MM-DD')}).xlsx`);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    },
    firstProcess(data) {
      // Implement your processing logic here
      // Return the processed data
      return data;
    },
    // firstProcess(sales_extracted) {
    //   return new Promise((resolve, reject) => {
    //     const headers = {
    //       salesID: "Sale ID",
    //       productNumber: "Product Number",
    //       item: "Item",
    //       salesPrice: "Sales Price",
    //       quantity: "Quantity",
    //       total: "Total",
    //       date: "Date",
    //     };
    //     const excel_data = [headers, ...sales_extracted]; // Place headers first
    //     const workbook = new Excel.Workbook();
    //     const DetailedSheet = workbook.addWorksheet("Detailed");

    //     DetailedSheet.columns = [
    //       { key: "A", width: 25 },
    //       { key: "B", width: 25 },
    //       { key: "C", width: 25 },
    //       { key: "D", width: 25 },
    //       { key: "E", width: 25 },
    //       { key: "F", width: 25 },
    //       { key: "G", width: 25 },
    //     ];

    //     excel_data.forEach((value, index) => {
    //       DetailedSheet.getRow(index + 1).height = 25;

    //       Object.keys(value).forEach((key, columnIndex) => {
    //         DetailedSheet.getCell(
    //           `${String.fromCharCode(65 + columnIndex)}${index + 1}`
    //         ).value = value[key];
    //       });
    //     });

    //     workbook.xlsx
    //       .writeBuffer()
    //       .then((buffer) => {
    //         resolve(buffer);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // },

    getAllProducts() {
  axios
    .get(`${this.apiUrl}/sales/api/getSales/${this.first_date}/${this.second_date}`, {
      headers: {
        authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
      },
    })
    .then((res) => {
      console.log(res.data)
      this.all_products = res.data
      
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
          this.salesInvoice = val.salesID;
          this.total = val.total_sum;
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
