<template>
  <div>
    <v-container fluid>
      <h1>Delivery Schedule<v-icon>mdi-truck-delivery</v-icon></h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field
            v-model="search"
            outlined
            rounded
            clearable
            color="primary"
            dense
            label="Search Sales ID"
            @click:clear="clearSearch"
          />
        </v-col>
        <v-col>
          <v-btn color="primary" @click="searchDelivery">Search</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-simple-table>
            <thead>
              <tr style="background-color: #1976d2">
                <th style="color: white" v-for="(items, index) in headers" :key="index">
                  {{ items.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                :style="!items.delivery_status ? 'background-color:#FFBB64;' : 'background-color:#5AB55E;'"
                v-for="(items, index) in list_of_delivery"
                :key="index"
              >
                <td>{{ items.salesID }}</td>
                <td>{{ items.name }}</td>
                <td>{{ items.contact }}</td>
                <td>{{ items.address }}</td>
                <td>{{ items.transaction_by }}</td>
                <td>{{ items.shipment_date }}</td>
                <td>{{ items.shipment_time }}</td>
                <td v-if="!items.delivery_status">
                  <v-btn color="success" @click="FinishDelivery(items)">
                    <v-icon>mdi-package-variant-closed-check</v-icon>
                  </v-btn>
                </td>
                <td v-else>{{ items.delivery_date }}</td>
                <td>{{ !items.delivery_status ? 'Not Yet Delivery' : 'Finished' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            color="primary"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import secret_key from "../plugins/md5decrypt";
import moment from "moment";

export default {
  data: () => {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
      search: "",
      apiUrl: process.env.VUE_APP_API_URL,
      first_date_menu: false,
      second_date_menu: false,
      first_date: moment().subtract(1, "month").format("YYYY-MM-DD"),
      second_date: moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Sales ID", value: "salesID" },
        { text: "Customer Name", value: "name" },
        { text: "Contact", value: "contact" },
        { text: "Address", value: "address" },
        { text: "Transaction By", value: "transaction_by" },
        { text: "Shipment Date", value: "shipment_date" },
        { text: "Shipment Time", value: "shipment_time" },
        { text: "Delivery Date", value: "delivery_date" },
        { text: "Delivery Status", value: "delivery_status" },
      ],
      list_of_delivery: [],
    };
  },
  computed: {
    numPages() {
      return Math.ceil(this.list_of_delivery.length / this.itemsPerPage);
    },
  },
  watch: {
    currentPage() {
      this.getAllItems();
    },
  },
  methods: {
    searchDelivery() {
      axios
        .get(`${this.apiUrl}/delivery/api/searchSalesID/${this.search}`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.list_of_delivery = res.data.filter((rec) => {
            rec.shipment_date = moment(rec.shipment_date).format("YYYY-MM-DD");
            rec.delivery_date = moment(rec.delivery_date).format("YYYY-MM-DD");
            return rec;
          });
        })
        .catch((error) => {
          console.error("Error fetching deliveries:", error);
        });
    },
    async FinishDelivery(rec) {
      Swal.fire({
        title: "Do you want to finish the delivery?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          await axios
            .get(`${this.apiUrl}/delivery/api/updateDelivery/${rec.id}`, {
              headers: {
                authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
              },
            })
            .then(() => {
              location.reload();
            });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    },
    getAllItems() {
      axios
        .get(`${this.apiUrl}/delivery/api/getDelivery`, {
          params: {
            page: this.currentPage,
            page_size: this.itemsPerPage,
          },
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          const data = res.data;
          this.list_of_delivery = data.delivery.filter((rec) => {
            rec.shipment_date = moment(rec.shipment_date).format("YYYY-MM-DD");
            rec.delivery_date = moment(rec.delivery_date).format("YYYY-MM-DD");
            return rec;
          });
          this.totalPages = Math.ceil(data.totalDeliver / this.itemsPerPage);
        });
    },
    clearSearch() {
      this.getAllItems();
    },
  },
  mounted() {
    this.getAllItems();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
