<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container-fluid">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
                <v-layout justify-center>
                    <h4>All Products</h4>
                </v-layout><br><br>
                
                <v-layout justify-center>
                    <button type="button" class="btn btn-success" @click="gotToCreateProduct()">
                      Create New Product
                    </button>
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
                        :items="productArray"
                        :search="search"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                        <v-toolbar
                            flat
                        >
                            <v-divider
                            class="mx-4"
                            inset
                            vertical
                            ></v-divider>
                                    <v-dialog
                                      v-model="dialog"
                                      max-width="500px"
                                    >
                                      <v-card>
                                        <v-card-title>
                                          <span class="headline">Edit Product Name</span>
                                        </v-card-title>

                                        <v-card-text>
                                          <v-container>
                                            <v-row>
                                              <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                              >
                                                <v-text-field
                                                  v-model="editedItem.name"
                                                  label="Product Name"
                                                  outlined shaped
                                                ></v-text-field>
                                              </v-col>

                                            </v-row>
                                          </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="close"
                                          >
                                            Cancel
                                          </v-btn>
                                          <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="save"
                                          >
                                            Save
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>
                                    </v-dialog>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                            </v-dialog>
                        </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                        <v-icon
                            color="teal darken-2"
                            small
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        </template>

                        <template v-slot:item.archive="{ item }">
                        <button v-if="item.active" type="button" class="btn btn-sm btn-danger" @click="setArchive(item,false)">
                          Disable
                        </button>
                        <button v-if="!item.active" type="button" class="btn btn-sm btn-success" @click="setArchive(item,true)">
                          Enable
                        </button>
                        </template>
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
      dialogDelete: false,
      dialog: false,
      search: '',
      loading: false,
      json_data: [],
      headers: [
        {text: 'ID',value: 'pid',},
        { text: 'Name', value: 'name' },
        { text: 'Active', value: 'active' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'updated_at', value: 'updatedAt' },
        { text: 'Interval', value: 'interval' },
        { text: 'Currency', value: 'currency' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Enable/Disable', value: 'archive', sortable: false },
      ],
      productArray: [],
      editedIndex: -1,
      editedItem: {},
      selectedProductId:0,
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
      editItem (item) {
        this.editedIndex = this.productArray.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      async save () {
        if (this.editedIndex > -1) {
          this.loading = true;
          let data={
            product_id:this.editedItem.pid,
            name:this.editedItem.name,
            active:true
          }
          try{
          let response = await quickRequest("/update-product", "POST", data);
          if ("error" in response) {
            Swal.fire({
              type: "error",
              icon: "error",
              title: "Error",
              text: response.error,
            });
          } else if (response.msg) {
            Swal.fire({
              type: "success",
              icon: "success",
              title: "Message",
              text: response.msg,
            });
            this.loading = false;
            this.initialize()
          }
        } catch (e) {
          Swal.fire({
            type: "error",
            title: "Error Fetching Information",
            text: "Could not update through the server.",
          });
        } finally {
          this.loading = false;
        }
        } else {
          console.log(this.editedItem)
        }
        this.close()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      gotToCreateProduct(){
        this.$router.push("/createProducts");
      },
      async initialize() {
        this.productArray=[]
        let productObj={}
        try {
            let response = await quickRequest("/get-prices", "POST",{});
            if ("error" in response) {
            Swal.fire({
                type: "error",
                icon: "error",
                title: "Error",
                text: response.error,
            });
            }else{
              if(response.prices.length>0){
                for(let index=0; index<response.prices.length; index++){
                  console.log(productObj.currency=response.prices[index].Price.currency)
                  productObj.pid=response.prices[index].pid
                  productObj.active=response.prices[index].active
                  productObj.createdAt=response.prices[index].createdAt
                  productObj.updatedAt=response.prices[index].updatedAt
                  productObj.name=response.prices[index].name
                  productObj.currency=response.prices[index].Price.currency
                  productObj.interval=response.prices[index].Price.interval
                  productObj.amount='$'+response.prices[index].Price.amount
                  this.productArray.push(productObj)
                  productObj={}
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

        async setArchive(product, archiveValue){
            this.loading=true
            let data={
              product_id:product.pid,
              name:product.name,
              active:archiveValue
            }
            try{
              let response = await quickRequest("/update-product", "POST", data);
              if ("error" in response) {
                Swal.fire({
                  type: "error",
                  icon: "error",
                  title: "Error",
                  text: response.error,
                });
              } else if (response.msg) {
                Swal.fire({
                  type: "success",
                  icon: "success",
                  title: "Message",
                  text: response.msg,
                });
                this.loading = false;
                this.initialize()
              }
            } catch (e) {
              Swal.fire({
                type: "error",
                title: "Error Fetching Information",
                text: "Could not update through the server.",
              });
            } finally {
              this.loading = false;
            }
        },


        async deleteUser(idd, index){
            this.loading=true
            try {
                let response1 = await quickRequest("/deleteUsers", "POST",{id:idd});
                if ("error" in response1) {
                    this.loading=false
                Swal.fire({
                    type: "error",
                    icon: "error",
                    title: "Error",
                    text: response1.error,
                });
                }else if (response1.msg) {
                    this.loading=false
                    this.userArray.splice(index,1)
                    Swal.fire({
                        type: "success",
                        icon: "success",
                        title: "Message",
                        text: response1.msg,
                    });
                }
            } catch (e) {
                this.loading=false
                Swal.fire({
                type: "error",
                title: "Error Fetching Information",
                text: "Error occured",
                });
            }
        },

      deleteItem (item) {
        this.editedIndex = this.userArray.indexOf(item)
        this.selectedUserId = item.id
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.deleteUser(this.selectedUserId,this.editedIndex)
        // this.userArray.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    }
  }
</script>