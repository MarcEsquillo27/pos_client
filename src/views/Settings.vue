<template>
  <v-container>
    <v-card>
      <v-card-title>Master Settings</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="store_name"
          dense
          outlined
          label="Store Name"
        ></v-text-field>
        <v-text-field v-model="address" dense outlined label="Address"></v-text-field>
        <v-text-field
          v-model="phone_number"
          dense
          outlined
          label="Phone Number"
        ></v-text-field>
        <v-btn color="success" @click="saveDiscount">Save</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import secret_key from "../plugins/md5decrypt";
import axios from "axios";

export default {
  data: () => ({
    discount_value: 0,
    store_name: "",
    address: "",
    phone_number: "",
    id: null,
  }),
  methods: {
    saveDiscount() {
      let settings = {
        name: this.store_name,
        address: this.address,
        phone_number: this.phone_number,
      };
      //   this.$store.commit("STORE_NAME", settings);
      axios
        .put(`${this.apiUrl}/storename/api/updateStore/${this.id}`, settings, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then(() => {
          location.reload();
        });
    },
    getStore() {
      axios
        .get(`${this.apiUrl}/storename/api/getStore`, {
          headers: {
            authorization: `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
        })
        .then((res) => {
          this.store_name = res.data[0].store_name;
          this.address = res.data[0].address;
          this.phone_number = res.data[0].phone_number;
          this.id = res.data[0].id;
        });
    },
  },
  mounted() {
    this.getStore();
    // Set default values from Vuex store
    // this.store_name = this.$store.state.storeName.name || "";
    // this.address = this.$store.state.storeName.address || "";
    // this.phone_number = this.$store.state.storeName.phone_number || "";

    // this.discount_value = parseInt(this.$store.getters.getDiscountValue.split(".")[1]);
  },
};
</script>

<style></style>
