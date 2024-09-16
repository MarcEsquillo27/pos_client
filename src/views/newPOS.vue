<template>
  <div>
    <v-container fluid>
      <h1>Point of Sale <v-icon>mdi-point-of-sale</v-icon></h1> 
      Current SalesID: {{ nexSalesID  }}
      
     
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
                      <v-list-item-title>{{ items.item }}   <v-icon :style="items.discount_value ? '' : 'display:none'">
                        mdi-sale
                      </v-icon></v-list-item-title>
                      <v-list-item-subtitle
                      v-if="!items.editMode">{{ items.salesPrice }} x
                        {{ items.quantity }}
                      
                        </v-list-item-subtitle
                      >
                      <v-list-item-subtitle
                      v-else>
                      <v-text-field dense block type="number" v-model="items.quantity" />
                      <v-btn x-small color="success" @click="saveChanges(items)"
                        >Save</v-btn
                      >
                   
                        </v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text
                        ><h1>{{ items.subtotal }}</h1></v-list-item-action-text
                      >
                      <v-list-item-action-text
                        >
                        <v-icon small @click="toggleEditMode(items)" style="color: #5AB55E"
                          >mdi-pencil</v-icon
                        >
                        <v-icon small @click="toggleDelete(items)" style="color: #ff3333"
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
                    @click="discounted?openPwdDialog():pwd_dialog = false"
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
                  <v-btn
                 :disabled="cashpayment || epayment ? false : true"
                  class="mt-2" small
                  color="primary"
                  @click="delivery_dialog = true"
                  >For Delivery</v-btn
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
                  Subtotal: {{ subTotal() }}
                  <br />
                  Applied Discount:{{ appliedDiscount() }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <h1 style="float: right">Total: {{ totalDiscounted() }}</h1></v-col
                >
              </v-row>
                
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
                <v-col >
                  <v-text-field
                    outlined
                    rounded
                    clearable
                    color="primary"
                    dense
                    label="Search"
                    v-model="product_search"
                    @change="fetchProducts()"
                  />
                </v-col>
                <v-col>
                  <v-btn @click="searchItems()"><v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  xs="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  v-for="(items, index) in filterCategory"
                  :key="index"
                  :style="paperPrint == 0?'display: none;':''"
                >
                  <v-card elevation="10" @click="getProducts(items.productNumber)">
                    <v-card-title>
                      {{ items.item }}
                      <v-icon :style="items.discount_value ? '' : 'display:none'">
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
            >Void Transaction</v-btn
          >
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
              {{ totalDiscounted() }}
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
            
            rounded
            color="success"
            >Purchase</v-btn
          >

          <v-btn v-else disabled dense rounded color="success">Purchase</v-btn>
          <v-btn
            @click="voidTransaction()"
            dense
            
            rounded
            color="error"
            >Void Transaction</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- RECEIPT -->
    <v-dialog v-model="receipt_dialog" width="500">
      <v-card>
        <div style="overflow-y: hidden; padding: 60px; margin-top: 20px; margin-bottom: 20px;">
          <div id="receipt-card" style="width: 100%; margin-top: 20px; margin-bottom: 20px;">
            <div class="printable">
              <p style="text-align: center">
                <b>{{ store_name }}</b>
              </p>
              <p style="text-align: center">Receipt No: {{ nexSalesID }}</p>
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
                  <div style="text-align: end">Orignal Price</div>
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
                    <p>{{ item.subtotal}}</p>
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
                  <div>{{ totalDiscounted() }} PHP</div>
                </li>

                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0 0 5px 0;
                  "
                >
                  <div>20% Discount:</div>
                  <div>{{ discounted?'YES':'NO' }}</div>
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
            :min="minDate"
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
<!-- PENDING DIALOG -->
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
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="item.expanded">
                    {{ item.children }}
                    <v-data-table
                      :headers="headers"
                      :items="item.children"
                      :items-per-page="5"
                      class="elevation-1"
                    ></v-data-table>
                    <br />
                    <v-btn
                      @click="backTransaction(item, i)"
                      style="float: right"
                      small
                      color="primary"
                      >Add to POS</v-btn
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <!-- <v-col><v-btn @click="backTransaction(items,index)">{{pendingID( items[0].date) }}</v-btn></v-col> -->
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG FOR PWD -->
    <v-dialog v-model="pwd_dialog" width="500">
      <v-card id="my-card">
        <v-card-title>PWD Details</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="pwd_details.pwd_id"
            outlined
            rounded
            dense
            block
            label="ID Number"
          ></v-text-field>
          <v-text-field
            v-model="pwd_details.last_name"
            outlined
            rounded
            dense
            block
            label="Last Name"
          ></v-text-field>
          <v-text-field
            rounded
            dense
            block
            v-model="pwd_details.first_name"
            label="First Name"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="pwd_details.middle_name"
            label="M.I"
            outlined
            rounded
            dense
          ></v-text-field>
            <!-- BIRTHDATE -->

            <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
          rounded
            v-model="birth_date"
            label="Birth Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            @change="getAge()"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="birth_date"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
      <h2>Age:{{ getAge() }}</h2>
      <br>
          <v-select
          v-model="pwd_details.sex"
          outlined
          dense
          rounded
          :items="['Male','Female']"
          />
        
          <v-btn dense rounded block color="success" @click="savePwdDetails(pwd_details)">Save</v-btn>
          <v-btn
            class="mt-2"
            dense
            rounded
            block
            color="error"
            @click="pwd_dialog = false"
            >Cancel</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";
import JsBarcode from "jsbarcode";
import secret_key from "../plugins/md5decrypt";
import Inventory from "../functions/Inventory"
import Pending from "../functions/Pending"
import Delivery from "../functions/Delivery"
import Void from "../functions/Void"
import Sales from "../functions/Sales"
import Audits from "../functions/Audit"
import getStore from "../functions/getStoreName"
import Category from "../functions/Category"
import PWD from "../functions/Pwd"
// import printJS from "print-js";
export default {
  data: () => {
    return {
      minDate: new Date().toISOString().substr(0, 10) ,
      birth_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      pwd_details:{},
      pwd_dialog:false,
      applied_discount:0,
      orginal_price:0,
      store_name:"",
      nexSalesID:"",
      paperPrint: 0,  
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
      togle_pending:[],
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
  watch: {
    currentPage() {
      this.fetchProducts();
    },
  },
  computed: {
    filteredPendingTransactions() {
      if (!this.search) return this.togle_pending;
      const searchTerm = this.search.toLowerCase();
      return this.togle_pending.filter((item) => {
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
    // searchProducts() {
    //   let productArr = this.filterCategory;
    //   return productArr.filter((item) => {
    //     // Convert both item name and product number to lowercase for case-insensitive search
    //     const itemName = item.item.toLowerCase();
    //     const productNumber = item.productNumber.toLowerCase();

    //     // Check if either item name or product number contains the search query
    //     return (
    //       itemName.includes(this.product_search.toLowerCase()) ||
    //       productNumber.includes(this.product_search.toLowerCase())
    //     );
    //   });
    // },
  },
  methods: {
    async initializeApp() {
    await this.getLatestSalesID();
    await this.fetchProducts();
    await this.fetchPending();
    await new Promise(resolve => setTimeout(() => {
      this.getAllCategories();
      resolve();
    }, 1000));
    this.authorization = secret_key(this.$store.state.storedEmp.token);
    this.paperPrint = this.$store.state.printPaper;
  },
  savePwdDetails(val){
    // console.log(val)
    val.sales_id = this.nexSalesID
    val.date = moment().format("YYYY-MM-DD HH:mm:ss")
    PWD.addPwd(this.$store.state.storedEmp.token,val).then(()=>{
      Swal.fire({
        title: "Saved",
        icon: "success",
        timer: 2000,
      })
      this.pwd_dialog = false
    })
  },
  getAge(){
    const today = moment();
    const birth = moment(this.birth_date); 
    let ageToday = today.diff(birth, 'years') ;
    this.pwd_details.birth_date = this.birth_date
    this.pwd_details.age = ageToday
    return ageToday ; 
  },
  openPwdDialog(){
    this.pwd_dialog = true
    this.pwd_details = {}
    this.birth_date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
  },
  searchItems(){
    if(!this.product_search){
      alert('Please enter some text in the text field.')
      return false
    }
    Inventory.fetchPerProduct(this.$store.state.storedEmp.token,this.product_search).then((res)=>{
        const data = res.data;
          this.list_of_products = data.filter((rec) => {
            if (rec.stock > 0) {
              if (rec.discount_id !== null) {
                rec.salesPrice -= (rec.salesPrice * rec.discount_value) / 100;
              }
              return rec;
            }
          });
          this.list_of_products;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
  },
    generateBarcode() {
      if (this.salesInvoice) {
        JsBarcode("#barcode", this.nexSalesID, {
          format: "CODE128",
          displayValue: true,
          height: 30,
          fontSize: 12,
        });
      }
    },
    fetchProducts() {
      Inventory.fetchProducts(this.$store.state.storedEmp.token,this.currentPage,this.itemsPerPage).then((response) => {
          const data = response.data;
          this.list_of_products = data.products.filter((rec) => {
            if (rec.stock > 0) {
              if (rec.discount_id !== null) {
                rec.salesPrice -= (rec.salesPrice * rec.discount_value) / 100;
              }
              return rec;
            }
          });
          this.totalPages = Math.ceil(data.totalItems / this.itemsPerPage);
          this.list_of_products;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    fetchPending() {
      Pending.fetchPending(this.$store.state.storedEmp.token)
        .then((res) => {
          this.list_of_pending = res.data;

          // Parse the 'children' field
          this.list_of_pending.forEach((item) => {
            item.children = JSON.parse(item.children);
            item.expanded = item.expanded === 1 ? true : false;
          });
          this.togle_pending = this.list_of_pending;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
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
      });
    },
    backTransaction(val, index) {
      if(this.products.length >=1){
        alert("There is on going transaction")
        return false
      }
      let confirmation = confirm("Are you sure you want to continue the transaction?");
      if (confirmation) {
        this.products = val.children;
        this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
        this.list_of_pending.splice(index, 1);
        this.pending_dialog = false;
        Pending.deletePending(this.$store.state.storedEmp.token,val.id)
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
              item: product.item,
              subtotal: product.subtotal,
              quantity: product.quantity,
              stock: product.stock,
              salesPrice: product.salesPrice,
              discount_value:product.discount_value
            })),
            expanded: false,
          };
          Pending.addPending(this.$store.state.storedEmp.token,item)
         
          this.list_of_pending.push(item);
           this.list_of_pending.forEach((item) => {
            item.expanded = item.expanded === 1 ? true : false;
          });
          this.togle_pending = this.list_of_pending;
          
          this.products = [];
          this.products_code = "";
          this.total = 0;
          this.cash = 0;
          this.change = 0;
          Swal.fire("Saved!", "", "success");
          // window.location.reload()
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
        salesID: this.nexSalesID,
        name: this.contact_name,
        address: this.address,
        contact: this.contact_details,
        shipment_date: this.selectedDate,
        shipment_time: this.selectedTime,
        transaction_by: this.$store.state.storedEmp.userdetails[0].fullname
      };
      // this.deliveryArr.push(get_details);
    Delivery.addDelivery(this.$store.state.storedEmp.token,get_details)
     
      alert("Save Succesfully");
      this.delivery_dialog = false;
    },
    voidItem() {
      let confirmation = confirm("Are you sure you want to void the transaction?");
      if (confirmation) {
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
        let void_items = [];
        void_items.push(item);
        Void.addVoid(this.$store.state.storedEmp.token,void_items).then(() => {
            
            let get_index = this.products.indexOf(item);
        

            this.products.splice(get_index, 1);
            for (const item of this.products) {
              if (item.discounted === true) {
                this.ifdiscount = true;
                break;
              }
              else{
                this.ifdiscount = false;
                break;
              }
            }
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
   
    //Total Discount Apply
    appliedDiscount(){
return this.applied_discount.toFixed(2)
    },
    //TOTAL SUB
    subTotal(){
      return this.orginal_price.toFixed(2);
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
      this.change = this.cash - this.totalDiscounted();
      if (this.change <= 0) {
        return 0;
      } else {
        let totalChange = this.cash - this.totalDiscounted()
        return totalChange.toFixed(2);
      }
    },
    //ALL GET DATA
    getProducts(val) {
      if (val) {
        Inventory.fetchPerProduct(this.$store.state.storedEmp.token,val)
          .then((res) => {
            let result_product = res.data[0];
            console.log(result_product,"1031")
            result_product.discounted = false;
            // Check if the product already exists in this.products based on its ID
            // this.ifdiscount = this.products.some(
            // (product) => product.discount_id == null
            // );
            this.orginal_price += result_product.salesPrice
              console.log(this.orginal_price)
            this.applied_discount += (result_product.salesPrice * result_product.discount_value) / 100;
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
              result_product.salesID = this.nexSalesID
              result_product.transaction_by = this.$store.state.storedEmp.userdetails[0].fullname
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
    voidTransaction(){
      let confirmation = confirm("Are you sure you want to Void the transaction?");
      if (confirmation) {
        // let void_items = [];
      Void.addVoid(this.$store.state.storedEmp.token,this.products,).then(()=>{
        Swal.fire({
  title: "Transaction Void",
  icon: "success"
});
        this.products = []
        this.total = 0;
            this.products_code = "";
            this.cash = 0;
            this.change = 0;
            this.cash_dialog = false;
            this.epayment_dialog = false;
            this.cashpayment = false;
            this.epayment =false;


      })

      }
      // this.products =
      // Void.addVoid(this.$store.state.storedEmp.token,void_items)
    },
    purchase() {
      console.log(this.products,"1113")
      Inventory.updateProduct(this.$store.state.storedEmp.token,this.products)
        .then(() => {
          Sales.AddSales(this.$store.state.storedEmp.token,this.$store.state.storedEmp.userdetails[0].fullname,this.epayment,this.cashpayment,this.products,this.nexSalesID)
            .then((res) => {
              this.salesInvoice = res.data[0];
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
                  transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
                };
                Audits.AddLogs(this.$store.state.storedEmp.token,audit_logs)
                
              }
            });
          this.receipt_dialog = true;
          getStore.getStoreData(this.$store.state.storedEmp.token).then((res)=>{
      this.store_name = res.data[0].store_name
     })
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

      // this.printPaper = this.printPaper - 1
     let paperPrint = this.$store.state.printPaper - 1
     getStore.updateReciept(this.$store.state.storedEmp.token,paperPrint)
     this.$store.commit("STORE_PAPER", paperPrint);

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
 
      Category.getCategory(this.$store.state.storedEmp.token)
        .then((res) => {
          this.list_of_category = res.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          // Handle unauthorized error here (e.g., display message to user)
        });
    },
    getLatestSalesID(){
      Sales.getLatestSalesID(this.$store.state.storedEmp.token)
        .then((res) => {
          this.nexSalesID = res.data[0].predicted_next_id
          // this.list_of_category = res.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          // Handle unauthorized error here (e.g., display message to user)
        });
    }
  },
  created(){
    if(this.$store.state.printPaper  <= 100){
      alert(`${this.$store.state.printPaper} PIECES LEFT PLEASE RESTOCK RECIEPT`)
    }
    else if (this.$store.state.printPaper  == 0){
      alert("NO RECEIPT LEFT")    
    }
  },      
  mounted() {
   this.initializeApp()
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
