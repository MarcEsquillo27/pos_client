<template>
  <v-app>
    <v-navigation-drawer
      :style="this.$store.state.storedEmp.token ? '' : 'display:none'"
      v-model="navDrawer"
      app
    >
      <v-list>
        <v-list-item v-for="(item, index) in filteredNavList" :key="index" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout()" block color="error">
            Logout <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :style="this.$store.state.storedEmp.token ? '' : 'display:none'"
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="navDrawer = !navDrawer"></v-app-bar-nav-icon>
      {{ store_name }}
      <v-spacer/>
      Current Receipt Stock: {{ this.$store.state.printPaper }}
      <v-spacer/>
      <v-btn  color="success" @click="restock_reciept_dialog=true">Re-Stock Receipt</v-btn>
    </v-app-bar>
    <v-dialog v-model="restock_reciept_dialog" width="300">
      <v-card>
        <v-card-title>
          Re-Stock Receipt
        </v-card-title>
        <v-card-text>
          Current Receipt Stock: {{ this.$store.state.printPaper }}
          <br>
          <v-text-field v-model="receipt_stock" label="Enter Reciept Stock" outlined dense />
        <v-btn block color="success" @click="saveReceiptStock()">Save</v-btn>

        </v-card-text>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view />
     
    </v-main>
  </v-app>
</template>

<script>
import router from "@/router";
import Swal from "sweetalert2";
import getStore from "./functions/getStoreName"

// impoty axios from axios
export default {
  name: "App",
  data: () => ({
    id:0,
    receipt_stock:"",
    restock_reciept_dialog:false,
    navDrawer: false,
    navList: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard-variant-outline",
        to: "/dashboard",
      },
      { title: "Point of Sale", icon: "mdi-point-of-sale", to: "/pos" },
      { title: "PWD Logs", icon: "mdi-wheelchair", to: "/pwd" },
      { title: "Delivery Schedule", icon: "mdi-truck-delivery", to: "/delivery" },
      { title: "Inventories", icon: "mdi-format-list-checks", to: "/inventories" },
      { title: "Discount", icon: "mdi-sale", to: "/discount" },
      { title: "Return and Exchange", icon: "mdi-cash-refund", to: "/return" },
      { title: "Sale Report", icon: "mdi-cash", to: "/sales_report" },
      { title: "Category", icon: "mdi-archive", to: "/category" },
      { title: "Transaction Logs", icon: "mdi-list-box", to: "/audit_trail" },
      { title: "Void Logs", icon: "mdi-delete", to: "/void_logs" },
      { title: "Account Registration", icon: "mdi-account", to: "/account_register" },
      { title: "Settings", icon: "mdi-cog", to: "/settings" },
    ],
  }),
  computed: {
     
    filteredNavList() {
      let accesArray = null;

      if (this.$store.state.storedEmp && this.$store.state.storedEmp.userdetails) {
        accesArray = JSON.parse(this.$store.state.storedEmp.userdetails[0].access);
      }

      return accesArray
        ? this.navList.filter((item) => {
            const matchingAccessRight = accesArray.find((access) => {
              const linkMapping = {
                pos: "POS",
                pwd: "PWD",
                delivery: "Delivery",
                inventories: "Inventories",
                discount: "Discount",
                return: "Return and Exchange",
                sales_report: "Sale Report",
                category: "Category",
                audit_trail: "Transaction Logs",
                void_logs: "Void Logs",
                account_register: "Account Registration",
                settings: "Settings",
              };
              return linkMapping[item.to.replace("/", "")] === access.drawerLink;
            });
            return matchingAccessRight && matchingAccessRight.accessRights.read;
          })
        : [];
    },
  },

  methods: {
    getStoreDetails() {
     getStore.getStoreData(this.$store.state.storedEmp.token).then((res)=>{
      this.store_name = res.data[0].store_name
     })
    },
    
    saveReceiptStock(){
      this.$store.state.printPaper = this.$store.state.printPaper + parseInt(this.receipt_stock)

      getStore.getStore(this.$store.state.storedEmp.token,this.$store.state.printPaper)
        .then(() => {
          Swal.fire("Saved!", "", "success");
          this.restock_reciept_dialog = false
       
        });
      
   

    },
    logout() {
      // this.$store.commit("logout");
      localStorage.clear(); // Clear all data in local storage
      router.push({ name: "login" }); // Redirect to the login route
      location.reload(); // Reload the page before logout
    },
  },
  mounted(){
    this.getStoreDetails()
  },
};
</script>
