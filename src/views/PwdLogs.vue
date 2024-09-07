<template>
    <div>
      <v-container fluid>
        <h1>PWD Logs<v-icon>mdi-wheelchair</v-icon></h1>
        <v-row>
          <v-col cols="6" sm="6">
            <v-text-field outlined rounded color="primary" dense label="Search" />
          </v-col>
          <v-col>
            <!-- FROM DATE -->
            <v-menu
              ref="menu"
              v-model="first_date_menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="first_date"
                  label="From Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  dense
                  rounded
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="first_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <!-- TO DATE -->
            <v-menu
              ref="menu"
              v-model="second_date_menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="second_date"
                  label="To Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  dense
                  rounded
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="second_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-btn @click="filterDate()" color="primary"> Filter Date </v-btn>
          </v-col>
          <!-- <v-col>
              <v-btn @click="extractionData()" color="success">
               <v-icon>mdi-microsoft-excel</v-icon> Extract Data
              </v-btn>
            </v-col> -->
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="all_products"
                  item-key="salesID"
                  dense
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>Products</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <!-- Add any additional toolbar items here -->
                    </v-toolbar>
                  </template>
  
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.sales_id }}</td>
                      <td>{{ item.pwd_id }}</td>
                      <td>{{ item.last_name }}</td>
                      <td>{{ item.first_name }}</td>
                      <td>{{ item.middle_name }}</td>
                      <td>{{ dateDefault(item.birth_date) }}</td>
                      <td>{{ item.age }}</td>
                      <td>{{ item.sex }}</td>
                      <td>{{ dateDefault(item.date) }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
 
    </div>
  </template>
  
  <script>
  import moment from "moment";
  import PWD from "../functions/Pwd.js"
  
  // import _ from "lodash"
  export default {
    data: () => {
      return {
        apiUrl: process.env.VUE_APP_API_URL,
  
        sales_extracted: [],
        editModeReturn: false,
        return_dialog: false,
        showDatePicker: false,
        from_date: null,
        all_products: [],
        saled_items: [],
        first_date_menu: false,
        second_date_menu: false,
        first_date: moment().subtract(1, "month").format("YYYY-MM-DD"),
        second_date: moment().format("YYYY-MM-DD"),
        headers: [
          { text: "Sales ID", value: "	sales_id" },
          { text: "PWD ID Number", value: "pwd_id" },
          { text: "Last Name", value: "last_name" },
          { text: "First Name", value: "first_name" },
          { text: "Middle Name", value: "middle_name" },
          { text: "Date of Birth", value: "birth_date" },
          { text: "Age", value: "age" },
          { text: "Sex", value: "sex" },
          { text: "Date", value: "date" },
          ],
      };
    },
    methods: {
      dateDefault(val) {
        return moment(val).format("YYYY-MM-DD hh:mm:ss");
      },
      filterDate() {
        this.getAllProducts();
      },
     
  
  
  
      getAllProducts() {
        PWD.getPwd(this.$store.state.storedEmp.token,this.first_date,this.second_date)
          .then((res) => {
            console.log(res.data)
            this.all_products = res.data;
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
  </style>
  