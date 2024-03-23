import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const defaultDiscountValue = "20";

export default new Vuex.Store({
    state: {
        discountValue: parseInt(!localStorage.getItem('discountValue')?defaultDiscountValue:localStorage.getItem('discountValue'))
    },
    mutations: {
        setDiscountValue(state, newValue) {
            state.discountValue = newValue;
            localStorage.setItem('discountValue', newValue);
        }
    },
    actions: {
        saveDiscountValue({ commit }, newValue) {
            commit('setDiscountValue', newValue);
        }
    },
    getters: {
        getDiscountValue: state => state.discountValue
    }
});
