import Vue from 'vue'
import Vuex from 'vuex'
import CreatedPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    storedEmp:[],
    storeName:"",
    printPaper:1000
    
  },

  mutations: {
    STORE_EMP: (state,newState) => {
      state.storedEmp = newState;

  },
  STORE_NAME: (state,newState) => {
    state.storeName = newState;

},
STORE_PAPER: (state,newState) => {
  state.printPaper = newState;

},
  },
  actions: {
  },
  modules: {
  },

  plugins:[
    CreatedPersistedState()
  ]
})
