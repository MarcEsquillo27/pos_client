<template>
  <div>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-btn :style="hasAccess('Discount','add')?'':'display:none;'" @click="addDialog()" rounded color="primary" dense
            >Add Item</v-btn
          >
          <!-- <v-btn rounded color="success" dense>Data Extraction</v-btn> -->
        </v-col>
      </v-row>
         <v-simple-table class="border">
              <thead>
                <tr style="background-color: #1976d2">
                  <th style="color: white" v-for="(items, index) in headers" :key="index">
                    {{ items.text }}
                  </th>
                  <th style="color: white" colspan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :style="
                    items.stock == 0
                      ? 'background-color:#FFBB64;'
                      : items.stock <= 5
                      ? 'background-color:#CE4257;color:white;'
                      : ''
                  "
                  v-for="(items, index) in list_of_discount_items"
                  :key="index"
                >
                  <td>{{ items.productNumber }}</td>
                  <td>{{ items.item }}</td>
                  <td>{{ items.description }}</td>
                  <td>
                    <span :class="items.stock == 0 ? 'blink' : ''">{{
                      items.stock == 0 ? "OUT OF STOCK" : items.stock
                    }}</span>
                  </td>
                  <td>{{ items.discount_value }}%</td>
                  <td>
                    <v-icon :style="hasAccess('Discount','delete')?'':'display:none;'" color="error" @click="removeDiscount(items)"
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
             <v-dialog v-model="add_dialog_item" width="300">
        <v-card>
         <ItemDiscountDialog :discount_price="value" :insert_item="insert_item"/>
        </v-card>
      </v-dialog>
  </div>
  
</template>

<script>
import ItemDiscountDialog from "../components/ItemDiscountDialog.vue";
import axios from "axios"
import moment from "moment";
import Swal from "sweetalert2";
import secret_key from "../plugins/md5decrypt";
export default {
  props: {
    list_of_discount_items: {
            type: Array,
        },
        value:{
          type:Number
        },
    },
    // props:["value","list_of_discount_items"],
   components: {
        ItemDiscountDialog
    },
  data: () => {
    return {
    apiUrl: process.env.VUE_APP_API_URL,
    add_dialog_item:false,
    insert_item:false,
    // list_of_products:[],
      
      headers: [
        { text: "Product Number", value: "productNumber" },
        { text: "Item", value: "item" },
        { text: "Description ", value: "description" },
        { text: "Stock", value: "stock" },
        { text: "Discount", value: "discount" },
      ],
    };
  },
  computed: {
 
  },
  methods: {
    removeDiscount(val){
      let toUpdate = {
        discount_id: null,
        productNumber:val.productNumber,
        item:val.item
      }
 axios
        .post(`${this.apiUrl}/inventory/api/updateInventory`, toUpdate,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
        .then(() => {
          // this.all_products.push(this.insertItem);
          Swal.fire({
            title: "Item Remove",
            icon: "Info",
            timer: 1500
          });
          this.add_dialog = false;
          let audit_logs = {
            action: `Remove Discount Item`,
            description: `Remove Discount Item: ${val.productNumber}`,
            product_number: val.productNumber,
            quantity: 0,
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
    },
    tableDiscount(){
      this.list_dialog=true
      this.insert_item=true
    },
    addDialog(){
      this.add_dialog_item = true;
    },
     
    
  },
  mounted() {
    console.log('list_of_discount_items in child component:', this.list_of_discount_items);
  },
};
</script>

<style>

</style>