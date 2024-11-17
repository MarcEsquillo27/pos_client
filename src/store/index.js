import Vue from 'vue';
import Vuex from 'vuex';
import CreatedPersistedState from 'vuex-persistedstate';
import moment from 'moment'; // Ensure moment.js is imported

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    storedEmp: [],
    storeName: "",
    printPaper: 1000,
    salesID: "", // Add salesID to state
    counter: 1,  // Add counter to track salesID
  },

  mutations: {
    STORE_EMP: (state, newState) => {
      state.storedEmp = newState;
    },
    STORE_NAME: (state, newState) => {
      state.storeName = newState;
    },
    STORE_PAPER: (state, newState) => {
      state.printPaper = newState;
    },
    SET_SALES_ID: (state, newSalesID) => {
      state.salesID = newSalesID;
    },
    INCREMENT_COUNTER: (state) => {
      state.counter++;
      if (state.counter > 99999) {
        state.counter = 1;
      }
    },
    RESET_COUNTER: (state) => {
      state.counter = 1;
    },
  },

  actions: {
    generateSalesID({ state, commit }) {
      const today = moment().format("YYYYMMDD"); // Format: YYYYMMDD
      const increment = String(state.counter).padStart(5, "0"); // Pad the counter to 5 digits
      const newSalesID = `${today}${increment}`;
      commit('SET_SALES_ID', newSalesID);
      commit('INCREMENT_COUNTER');
    },
  },

  plugins: [
    CreatedPersistedState()
  ]
});
