<template>
    <v-container>
        <v-card>
            <v-card-title>Master Settings</v-card-title>
            <v-card-text>
                <v-text-field v-model="discount_value" dense outlined label="Default Discount Value"></v-text-field>
                <v-btn color="success" @click="saveDiscount">Save</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
    </template>
    
    <script>
    export default {
        data: () => ({
            discount_value: 0
        }),
        methods: {
            saveDiscount() {
                let get_discount =this.discount_value / 100
                this.$store.dispatch('saveDiscountValue', get_discount.toFixed(2));
            }
        },
        mounted(){
            this.discount_value = parseInt(this.$store.getters.getDiscountValue.split('.')[1])
        }
    };
    </script>
    
    <style>
    </style>
    