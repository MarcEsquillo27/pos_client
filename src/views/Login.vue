<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="form-card">
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" sm="4">
                    <v-img src="../../public/img/POSlogo.png"></v-img>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <!-- {{ }} -->
                    <v-form @submit.prevent="login">
                      <h1>Login</h1>
                      <br />
                      <v-text-field
                        v-model="username"
                        label="Username"
                        outlined
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-model="password"
                        label="Password"
                        outlined
                        dense
                        type="password"
                      ></v-text-field>
                      <v-btn type="submit" color="primary" @click="login()" block
                        >Login</v-btn
                      >
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import cryptoJS from "crypto-js";
import router from "@/router";

export default {
  name: "Login",
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,

      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .get(`${this.apiUrl}/login/api/getPerAccount/${this.username}/${this.password}`)
        .then((res) => {
          if (res.data.userdetails.length) {
            res.data.token = cryptoJS.AES.encrypt(
              res.data.token,
              process.env.VUE_APP_SECRET_KEY
            ).toString();

            this.$store.commit("STORE_EMP", res.data);

            if (this.$store.state.storedEmp.token) {
              if (this.$route.name !== "pos") {
                router.push({ name: "pos" }); // Redirect to '/pos' route if user is authenticated and not already on '/pos'
              }
            } else {
              alert("Something went wrong, please try again and make sure to login.");
            }
          } else {
            alert("Something went wrong, please try again");
          }
        });
    },
  },

  mounted() {
    console.log(this.apiUrl, "90");
  },
};
</script>
<style scoped>
.form-card {
  background-image: url("../../public/img/formBG.png");
  background-size: cover;
  /* padding: 15px; */
}
</style>
