<template>
    <v-card>
            <v-card-title> Add Discount</v-card-title>
            <v-card-text>
                <v-autocomplete
            outlined
            clearable
            color="primary"
            dense
            label="Category"
            :items="list_of_category"
            :item-text="
              (elem) => {
                return elem.categoryName;
              }
            "
            item-value="categoryID"
            v-model="category_id"
            @change="filterItemByCategory()"
          />
                <v-autocomplete
            outlined
            clearable
            color="primary"
            dense
            label="Product"
            :items="filter_of_products"
            :item-text="
              (elem) => {
                return elem.productNumber + ' : ' + elem.item;
              }
            "
            item-value="productNumber"
            v-model="toUpdate.productNumber"
          />
              <!-- <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date2"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date2"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
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
            v-model="date2"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date2"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu> -->
              <v-btn
                class="mt-1"
                
                @click="insertInventory(toUpdate)"
                color="success"
                block
              >
                SAVE
              </v-btn>
              <!-- <v-btn
                class="mt-1"
                :style="!editButton ? 'display:none;' : ''"
                @click="updateInventory(insertItem)"
                color="success"
                block
              >
                UPDATE
              </v-btn> -->
            </v-card-text>
          </v-card>
</template>

<script>
import axios from "axios"
import moment from "moment"
import Swal from "sweetalert2";
import Inventory from "../functions/Inventory"
import secret_key from "../plugins/md5decrypt";
import Category from "../functions/Category"

export default {
    props:["insert_item","discount_price"],
 data: () => {
    return {
      category_id:"",
      menu2: false,
      apiUrl: process.env.VUE_APP_API_URL,
      products_code:"",
      date2: moment().format("YYYY-MM-DD"),
      addButton: false,
      add_dialog_item:false,
      editButton: false,
      add_dialog: false,
      list_dialog:false,
      toUpdate:{},
      showDatePicker: false,
      from_date: null,
      all_products: [],
      list_of_products: [],
      filter_of_products:[],
      list_of_category:[],
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
  methods:{
    filterItemByCategory(){
      if(this.category_id === null){
       this.filter_of_products = [...this.list_of_products]
       console.log(this.filter_of_products,"157")
      }
      else{
         this.filter_of_products =  this.filter_of_products.filter((rec)=>{
        if (rec.categoryID == this.category_id){
            return rec
        }
       })  
      }
    },
    getAllCategory(){
      Category.getCategory(this.$store.state.storedEmp.token).then((res)=>{
        this.list_of_category = res.data.map((rec)=> rec)
      })
    },
     getAllProducts() {
      Inventory.getAllProducts(this.$store.state.storedEmp.token).then((res) => {
        console.log(res.data)
        this.list_of_products = res.data;
        this.filter_of_products = res.data
      });
    },
    insertInventory(val){
      if(!this.toUpdate.productNumber){
        Swal.fire("Please complete the details", "", "error");
        return false
      }
        val.discount_id = this.discount_price
 axios
        .post(`${this.apiUrl}/inventory/api/updateInventory`, val,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
        .then(() => {
          // this.all_products.push(this.insertItem);
          Swal.fire({
            title: "Item Discounted",
            icon: "success",
            timer: 1500
          });
        //   this.add_dialog = false;
          let audit_logs = {
            action: `Discounted Item`,
            description: `Discounted Item: ${val.productNumber}`,
            product_number: val.productNumber,
            quantity: 1,
            drawer_link: `Discount`,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
          };
          axios.post(`${this.apiUrl}/audit/api/addLogs`, audit_logs,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then(()=>{
            location.reload()
          });
        })
        .catch((err) => {
          alert(err);
        });
    }
  },
  mounted(){
    
    this.getAllProducts()
    this.getAllCategory()
  }
}
</script>

<style>

</style>