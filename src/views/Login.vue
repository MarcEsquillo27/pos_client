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
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .get(
          `http://localhost:12799/login/api/getPerAccount/${this.username}/${this.password}`
        )
        .then((res) => {
          console.log(res.data);

          if (res.data.userdetails.length) {
            res.data.token = cryptoJS.AES.encrypt(
              res.data.token,
              process.env.VUE_APP_SECRET_KEY
            ).toString();

            this.$store.commit("STORE_EMP", res.data);

            // Check if the current route is not already '/pos' before navigating
            if (this.$route.path !== "/pos") {
              this.$router.push("/pos");
            }
          } else {
            alert("Something went wrong please try again");
          }
        });

      // axios.get(`/api/getPerAccount/${
    },
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
