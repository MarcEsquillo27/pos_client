import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Pos from '../views/Pos.vue'
import Sales from '../views/SalesReport.vue'
import Settings from '../views/Settings.vue'
import Inventories from '../views/Inventories.vue'
import Audit from '../views/AuditTrail.vue'
import Return from '../views/ReturnExchange.vue'
import Category from '../views/Category.vue'
import Discount from '../views/Discount.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/pos',
    name: 'pos',
    component: Pos
  },
  {
    path: '/return',
    name: 'return',
    component: Return
  }, 
  {
    path: '/inventories',
    name: 'inventories',
    component: Inventories
  },{
    path: '/discount',
    name: 'discount',
    component: Discount
  },
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/sales_report',
    name: 'sales',
    component: Sales
  }, {
    path: '/audit_trail',
    name: 'audit',
    component: Audit
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
