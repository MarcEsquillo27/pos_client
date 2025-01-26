<template>
  <div>
    <v-container fluid>
      <h1>Discount</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn :style="hasAccess('Discount','add')?'':'display:none;'" @click="openDialog()" rounded color="primary" dense
            > New Discount/Promo</v-btn
          >
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>
         <v-row justify="center" >
          <div v-if="searchFunction.length === 0">
  No Discount available.
</div>
  <v-col  cols="12" md="4" v-for="(items, index) in searchFunction" :key="index">
          <v-card elevation-24 @click="tableDiscount(items.id)">
           
            <v-card-title class="justify-center"
              >{{items.discount_name}} 
              <v-icon style="color: black">mdi-sale</v-icon>

              </v-card-title
            >
          </v-card>
          <v-btn x-small color="primary" xs dark @click="EditDiscount(items)">edit</v-btn>
          <v-btn x-small color="error" xs dark @click="DeleteDiscount(items)">delete</v-btn>
          <v-btn v-if="items.status == 1" x-small color="primary" xs dark @click="Active(items)">Active</v-btn>
          <v-btn v-else x-small color="warning" xs dark @click="Deactivate(items)">Deactive</v-btn>

          </v-col
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
          <v-card-title> {{ editButton?"Edit":"Add"}} Discount </v-card-title>
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
              @click="updateDiscount(insertItem)"
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
import Swal from "sweetalert2";
import ItemLisDiscountDialog from "../components/ItemLisDiscountDialog.vue"
import Discount from "../functions/Discount"
import Audit from "../functions/Audit"
import secret_key from "../plugins/md5decrypt";
export default {
   components: {
        ItemLisDiscountDialog
    },
  data: () => {
    return {
      search:"",
      apiUrl: process.env.VUE_APP_API_URL,
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
      insertItem: {},
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
    searchFunction() {
    if (!this.search) {
      return this.all_products;
    }
    return this.all_products.filter((item) =>
      item.discount_name.toUpperCase().includes(this.search.toUpperCase())
    );
  }
  },

  methods: {
    Deactivate(val){
       Swal.fire({
        title: "Are you sure?",
        text: "you want to Deactivate Discount?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Deactivate it!",
      }).then((result) => {
         if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "The Discount has been Deactivate.",
            icon: "success",
          });
        Discount.deactivateSatusDiscount(this.$store.state.storedEmp.token,val).then(()=>{
            location.reload()
        })

         }
      })
    },
    Active(val){
       Swal.fire({
        title: "Are you sure?",
        text: "you want to Activate Discount?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Activate it!",
      }).then((result) => {
         if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "The Discount has been Activate.",
            icon: "success",
          });
        Discount.activateSatusDiscount(this.$store.state.storedEmp.token,val).then(()=>{
            location.reload()
        })

         }
      })
    },
    DeleteDiscount(val){
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
            text: "The Discount has been deleted.",
            icon: "success",
          });
        Discount.deleteDiscount(this.$store.state.storedEmp.token,val).then(()=>{
            location.reload()
        })

         }
      })
    },
    EditDiscount(val){
      console.log(val)
      this.add_dialog = true;
      this.addButton = false;
      this.editButton = true;
      this.insertItem = val

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
    getAllProductsDiscounted() {
      axios.get(`${this.apiUrl}/discount/api/getDiscountItem`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res) => {
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
      axios.get(`${this.apiUrl}/discount/api/getDiscount`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res) => {
        this.all_products = res.data;
        this.list_of_products = res.data;
      });
    },
    updateDiscount(val) {
       if(this.insertItem.discount_value > 100){
           Swal.fire("1 to 100 value only", "", "error");
        return false
      }
      // val.date = moment(val.date).format("YYYY-MM-DD hh:ss:mm");
      Discount.updateDiscount(this.$store.state.storedEmp.token,val)
        .then(() => {
          // this.all_products.push(this.insertItem);
          alert("ITEM UPDATED");
          this.add_dialog = false;
          let audit_logs = {
            action: `Update Item`,
            description: `Update Discount: ${val.discount_name}`,
            product_number: val.id,
            quantity: 0,
            drawer_link: `Discount`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
         Audit.AddLogs(this.$store.state.storedEmp.token,audit_logs);
        })
        .catch((err) => {
          alert(err);
        });
    },
    insertDiscount() {
      if(this.insertItem.discount_value > 100){
           Swal.fire("1 to 100 value only", "", "error");
        return false
      }
      if(!this.insertItem.discount_value || !this.insertItem.discount_name){
        Swal.fire("Please complete the details", "", "error");
        return false
      }
      let add_data = this.insertItem;
      axios
        .post(`${this.apiUrl}/discount/api/addDiscount`, add_data,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
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
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
          axios.post(`${this.apiUrl}/audit/api/addLogs`, audit_logs,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      });
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
