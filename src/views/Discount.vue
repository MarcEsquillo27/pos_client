<template>
  <div>
    <v-container fluid>
      <h1>Discount</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn @click="openDialog()" rounded color="primary" dense
            >Add Item Discount</v-btn
          >
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>
         <v-row justify="center" >
        <v-col cols="12" md="4" v-for="(items, index) in all_products" :key="index">
          <v-card elevation-24 @click="tableDiscount(items.id)">
           
            <v-card-title class="justify-center"
              >{{items.discount_name}} <v-icon style="color: black">mdi-sale</v-icon></v-card-title
            >
          </v-card></v-col
        >
      </v-row>
  <!-- DISCOUNT LIST -->
  <v-dialog v-model="list_dialog" fullscreen round>
    <v-card>
      <v-card-title style="background-color: #1976d2; color:white;">
        Item Discounted
        <v-spacer></v-spacer>
        <v-icon style="color:white;" @click="closeDialog()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <br>
       <ItemLisDiscountDialog :list_of_discount_items="list_of_discount_items" :value="discount_price"/>
      </v-card-text>
     
    </v-card>

  </v-dialog>
      <!-- ADD NEW DISCOUNT -->
      <v-dialog v-model="add_dialog" width="40%">
        <v-card>
          <v-card-title> Add Discount </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="insertItem.discount_name"
              label="Discount Name"
              outlined
              dense
            />
            <v-text-field
              v-model="insertItem.discount_value"
              type="number"
              label="Discount Value"
              outlined
              dense
            />
            <v-btn
              class="mt-1"
              :style="!addButton ? 'display:none;' : ''"
              @click="insertDiscount(insertItem)"
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
import Swal from "sweetalert2";
import ItemLisDiscountDialog from "../components/ItemLisDiscountDialog.vue"
export default {
   components: {
        ItemLisDiscountDialog
    },
  data: () => {
    return {
      menu2: false,
      date2: moment().format("YYYY-MM-DD"),
      addButton: false,
      add_dialog_item:false,
      editButton: false,
      add_dialog: false,
      list_dialog:false,
      insert_item:false,
      showDatePicker: false,
      from_date: null,
      discount_price:null,
      all_products: [],
      list_of_discount_items:[],
      list_of_products: [],
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
        { text: "Description ", value: "description" },
        { text: "Stock", value: "stock" },
        { text: "Discount", value: "discount" },
        { text: "Sales Price", value: "salesPrice" },
        { text: "Date Start", value: "date" },
        { text: "Date End", value: "date" },
      ],
    };
  },
  computed: {
 
  },
  methods: {
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
    getAllProductsDiscounted() {
      axios.get("https://pos-server-ktwz.vercel.app/discount/api/getDiscountItem").then((res) => {
        console.log(res.data)
        // this.list_of_products = [];
        this.list_of_discount_items = res.data.filter((rec)=>{
            if(rec.discount_id == this.discount_price){
                return rec
            }
        });
        console.log(this.list_of_discount_items)
      });
    },
    getAllProducts() {
      axios.get("https://pos-server-ktwz.vercel.app/discount/api/getDiscount").then((res) => {
        this.all_products = res.data;
        this.list_of_products = res.data;
      });
    },
    updateInventory(val) {
      val.date = moment(val.date).format("YYYY-MM-DD hh:ss:mm");
      axios
        .post("https://pos-server-ktwz.vercel.app/inventory/api/updateInventory", val)
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
          };
          axios.post("https://pos-server-ktwz.vercel.app/audit/api/addLogs", audit_logs);
        })
        .catch((err) => {
          alert(err);
        });
    },
    insertDiscount() {
      let add_data = this.insertItem;
      axios
        .post("https://pos-server-ktwz.vercel.app/discount/api/addDiscount", add_data)
        .then(() => {
          this.all_products.push(this.insertItem);
          Swal.fire({
            title: "New Discount Added",
            icon: "success",
            timer: 1500
          });
          this.add_dialog = false;

          let audit_logs = {
            action: `Added New Discount`,
            description: `NEW Discount: ${this.insertItem.discount_name}`,
            product_number: this.insertItem.discount_name,
            quantity: 1,
            drawer_link: `Discount`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
          };
          axios.post("https://pos-server-ktwz.vercel.app/audit/api/addLogs", audit_logs);
        })
        .catch((err) => {
          alert(err);
        });
    },
    tableDiscount(val){
      this.list_dialog=true
      this.insert_item=true
      this.discount_price=val
      this.getAllProductsDiscounted()
    },
    addDialog(){
      this.add_dialog_item=true;
    },
    closeDialog(){
      this.list_dialog = false
      this.list_of_discount_items = []
    }
    
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
