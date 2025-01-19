<template>
  <div>
    
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
import secret_key from "../plugins/md5decrypt";
export default {
   data: () => {
    return {
    apiUrl: process.env.VUE_APP_API_URL,
    for_delivery:false,
    discounted:false,
    products_code:"",
    editMode:false,
    epayment_dialog:false,
    delivery_dialog:false,
    cash_dialog:false,
    receipt_dialog: false,
    mode_of_payment:null,
    qr_image:"",
    selectedDate: null,
      selectedTime: null,
      showDatePicker: false,
      showTimePicker: false,
      contact_address:"",
      contact_details:"",
      contact_name:"",
    cash:0,
    total:0,
    change:0,
    headers:[
       { text: 'Item', value: 'item' },
       { text: 'Stock', value: 'stock' },
       { text: 'Price', value: 'salesPrice' },
       { text: 'Quantity', value: 'quantity' },
       { text: 'Subtotal', value: 'subtotal' },
    ],
    products:[],
    deliveryArr:[],
    list_of_products:[]
    // payment_type:null
    };
   
  },
   methods: {
    saveDelivery(){
      let get_details = {
        name:this.contact_name,
        address:this.address,
        contact:this.contact_details,
        date:this.selectedDate,
        time:this.selectedTime
      }
      this.deliveryArr.push(get_details)

      alert("Save Succesfully")
      this.delivery_dialog = false
    },
    voidItem(){
      let confirmation = confirm("Are you sure you want to void the transaction?")
      if(confirmation){
        this.products = []
      this.products_code = ""
      this.total = 0
      this.cash = 0
      this.change = 0
      }
      // let void_authentication = prompt("Enter Admin Password")
      // if(void_authentication == "void_admin"){
      // alert("void successfully")
      // this.products = []
      // this.products_code = ""
      // this.total = 0
      // this.cash = 0
      // this.change = 0
      // }
      // else{
      //   alert("Wrong password please try again")
      // }
    },
    toggleDelete(item){
      let confirmation = confirm("Are you sure you want to delete?")
      if(confirmation){
      let get_index= this.products.indexOf(item)
      this.products.splice(get_index,1)
      this.total =this.total - item.subtotal 
      this.products_code = ""
      this.cash = 0
      this.change = 0
      }
     
    },
    toggleEditMode(item) {
      item.editMode = true;
    },
    saveChanges(item) {
      item.editMode = false;
      item.subtotal = item.salesPrice * item.quantity;
      this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
    },
    //TOTAL DISCOUNT
    totalDiscounted(){
      
      if(this.discounted){
        
        let discounted_total = this.total * this.$store.getters.getDiscountValue;
        let final_total = this.total - discounted_total
        
        return final_total.toFixed(2)
      }
      else{
        return this.total.toFixed(2)
      }

    },
    //CHANGE TOTAL
    changeTotal(){
      this.change = this.cash - this.total
      if(this.change <= 0){
        return 0
      }
      else{
      return this.cash - this.total

      }
    },
    //ALL GET DATA
    getProducts(val) {
      if(val){
    axios.get(`${this.apiUrl}/inventory/api/getPerItem/${val}`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
    .then((res) => {
        let result_product = res.data[0];
        result_product.discounted = false;
        // Check if the product already exists in this.products based on its ID
        let existingProduct = this.products.find(product => product.productNumber === result_product.productNumber);

        if (existingProduct) {
            // If the product exists, update its quantity, subtotal, and stock
            existingProduct.quantity++;
            existingProduct.stock--;
            existingProduct.subtotal = existingProduct.salesPrice * existingProduct.quantity;
        } else {
            // If the product doesn't exist, add it to this.products array
            result_product.quantity = 1; // Initialize quantity to 1
            result_product.stock--; // Decrease stock as it's being added
            result_product.subtotal = result_product.salesPrice * result_product.quantity; // Calculate subtotal
            result_product.editMode = false
            this.products.push(result_product);
        }
         this.total = this.products.reduce((acc, product) => acc + product.subtotal, 0);
         this.products_code = ""
        
    })
    .catch(error => {
        console.error("Error fetching products:", error);
         this.products_code = ""

    });
      }
},
    // ALL @CLICK FUNCTION
      electronicPayment(){
          this.epayment_dialog = true;
      },
      cashPayment(){
        this.cash_dialog = true;
      },
      purchase(){
        axios.post(`${this.apiUrl}/inventory/api/updateInventoryStock`,this.products,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      })
        .then((res)=>{
        console.log(res.data)
        axios.post(`${this.apiUrl}/sales/api/addSales`,this.products,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res)=>{
          console.log(res.data)
        }).then(()=>{
              for (let i = 0; i < this.products.length; i++) {
                const element = this.products[i];
                let audit_logs = {
                action:`Decrease`,
                description:`The ${element.productNumber} decreased ${element.quantity}`,
                product_number:element.productNumber,
                quantity:element.quantity,
                drawer_link:`POS`,
                date:moment().format("YYYY-MM-DD hh:mm:ss"),
                transaction_by:this.$store.state.storedEmp.userdetails[0].fullname
              }
                     axios.post('${this.apiUrl}/audit/api/addLogs',audit_logs,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res)=>{
          console.log(res.data)
        })
              }
              
      
        })
        this.receipt_dialog = true

    }).catch((err)=>{
        alert(err)
    })
      },
      printReciept(){
const printContents = document.getElementById('my-card').innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();

      document.body.innerHTML = originalContents;
      },

      // ALL @CHANGE FUNCTION
      modeOfPayment(val){
        if(val == "G-cash"){
          this.qr_image = "gcash"
        }
        else if (val == "Paymaya"){
          this.qr_image = "paymaya"
        }
        else{
          this.qr_image = ""
        }
      },
      getAllProducts(){
          axios.get(`${this.apiUrl}/inventory/api/getAllInvetory`,{
        headers: {
            'authorization': `Bearer ${secret_key(this.$store.state.storedEmp.token)}`, // Assuming Bearer token
          },
      }).then((res)=>{
      this.list_of_products = res.data
    }).catch((err)=>{
      alert(err.message )
    })
      }
    },
  mounted() {
    this.getAllProducts()
  },
}
</script>

<style scoped>
/* Add any custom styles here */
 th, td {
        border: 1px solid black; /* 1px width solid black border */
        padding: 8px; /* optional padding for better visualization */
    }
th{
  background-color: #1976D2;
  color: white !important;
  }
</style>
