import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Pos from '../views/newPOS.vue'
import Delivery from '../views/Delivery.vue'
import Sales from '../views/SalesReport.vue'
import Settings from '../views/Settings.vue'
import Inventories from '../views/Inventories.vue'
import Audit from '../views/AuditTrail.vue'
import Return from '../views/ReturnExchange.vue'
import Category from '../views/Category.vue'
import Discount from '../views/Discount.vue'
import Account from '../views/Account.vue'
import Voids from '../views/VoidLogs.vue'
import PWD from '../views/PwdLogs.vue'
// import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/pos', name: 'pos', component: Pos },
  { path: '/pwd', name: 'pos', component: PWD },
  { path: '/delivery', name: 'delivery', component: Delivery },
  { path: '/return', name: 'return', component: Return },
  { path: '/inventories', name: 'inventories', component: Inventories },
  { path: '/discount', name: 'discount', component: Discount },
  { path: '/category', name: 'category', component: Category },
  { path: '/sales_report', name: 'sales', component: Sales },
  { path: '/audit_trail', name: 'audit', component: Audit },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/account_register', name: 'account_register', component: Account },
  { path: '/void_logs', name: 'void_logs', component: Voids },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// console.log(process.env.VUE_APP_BASE_URL,"40")

export default router
