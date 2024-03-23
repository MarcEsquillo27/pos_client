<template>
  <div>
    <v-container fluid>
      <h1>Return and Exchange<v-icon>mdi-cash-refund</v-icon></h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field outlined rounded color="primary" dense label="Search" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-simple-table class="border" dense>
                <thead>
                  <tr>
                    <th v-for="(items, index) in headers" :key="index">
                      {{ items.text }}
                    </th>
                    <th colspan="2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(items, index) in all_products" :key="index">
                    <td>{{ items.salesID }}</td>
                    <td>{{ items.item_count }}</td>
                    <td>{{ items.total_sum }}</td>
                    <!-- <td v-if="!items.editMode">
                      <v-icon color="primary" @click="toggleEditMode(items)"
                        >mdi-pencil</v-icon
                      >
                    </td>
                    <td v-else>
                      <v-icon color="primary" @click="items.editMode = false"
                        >mdi-close</v-icon
                      >
                    </td> -->
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="error"
                            v-bind="attrs"
                            v-on="on"
                            @click="returnItems(items)"
                            >mdi-cash-refund</v-icon
                          >
                        </template>
                        <span>Return Items</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- DIALOG FOR RETURN ITEMS -->
    <v-dialog v-model="return_dialog" width="40%">
      <v-card>
        <v-card-title> Return Item </v-card-title>
        <v-card-text>
          <v-simple-table class="border">
            <thead>
              <tr>
                <th v-for="(items, index) in headers_products" :key="index">
                  {{ items.text }}
                </th>
                <th colspan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items, index) in saled_items" :key="index">
                <td>{{ items.item }}</td>
                <td>{{ items.salesPrice }}</td>
                <td v-if="!items.editModeReturn">{{ items.quantity }}</td>
                <td v-else>
                  <v-text-field dense block type="number" v-model="items.quantity" />
                  <v-btn x-small color="success" @click="saveChanges(items)">Save</v-btn>
                </td>
                <td>{{ items.total }}</td>
                <td v-if="!items.editModeReturn">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="success"
                        v-bind="attrs"
                        v-on="on"
                        @click="items.editModeReturn = true"
                        >mdi-pencil</v-icon
                      >
                    </template>
                    <span>Edit Quantity</span>
                  </v-tooltip>
                </td>
                <td v-else>
                  <v-icon color="success" @click="items.editModeReturn = false"
                    >mdi-close</v-icon
                  >
                </td>

                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="error"
                        @click="toggleDelete(items)"
                        >mdi-cash-refund</v-icon
                      >
                    </template>
                    <span>Refund Item</span>
                  </v-tooltip>
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                        @click="toggleExchange(items)"
                        >mdi-archive-refresh</v-icon
                      >
                    </template>
                    <span>Exchange Item</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG FOR EXCHANGE ITEM -->
    <v-dialog v-model="exchange_dialog">
      <v-card>
      
          <Exchange />
       
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Exchange from "../components/ExchangeDialog.vue"
export default {
     components: {
        Exchange,
    },
  data: () => {
    return {
      editModeReturn: false,
      return_dialog: false,
      showDatePicker: false,
      exchange_dialog: false,
      from_date: null,
      all_products: [],
      saled_items: [],
      menu: false,
      date: "",
      headers: [
        { text: "Sale Invoice Number", value: "salesID" },
        { text: "Total Products ", value: "item_count" },
        { text: "Total Price", value: "total_sum" },
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
    toggleExchange() {
      this.exchange_dialog = true;
    },
    getAllProducts() {
      axios.get("https://pos-server-ktwz.vercel.app/sales/api/getSales").then((res) => {
        console.log(res.data);
        this.all_products = res.data;
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
      axios.post("https://pos-server-ktwz.vercel.app/sales/api/updateSales", item);
      axios.post("https://pos-server-ktwz.vercel.app/sales/api/updateInventoryStock", item);
      // .then((res)=>{

      // })
    },
    returnItems(val) {
      axios
        .get(`https://pos-server-ktwz.vercel.app/sales/api/getbySalesId/${val.salesID}`)
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
