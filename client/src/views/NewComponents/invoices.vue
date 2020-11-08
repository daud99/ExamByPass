<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container-fluid">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
                <v-layout justify-center>
                    <h4>Invoices</h4>
                </v-layout><br><br>
                <v-layout justify-center>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search By All Fields (Any type of query)"
                        outlined shaped
                    ></v-text-field>
                </v-layout>
                    <v-data-table
                        :headers="headers"
                        :items="invoiceArray"
                        :search="search"
                        class="elevation-1"
                    >
                    </v-data-table>
                  </div>
      </div>
      </div>
    </div>
</core-content>
</template>

<script>
  import card from '../../components/Card';
  import {mapActions, mapGetters} from 'vuex';
  import Swal from "sweetalert2";
  import { quickRequest } from "../../../common/misc";
  import PageMixin from "../page-mixin";
  import Vue from 'vue'
  import JsonCSV from 'vue-json-csv'
  Vue.component('downloadCsv', JsonCSV)
  export default {
    data: () => ({
      search: '',
      loading: false,
      headers: [
        {text: 'id',value: 'id',},
        { text: 'Invoice Id', value: 'invoiceId' },
        { text: 'Product Name', value: 'productName' },
        { text: 'total', value: 'total' },
        { text: 'User ID', value: 'userId' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Updated At', value: 'updatedAt' },
      ],
      invoiceArray: [],
    }),
    components: {
        card
    },

    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },

    watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
        if(!this["auth/isAuthenticated"] && this["auth/getUser"].roles!='admin'){
            this.$router.push('/')
        }
        this.initialize()
    },
    beforeDestroy: function(){
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
      async initialize() {
        this.invoiceArray=[]
        let invoiceObject={}
        try {
            let response = await quickRequest("/getInvoices", "GET",{});
            if ("error" in response) {
            Swal.fire({
                type: "error",
                icon: "error",
                title: "Error",
                text: response.error,
            });
            }else{
              if(response.invoices.length>0){
                for(let index=0; index<response.invoices.length; index++){
                  invoiceObject.id=response.invoices[index].id
                  invoiceObject.invoiceId=response.invoices[index].invoiceId
                  invoiceObject.createdAt=response.invoices[index].createdAt
                  invoiceObject.updatedAt=response.invoices[index].updatedAt
                  invoiceObject.total=response.invoices[index].total
                  invoiceObject.userId=response.invoices[index].userId
                  invoiceObject.productName=response.invoices[index].Product.name
                  this.invoiceArray.push(invoiceObject)
                  invoiceObject={}
                }
              }    
            }
        } catch (e) {
            console.log(e)
            Swal.fire({
            type: "error",
            title: "Error Fetching Information",
            text: "Error occured",
            });
        }
      },
    }
  }
</script>