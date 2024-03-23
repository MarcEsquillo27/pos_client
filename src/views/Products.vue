<template>
  <div>
    <v-container fluid>
      <h1>Products</h1>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field
            outlined
            rounded
            color="primary"
            dense
            label="Search"
          />
        </v-col>
        <v-col cols="6">
            <v-btn rounded color="primary" dense>Add Product</v-btn> <v-btn rounded color="success" dense>Data Extraction</v-btn>
        </v-col>
      </v-row>
     <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                  <v-data-table :headers="headers" :items="all_products"></v-data-table>

                </v-card-text>
            </v-card>
        </v-col>
     </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data: () => {
  return {
      showDatePicker:false,
      from_date:null,
      all_products:[],
      menu:false,
      date:"",
     headers:[
       { text: 'Item', value: 'title' },
       { text: 'Brand ', value: 'brand' },
       { text: 'Category ', value: 'category' },
       { text: 'Description ', value: 'description' },
       { text: 'Stock', value: 'stock' },
       { text: 'Orignal Price', value: 'price' },
       { text: 'Sales Price', value: 'price' },
    ],
  }
},
methods:{
getAllProducts(){
  axios.get('https://dummyjson.com/products').then((res)=>{
   
      this.all_products = res.data.products
      // console.log(res.data.products)
  })
}
},
mounted(){
this.getAllProducts()
}
}
</script>


<style scoped>
/* Add any custom styles here */
</style>
