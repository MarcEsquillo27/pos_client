<template>
  <div>
    <v-container fluid>
      <h1>Point of Sale <v-icon>mdi-point-of-sale</v-icon></h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-autocomplete
            outlined
            rounded
            clearable
            color="primary"
            dense
            label="Search"
            :items="list_of_products"
            :item-text="
              (elem) => {
                return elem.productNumber + ' : ' + elem.item;
              }
            "
            item-value="productNumber"
            v-model="products_code"
            @change="getProducts(products_code)"
          />
          <!-- <v-autocomplete
          
          v-model="products_code"
           
          /> -->
        </v-col>
        <v-col><v-btn @click="pending_dialog = true"><v-icon>mdi-cart-outline</v-icon>Pending Transaction({{ pendingItemArr.length }})</v-btn></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="9">
          <v-card>
            <v-card-title>Products</v-card-title>
            <v-card-text>
              <!-- <v-data-table :headers="headers" :items="products">

              </v-data-table> -->
              <v-simple-table class="border" dense>
                <thead>
                  <tr>
                    <th colspan="2">Action</th>
                    <th v-for="(items, index) in headers" :key="index">
                      {{ items.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(items, index) in products" :key="index">
                    <td v-if="!items.editMode">
                      <v-icon color="primary" @click="toggleEditMode(items)"
                        >mdi-pencil</v-icon
                      >
                    </td>
                    <td v-else>
                      <v-icon color="primary" @click="items.editMode = false"
                        >mdi-close</v-icon
                      >
                    </td>
                    <td>
                      <v-icon color="error" @click="toggleDelete(items)"
                        >mdi-delete</v-icon
                      >
                    </td>
                    <td>{{ items.item }}</td>
                    <td>{{ items.stock }}</td>
                    <td>{{ items.salesPrice }}</td>
                    <td v-if="!items.editMode">{{ items.quantity }}</td>
                    <td v-else>
                      <v-text-field dense block type="number" v-model="items.quantity" />
                      <v-btn x-small color="success" @click="saveChanges(items)"
                        >Save</v-btn
                      >
                    </td>
                    <td>{{ items.subtotal }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card class="pa-2" width="100%">
            <v-card-title>Summary</v-card-title>
            <hr />
            <v-row>
              <v-col cols="6"> Total </v-col>
              <v-col cols="6">
                {{ totalDiscounted() }}
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="6"
                ><v-checkbox
                  label="
                   20%
                  "
                  v-model="discounted"
              /></v-col>
            </v-row>
            <v-row>
              <v-col v-if="!deliveryArr.length"
                ><v-btn
                  :disabled="total > 0 ? false : true"
                  rounded
                  block
                  color="primary"
                  @click="delivery_dialog = true"
                  >For Delivery</v-btn
                ></v-col
              >
              <v-col v-else
                ><v-btn
                  :disabled="total > 0 ? false : true"
                  rounded
                  block
                  color="success"
                  @click="delivery_dialog = true"
                  >Edit Delivery</v-btn
                ></v-col
              >
            </v-row>
            <v-row class="mt-5">
              <v-col cols="12"> Payment Type </v-col>
              <v-col cols="12">
                <v-btn
                  :disabled="total > 0 ? false : true"
                  rounded
                  block
                  @click="electronicPayment()"
                  class="mt-1"
                  outlined
                  dense
                  >E-payment</v-btn
                >
                <v-btn
                  :disabled="total > 0 ? false : true"
                  rounded
                  block
                  @click="cashPayment()"
                  class="mt-1"
                  outlined
                  dense
                  >CASH</v-btn
                >
              </v-col>
            </v-row>
            <v-btn
              :disabled="total > 0 ? false : true"
              @click="pendingItem()"
              rounded
              block
              color="warning"
              class="mt-2"
              >Add to Pending</v-btn
            >
            <v-btn
              :disabled="total > 0 ? false : true"
              @click="voidItem()"
              rounded
              block
              color="error"
              class="mt-2"
              >Void</v-btn
            >
           
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- FOR EPAYMENT -->
    <v-dialog v-model="epayment_dialog" width="500">
      <v-card>
        <v-card-title> E-payment </v-card-title>
        <v-card-text>
          <v-select
            @change="modeOfPayment(mode_of_payment)"
            v-model="mode_of_payment"
            :items="['G-cash', 'Paymaya']"
            dense
            outlined
            rounded
            label="Mode of Payment"
          />
          <img
            v-if="qr_image == 'gcash'"
            width="450"
            src="https://businessmaker-academy.com/cms/wp-content/uploads/2022/04/Gcash-BMA-QRcode-768x1024.jpg"
          />
          <img
            v-else-if="qr_image == 'paymaya'"
            width="450"
            src="https://negosyohelp.paymaya.com/servlet/rtaImage?eid=ka02y000000gIkF&feoid=00N7F00000Sg9GO&refid=0EM2y00000213P7"
          />
          <h1 v-else>No QR Displayed yet</h1>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="purchase()"
            v-if="qr_image == 'gcash' || qr_image == 'paymaya'"
            dense
            block
            rounded
            color="success"
            >Purchase</v-btn
          >

          <v-btn v-else disabled dense block rounded color="success">Purchase</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- CASH PAYMENT -->
    <v-dialog v-model="cash_dialog" width="500">
      <v-card>
        <v-card-title> CASH </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6"> Total </v-col>
            <v-col cols="6">
              {{ total }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"> Pay </v-col>
            <v-col cols="6">
              <v-text-field
                @change="changeTotal()"
                v-model="cash"
                type="number"
                dense
                rounded
                outlined
                label="Enter Amount"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"> Change </v-col>
            <v-col cols="6">
              {{ changeTotal() }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="purchase()"
            v-if="change >= 0"
            dense
            block
            rounded
            color="success"
            >Purchase</v-btn
          >

          <v-btn v-else disabled dense block rounded color="success">Purchase</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- RECEIPT -->
    <v-dialog v-model="receipt_dialog" width="500">
      <div>
        <v-card id="receipt-card">
          <v-card-text  class="printable">
            <p style="text-align: center">
              <b>Hardware Store Philippines</b><br />
              764-B Street Subdivision Cavite City, Cavite<br />
              Phone# 1234-5678
            </p>
            Invoice No: {{ salesInvoice }}
            <v-divider></v-divider>
            <v-row>
              <v-col>Cashier ID : 41456</v-col>
              <v-col>Date : 2024-03-21 15:22:16</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Items</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>Qty</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-list-item-title>Price</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in products" :key="index">
                  <v-list-item-content>
                    <v-list-item-title><p>{{ item.item }}</p></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title><p>{{ item.quantity }}</p></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-list-item-title><p>{{ item.subtotal }}</p></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Total:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-list-item-title>{{ total }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>CASH:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-list-item-title>{{ cash }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Change:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-list-item-title>{{ changeTotal() }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
         
        </v-card>
        
        <v-card><v-card-text><v-btn @click="printReceipt()" text>Print</v-btn></v-card-text></v-card>
      </div>
    </v-dialog>

    <!-- DIALOG FOR DELIVERY SCHEDULE -->

    <v-dialog v-model="delivery_dialog" width="500">
      <v-card id="my-card">
        <v-card-title>Delivery Schedule</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="contact_name"
            outlined
            rounded
            dense
            block
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="contact_details"
            outlined
            rounded
            dense
            block
            label="Contact Details"
          ></v-text-field>
          <v-text-field
            v-model="contact_address"
            outlined
            rounded
            dense
            block
            label="Address"
          ></v-text-field>
          <v-text-field
            rounded
            dense
            block
            v-model="selectedDate"
            label="Date and Time"
            outlined
            readonly
            @click="showDatePicker = !showDatePicker"
          ></v-text-field>

          <v-date-picker
            block
            v-model="selectedDate"
            v-if="showDatePicker"
          ></v-date-picker>
          <v-text-field
            v-model="selectedTime"
            label="Time"
            outlined
            rounded
            dense
            readonly
            @click="showTimePicker = !showTimePicker"
          ></v-text-field>

          <v-time-picker
            v-model="selectedTime"
            format="ampm"
            v-if="showTimePicker"
          ></v-time-picker>
          <v-btn dense rounded block color="success" @click="saveDelivery()">Save</v-btn>
          <v-btn
            class="mt-2"
            dense
            rounded
            block
            color="error"
            @click="delivery_dialog = false"
            >Cancel</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="pending_dialog" width="300">
      <v-card>
        <v-card-title>Pending Transaction</v-card-title>
        <v-card-text>
          <v-row v-for="(items, index) in pendingItemArr" :key="index">
            <v-col><v-btn @click="backTransaction(items,index)">{{pendingID( items[0].date) }}</v-btn></v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2"
// import printJS from "print-js";
export default {
  data: () => {
    return {
      pending_dialog:false,
      pendingItemArr:[],
      for_delivery: false,
      discounted: false,
      products_code: "",
      editMode: false,
      epayment_dialog: false,
      delivery_dialog: false,
      cash_dialog: false,
      receipt_dialog: false,
      mode_of_payment: null,
      qr_image: "",
      salesInvoice: null,
      selectedDate: null,
      selectedTime: null,
      showDatePicker: false,
      showTimePicker: false,
      contact_address: "",
      contact_details: "",
      contact_name: "",
      cash: 0,
      total: 0,
      change: 0,
      headers: [
        { text: "Item", value: "item" },
        { text: "Stock", value: "stock" },
        { text: "Price", value: "salesPrice" },
        { text: "Quantity", value: "quantity" },
        { text: "Subtotal", value: "subtotal" },
      ],
      products: [],
      deliveryArr: [],
      list_of_products: [],
      // payment_type:null
    };
  },
  methods: {
    backTransaction(val,index){
      console.log(val)
      let confirmation = confirm("Are you sure you want to continue the transaction?");
      if (confirmation) {
        this.products = val
        this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
        this.pendingItemArr.splice(index,1)
        this.pending_dialog = false
        alert("Transaction Complete")
      }
    },
    pendingID(val){
      return moment(val).format("YYYYMMDDhhmmss")
    },
    pendingItem(){
      let confirmation = confirm("Are you sure you want to pending the transaction?");
      if (confirmation) {
  
        this.pendingItemArr.push(this.products)
    
        
        this.products = [];
        this.products_code = "";
        this.total = 0;
        this.cash = 0;
        this.change = 0;
      }
      console.log(this.pendingItemArr)
    },
    saveDelivery() {
      let get_details = {
        name: this.contact_name,
        address: this.address,
        contact: this.contact_details,
        date: this.selectedDate,
        time: this.selectedTime,
      };
      this.deliveryArr.push(get_details);

      alert("Save Succesfully");
      this.delivery_dialog = false;
    },
    voidItem() {
      let confirmation = confirm("Are you sure you want to void the transaction?");
      if (confirmation) {
        this.products = [];
        this.products_code = "";
        this.total = 0;
        this.cash = 0;
        this.change = 0;
      }
      // let void_authentication = prompt("Enter Admin Password")
      // if(void_authentication == "void_admin"){
      // alert("void successfully")
      // this.products = []
      // this.products_code = ""
      // this.total = 0
      // this.cash = 0
      // this.change = 0
      // }
      // else{
      //   alert("Wrong password please try again")
      // }
    },
    toggleDelete(item) {
      let confirmation = confirm("Are you sure you want to delete?");
      if (confirmation) {
        let get_index = this.products.indexOf(item);
        this.products.splice(get_index, 1);
        this.total = this.total - item.subtotal;
        this.products_code = "";
        this.cash = 0;
        this.change = 0;
      }
    },
    toggleEditMode(item) {
      item.editMode = true;
    },
    saveChanges(item) {
      item.editMode = false;
      item.subtotal = item.salesPrice * item.quantity;
      this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
    },
    //TOTAL DISCOUNT
    totalDiscounted() {
      if (this.discounted) {
        let discounted_total = this.total * 0.20;
        let final_total = this.total - discounted_total;

        return final_total.toFixed(2);
      } else {
        return this.total.toFixed(2);
      }
    },
    //CHANGE TOTAL
    changeTotal() {
      this.change = this.cash - this.total;
      if (this.change <= 0) {
        return 0;
      } else {
        return this.cash - this.total;
      }
    },
    //ALL GET DATA
    getProducts(val) {
      if (val) {
        axios
          .get(`https://pos-server-ktwz.vercel.app/inventory/api/getPerItem/${val}`)
          .then((res) => {
            console.log(res.data);
            let result_product = res.data[0];
            result_product.discounted = false;
            // Check if the product already exists in this.products based on its ID
            let existingProduct = this.products.find(
              (product) => product.productNumber === result_product.productNumber
            );

            if (existingProduct) {
              // If the product exists, update its quantity, subtotal, and stock
              existingProduct.quantity++;
              existingProduct.stock--;
              existingProduct.subtotal =
                existingProduct.salesPrice * existingProduct.quantity;
            } else {
              // If the product doesn't exist, add it to this.products array
              result_product.quantity = 1; // Initialize quantity to 1
              result_product.stock--; // Decrease stock as it's being added
              result_product.subtotal =
                result_product.salesPrice * result_product.quantity; // Calculate subtotal
              result_product.editMode = false;

              this.products.push(result_product);
            }
            this.total = this.products.reduce(
              (acc, product) => acc + product.subtotal,
              0
            );
            this.products_code = "";
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            this.products_code = "";
          });
      }
    },
    // ALL @CLICK FUNCTION
    electronicPayment() {
      this.epayment_dialog = true;
    },
    cashPayment() {
      this.cash_dialog = true;
    },
    purchase() {
      console.log(this.products);
      axios
        .post("https://pos-server-ktwz.vercel.app/inventory/api/updateInventoryStock", this.products)
        .then((res) => {
          console.log(res.data);
          axios
            .post("https://pos-server-ktwz.vercel.app/sales/api/addSales", this.products)
            .then(() => {
              this.salesInvoice = moment().format("YYYYMMDDhhmmss");
            })
            .then(() => {
              for (let i = 0; i < this.products.length; i++) {
                const element = this.products[i];
                let audit_logs = {
                  action: `Decrease`,
                  description: `The ${element.productNumber} decreased ${element.quantity}`,
                  product_number: element.productNumber,
                  quantity: element.quantity,
                  drawer_link: `POS`,
                  date: moment().format("YYYY-MM-DD hh:mm:ss"),
                };
                axios
                  .post("https://pos-server-ktwz.vercel.app/audit/api/addLogs", audit_logs)
                  .then((res) => {
                    console.log(res.data);
                  });
              }
            });
          this.receipt_dialog = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
   
    printReceipt() {
      Swal.fire({
  title: "Transaction Complete",
  icon: "success",
  timer: 2000,
}).then(()=>{
  window.location.reload();
});
      setTimeout(() => {
        const printContents = document.getElementById('receipt-card').innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();

  document.body.innerHTML = originalContents;

      }, 1000);

},

    // ALL @CHANGE FUNCTION
    modeOfPayment(val) {
      if (val == "G-cash") {
        this.qr_image = "gcash";
      } else if (val == "Paymaya") {
        this.qr_image = "paymaya";
      } else {
        this.qr_image = "";
      }
    },
    getAllProducts() {
      axios
        .get("https://pos-server-ktwz.vercel.app/inventory/api/getInventory")
        .then((res) => {
          this.list_of_products = res.data;
        })
        .catch((err) => {
          alert(err.message);
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
th,
td {
  border: 1px solid black; /* 1px width solid black border */
  padding: 8px; /* optional padding for better visualization */
}
th {
  background-color: #1976d2;
  color: white !important;
}

@media print {
  .printable {
    border: 1px solid #ccc;
    padding: 20px;
    /* color: red !important; */
    /* Add more print-specific styles */
  }
  @page {
    size: 100mm 297mm; /* Adjust width and height as per your requirement */
    /* You can also use standard paper sizes like A4, letter, etc. */
    /* Example: size: A4 landscape; */
  }
}
</style>
