<template>
  <div>
    <v-container fluid>
      <h1>Point of Sale <v-icon>mdi-point-of-sale</v-icon></h1>

      <v-row>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" width="100%">
            <v-card-text>
              <v-container class="scroll-container">
                <v-row
                  dense
                  v-for="(items, index) in products"
                  :key="index"
                  class="mt-2 pa-0"
                  style="border: 2px solid #000; border-radius: 5px; padding: 1px"
                >
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ items.item }}</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ items.salesPrice }} x
                        {{ items.quantity }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text
                        ><h1>{{ items.subtotal }}</h1></v-list-item-action-text
                      >
                      <v-list-item-action-text
                        ><v-icon small @click="toggleDelete(items)" style="color: #ff3333"
                          >mdi-delete</v-icon
                        >
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </v-row>
              </v-container>
              <br />
              <hr />
              <!-- <v-row>
                <v-col cols="6"> Total </v-col>
                <v-col cols="6">
                  {{ totalDiscounted() }}
                </v-col>
              </v-row> -->
              <v-row justify="end">
                <v-col
                  ><v-checkbox
                    class="mt-2"
                    :disabled="ifdiscount ? true : false"
                    label="
                   20% Discount
                  "
                    v-model="discounted"
                    hide-details
                /></v-col>
                <v-col>
                  <v-btn
                    :disabled="total > 0 ? false : true"
                    @click="pendingItem()"
                    dense
                    small
                    block
                    color="warning"
                    class="mt-2"
                    >Add to Pending</v-btn
                  >
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-col
                  ><v-checkbox
                    class="mt-2"
                    label="
                   E-Payment
                  "
                    v-model="epayment"
                    hide-details
                  />
                  <v-checkbox
                    label="
                   Cash
                  "
                    v-model="cashpayment"
                    hide-details
                  />
                </v-col>
                <!-- {{ cashpayment }} -->
                <v-col>
                  <v-btn class="mt-2" small @click="pending_dialog = true"
                    >Pending Transaction({{ list_of_pending.length }})</v-btn
                  >
                </v-col>
              </v-row>
              <br />
              <hr />
              <v-row>
                <v-col>
                  <v-btn
                    :disabled="cashpayment || epayment ? false : true"
                    large
                    class="d-flex flex-column align-center mt-2"
                    color="success"
                    @click="cashpayment ? cashPayment() : electronicPayment()"
                  >
                    <div style="display: flex; flex-direction: column">
                      <v-icon>mdi-greater-than</v-icon>
                      <span>Payment</span>
                    </div>
                  </v-btn>
                </v-col>
                <v-col class="sizeFont">
                  Mode of Payment:
                  {{ epayment ? "E-Payment" : cashpayment ? "Cash" : "" }}
                  <br />
                  Orginal Total:
                  <br />
                  Discounted Applied Amount:
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <h1 style="float: right">Total: {{ totalDiscounted() }}</h1></v-col
                >
              </v-row>
              <!-- <v-row>
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
              </v-row> -->
              <!-- <v-row class="mt-5">
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
                
                </v-col>
              </v-row> -->
              <!-- <v-btn
                :disabled="total > 0 ? false : true"
                rounded
                block
                @click="cashPayment()"
                class="mt-1"
                outlined
                dense
                >CASH</v-btn
              > -->
              <!-- <v-btn
                :disabled="total > 0 ? false : true"
                @click="pendingItem()"
                rounded
                block
                color="warning"
                class="mt-2"
                >Add to Pending</v-btn
              > -->
              <!-- <v-btn
                :disabled="total > 0 ? false : true"
                @click="voidItem()"
                rounded
                block
                color="error"
                class="mt-2"
                >Void</v-btn
              > -->
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card>
            <v-card-title>Products</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-autocomplete
                    outlined
                    rounded
                    clearable
                    color="primary"
                    dense
                    v-model="category"
                    label="Category"
                    :items="list_of_category"
                    :item-text="(elem) => elem.categoryName"
                    :item-value="(elem) => elem.categoryID"
                    @change="filterCategory()"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    rounded
                    clearable
                    color="primary"
                    dense
                    label="Search"
                    v-model="product_search"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  xs="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  v-for="(items, index) in searchProducts"
                  :key="index"
                >
                  <v-card elevation="10" @click="getProducts(items.productNumber)">
                    <v-card-title>
                      {{ items.item }}
                      <v-icon :style="items.discount_id ? '' : 'display:none'">
                        mdi-sale
                      </v-icon>
                    </v-card-title>
                    <v-card-subtitle>{{ items.productNumber }}</v-card-subtitle>
                    <v-card-text>
                      Stock: {{ items.stock }} <br />
                      Price: {{ items.salesPrice }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                color="primary"
              />
            </v-card-text>
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
      <v-card>
        <div style="overflow-y: hidden; padding: 1px">
          <div id="receipt-card" style="width: 100%">
            <div class="printable">
              <p style="text-align: center">
                <!-- <b>{{ this.$store.state.storeName.name }}</b> -->
              </p>
              <p style="text-align: center">Receipt No: {{ salesInvoice }}</p>
              <p style="text-align: center">
                <!-- Cashier Name: {{ this.$store.state.storedEmp[0].name }} -->
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
                  v-for="(item, index) in products"
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
                    <p>{{ item.subtotal }}</p>
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
                >
                  <div>Mode of Payment:</div>
                  <div>{{ epayment ? "E-Payment" : cashpayment ? "Cash" : "" }}</div>
                </li>
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
                >
                  <div>Change:</div>
                  <div>{{ changeTotal() }} PHP</div>
                </li>
              </ul>
              <div style="text-align: center; margin-top: 20px">
                <svg id="barcode"></svg>
              </div>
            </div>
          </div>

          <div>
            <div>
              <v-btn @click="printReceipt()">Print</v-btn>
            </div>
          </div>
        </div>
      </v-card>
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

    <v-dialog v-model="pending_dialog" fullscreen>
      <v-card>
        <v-card-title style="background-color: #1976d2; color: #fff"
          >Pending Transaction

          <v-spacer />
          <v-icon @click="pending_dialog = false" style="color: #fff">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-text-field
            class="mt-2"
            v-model="search"
            label="Search Pending Transaction"
            outlined
            rounded
            dense
            block
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>

          <v-row>
            <v-col>
              <v-expansion-panels class="mt-2" inset>
                <v-expansion-panel
                  v-for="(item, i) in filteredPendingTransactions"
                  :key="i"
                  :expanded="item.expanded"
                  @click.native="togglePanel(i)"
                >
                  <v-expansion-panel-header>
                    {{ item.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="item.expanded">
                    <v-data-table
                      :headers="headers"
                      :items="item.children"
                      :items-per-page="5"
                      class="elevation-1"
                    ></v-data-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <!-- <v-col><v-btn @click="backTransaction(items,index)">{{pendingID( items[0].date) }}</v-btn></v-col> -->
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";
import JsBarcode from "jsbarcode";
import secret_key from "../plugins/md5decrypt";
// import printJS from "print-js";
export default {
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      category: "",
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 0,
      list_of_category: [],
      product_search: "",
      epayment: false,
      cashpayment: false,
      discounted_price: 0,
      search: "",
      ifdiscount: false,
      list_of_pending: [],
      pending_dialog: false,
      pendingItemArr: [],
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
      authorization: "",
      headers: [
        { text: "Item", value: "name" },
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
  watch: {
    currentPage() {
      this.fetchProducts();
    },
  },
  computed: {
    filteredPendingTransactions() {
      if (!this.search) return this.list_of_pending;
      const searchTerm = this.search.toLowerCase();
      return this.list_of_pending.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm);
      });
    },
    filterCategory() {
      let filteredProducts = this.list_of_products;
      // Apply filter if necessary
      if (this.category) {
        filteredProducts = _.filter(
          filteredProducts,
          (item) => item.categoryID == this.category
        );
      }
      return filteredProducts;
    },
    searchProducts() {
      let productArr = this.filterCategory;
      return productArr.filter((item) => {
        // Convert both item name and product number to lowercase for case-insensitive search
        const itemName = item.item.toLowerCase();
        const productNumber = item.productNumber.toLowerCase();

        // Check if either item name or product number contains the search query
        return (
          itemName.includes(this.product_search.toLowerCase()) ||
          productNumber.includes(this.product_search.toLowerCase())
        );
      });
    },
  },
  methods: {
    generateBarcode() {
      console.log(this.salesInvoice, "668");
      if (this.salesInvoice) {
        JsBarcode("#barcode", this.salesInvoice, {
          format: "CODE128",
          displayValue: true,
          height: 30,
          fontSize: 12,
        });
      }
    },
    fetchProducts() {
      axios
        .get(`https://pos-server-ktwz.vercel.app/inventory/api/getInventory`, {
          params: {
            page: this.currentPage,
            page_size: this.itemsPerPage,
          },
           headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((response) => {
          const data = response.data;
          // this.list_of_products = data.products;
          console.log(data.products);
          this.list_of_products = data.products.filter((rec) => {
            if (rec.stock > 0) {
              if (rec.discount_id !== null) {
                rec.salesPrice -= (rec.salesPrice * rec.discount_value) / 100;
              }
              return rec;
            }
          });
          this.totalPages = Math.ceil(data.totalItems / this.itemsPerPage);

          // console.log(this.list_of_products)
          this.list_of_products;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    dateToday() {
      return moment().format("YYYY-MM-DD hh:mm:ss");
    },
    discountedPrice(val) {
      return (this.discounted_price -= (val.salesPrice * val.discount_value) / 100);
    },
    togglePanel(index) {
      this.filteredPendingTransactions.forEach((item, i) => {
        if (i === index) {
          // Toggle the expanded state of the clicked panel
          item.expanded = !item.expanded;
        } else {
          // Collapse other panels
          item.expanded = false;
        }
        console.log(item);
      });
    },
    backTransaction(val, index) {
      console.log(val);
      let confirmation = confirm("Are you sure you want to continue the transaction?");
      if (confirmation) {
        this.products = val;
        this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
        this.pendingItemArr.splice(index, 1);
        this.pending_dialog = false;
        alert("Transaction Complete");
      }
    },
    pendingID(val) {
      return moment(val).format("YYYYMMDDhhmmss");
    },
    pendingItem() {
      Swal.fire({
        title: "Are you sure you want to pending the transaction?",
        text: "please Enter Pending Name",
        input: "text",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Add Pending",
        denyButtonText: `Cancel`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let a = 1;

          a++;

          let item = {
            id: a,
            name: result.value,
            children: this.products.map((product) => ({
              id: product.id,
              product_name: product.productNumber,
              name: product.item,
              subtotal: product.subtotal,
              quantity: product.quantity,
              stock: product.stock,
              salesPrice: product.salesPrice,
            })),
            expanded: false,
          };
          this.list_of_pending.push(item);

          this.products = [];
          this.products_code = "";
          this.total = 0;
          this.cash = 0;
          this.change = 0;
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
      // let confirmation = confirm("Are you sure you want to pending the transaction?");
      // if (confirmation) {

      // }
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
        console.log(this.products);
        // this.products = [];
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
        // console.log(item)
        let void_items = [];
        void_items.push(item);
        axios
          .post(`https://pos-server-ktwz.vercel.app/void/api/addVoid`, void_items, {
            headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
          })
          .then(() => {
            let get_index = this.products.indexOf(item);
            this.products.splice(get_index, 1);
            // console.log( this.products.splice(get_index, 1))
            this.total = this.total - item.subtotal;
            this.products_code = "";
            this.cash = 0;
            this.change = 0;
          });
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
        let discounted_total = this.total * 0.2;
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
          .get(`https://pos-server-ktwz.vercel.app/inventory/api/getPerItem/${val}`, {
            headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
          })
          .then((res) => {
            let result_product = res.data[0];
            result_product.discounted = false;
            // Check if the product already exists in this.products based on its ID
            // this.ifdiscount = this.products.some(
            // (product) => product.discount_id == null
            // );
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
              // Check if the product has a discount
              if (result_product.discount_id && result_product.discount_value) {
                // Apply the discount to the sales price
                result_product.salesPrice -=
                  (result_product.salesPrice * result_product.discount_value) / 100;
                result_product.discounted = true;
              }
              result_product.subtotal =
                result_product.salesPrice * result_product.quantity; // Calculate subtotal
              result_product.editMode = false;

              this.products.push(result_product);
            }
            this.total = this.products.reduce(
              (acc, product) => acc + product.subtotal,
              0
            );
            for (const item of this.products) {
              if (item.discounted === true) {
                this.ifdiscount = true;
                break;
              }
            }
            this.products_code = "";

            for (const item of this.products) {
              if (item.discounted === true) {
                this.ifdiscount = true;
                break;
              }
            }
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
      axios
        .post(
          `https://pos-server-ktwz.vercel.app/inventory/api/updateInventoryStock`,
          this.products,
          {
           headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
          }
        )
        .then((res) => {
          console.log(res.data);
          axios
            .post(`https://pos-server-ktwz.vercel.app/sales/api/addSales`, this.products, {
              headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
            })
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
                  .post(`https://pos-server-ktwz.vercel.app/audit/api/addLogs`, audit_logs, {
                    headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
                  })
                  .then((res) => {
                    console.log(res.data);
                  });
              }
            });
          this.receipt_dialog = true;
          setTimeout(() => {
            this.generateBarcode();
          }, 500);
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
      }).then(() => {
        window.location.reload();
      });

      setTimeout(() => {
        // Save the original body content
        const originalContents = document.body.innerHTML;
        const originalOverflow = document.body.style.overflow;

        // Get the content of the receipt card
        const printContents = document.getElementById("receipt-card").innerHTML;

        // Create a new div for printing and apply fixed positioning
        const printDiv = document.createElement("div");
        printDiv.id = "printable-area";
        printDiv.innerHTML = printContents;
        printDiv.style.position = "fixed";
        printDiv.style.top = "0";
        printDiv.style.left = "0";
        printDiv.style.width = "100%";
        printDiv.style.height = "100%";
        printDiv.style.overflow = "visible";
        printDiv.style.zIndex = "10000";
        printDiv.style.backgroundColor = "white";

        // Temporarily hide the scrollbar
        document.body.style.overflow = "hidden";

        // Replace the body content with the receipt content
        document.body.innerHTML = "";
        document.body.appendChild(printDiv);

        // Apply styles to ensure proper print layout
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
      @media print {
        body {
          margin: 0;
          overflow: hidden !important; /* Hide scrollbar */
        }
       #printable-area {
    width: 57.5mm; /* Set paper width to 57.5mm */
    height: auto; /* Set height to the paper diameter */
    overflow: visible;
    background-color: white;
    margin: 0 auto; /* Center the content */
    padding: 0;
}
      }
    `;
        document.head.appendChild(style);

        // Print the receipt
        window.print();

        // Restore the original body content and overflow style after printing
        document.body.innerHTML = originalContents;
        document.body.style.overflow = originalOverflow;
        document.head.removeChild(style);
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
    getAllCategories() {
      // alert(this.authorization)
      // console.log( {
      //       'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
      //     })
      // console.log(secret_key(this.$store.state.storedEmp.token))
      // let token = 
      axios
        .get(`https://pos-server-ktwz.vercel.app/category/api/getCategory`, {
          headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.list_of_category = res.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          // Handle unauthorized error here (e.g., display message to user)
        });
    },
  },
  mounted() {
    this.fetchProducts();
    setTimeout(() => {
      this.getAllCategories();  
    }, 1000);
    this.authorization = secret_key(this.$store.state.storedEmp.token);
    console.log(this.apiUrl);
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
  body {
    overflow: hidden; /* Hide scrollbar */
  }
}
.scroll-container {
  max-height: 280px; /* Set maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  scrollbar-width: thin; /* Thin scrollbar */
  scrollbar-color: #555 transparent; /* Scrollbar color */
}

.scroll-container::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #555; /* Color of the scrollbar thumb */
  border-radius: 4px; /* Roundness of the thumb */
}

.scroll-container::-webkit-scrollbar-track {
  background-color: transparent; /* Background color of the scrollbar track */
}
.sizeFont {
  font-size: 15px;
}
</style>
