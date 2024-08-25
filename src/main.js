import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import myMixins from './plugins/myMixins'

Vue.config.productionTip = false
Vue.use(myMixins);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// document.addEventListener('keydown', (event) => {
//   if (event.key === 'F12') {
//     alert('Developer tools are disabled.');
//     event.preventDefault();
//   }
// });