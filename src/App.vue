<template>
  <v-app>
    <!-- 
    :style="this.$store.state.storedEmp.token ? '' : 'display:none'" 

     -->
    <v-navigation-drawer
      
      v-model="navDrawer"
      app
    >
      <v-list>
        <v-list-item v-for="(item, index) in navList" :key="index" :to="item.to">
          
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout()" block color="error">
            Logout <v-icon>mdi-logout</v-icon></v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <!-- 
      :style="this.$store.state.storedEmp.token.length ? '' : 'display:none'"

     -->
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="navDrawer = !navDrawer"></v-app-bar-nav-icon>

      <!-- {{ this.$store.state.storedEmp.userdetails[0].username }} -->
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    navDrawer: false,
    navList: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard-variant-outline",
        to: "/dashboard",
      },
      { title: "Point of Sale", icon: "mdi-point-of-sale", to: "/pos" },
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
    methods: {
      logout() {
        this.$store.commit("logout");
      },
    },
  }),
};
</script>
