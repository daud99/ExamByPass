<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container-fluid">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
                <v-layout justify-center>
                    <h4>Coupens</h4>
                </v-layout><br><br>
                
                <v-layout justify-center>
                    <button type="button" class="btn btn-success" @click="createCoupon()">
                      Create New Coupen
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
                        :items="couponArray"
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
                                    ><br><br><br><br><br>
                                      <v-card>
                                        <v-card-title>
                                          <span class="headline">Add new coupen</span>
                                        </v-card-title>

                                        <v-card-text>
                                          <v-container>
                                            <v-row>
                                              <v-col
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >
                                                <v-text-field
                                                  v-model="name"
                                                  label="Coupen Name"
                                                  outlined shaped
                                                ></v-text-field>
                                              </v-col>
                                            </v-row>

                                            <v-radio-group
                                              v-model="row"
                                              row
                                            >
                                              <v-radio
                                                label="Percentage_off"
                                                value="1"
                                              ></v-radio>
                                              <v-radio
                                                label="Amount_off"
                                                value="2"
                                              ></v-radio>
                                            </v-radio-group>

                                            <v-row>
                                              <v-col
                                                v-if="row=='1'"
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >
                                                <v-text-field
                                                  v-model="percentage_off"
                                                  type="number"
                                                  label="Percentage Off"
                                                  outlined shaped
                                                ></v-text-field>
                                              </v-col>
                                            </v-row>

                                            <v-row>
                                              <v-col
                                                v-if="row=='2'"
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >
                                                <v-text-field
                                                  v-model="amount_off"
                                                  type="number"
                                                  label="Amount Off"
                                                  outlined shaped
                                                ></v-text-field>
                                              </v-col>
                                            </v-row>

                                            

                                            <v-row>
                                              <v-col
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >

                                                <v-select
                                                    v-model="duration"
                                                    :items="items"
                                                    label="Duration"
                                                    outlined
                                                ></v-select>
                                              </v-col>
                                            </v-row>

                                            <v-row>
                                              <v-col
                                              v-if="duration=='repeating'"
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >

                                                <v-text-field
                                                  v-model="duration_in_months"
                                                  type="number"
                                                  label="Duration in Months"
                                                  outlined shaped
                                                ></v-text-field>
                                              </v-col>
                                            </v-row>

                                            <v-row>
                                              <v-col
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >
                                                <h5>Redeem By</h5><br>
                                                <input class="form-control" label="Select Redeem By" v-model="redeem_by" type="datetime-local" value="" id="datetime-local-input">
                                              </v-col>
                                            </v-row>

                                            <v-row>
                                              <v-col
                                                cols="12"
                                                sm="12"
                                                md="12"
                                              >
                                                <v-text-field
                                                  v-model="max_redemtions"
                                                  type="number"
                                                  label="Max Redemtions"
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
                                          :disabled="duration=='' || name==''"
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
                            <br><br><br><br><br>
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

                            <v-dialog v-model="dialogPromo" max-width="500px">
                            <br><br><br><br><br>
                            <v-card style="padding:20px">
                                  <h6>Promocodes</h6> 
                                  <v-text-field
                                    v-model="promoName"
                                    label="PromoCode Name"
                                    outlined shaped
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="promoMaxRed"
                                    type="number"
                                    label="Max Redemtion less or equal to coupon redemption"
                                    outlined shaped
                                  ></v-text-field>
                                  <button :disabled="promoName=='' || promoMaxRed==''" type="button" class="btn btn-sm btn-danger" @click="savePromoCode()">
                                    AddNew
                                  </button><hr>
                                    <v-list rounded>
                                      <v-subheader>Current Promo Codes</v-subheader>
                                      <v-list-item-group
                                        color="primary"
                                      >
                                        <v-list-item
                                          v-for="(items, i) in viewedPromoCode.promos"
                                          :key="i"
                                        >
                                          <v-list-item-icon>
                                            <v-icon v-text="'mdi-star'"></v-icon>
                                          </v-list-item-icon>
                                          <v-list-item-content>
                                            <v-list-item-title v-text="items.code"></v-list-item-title>
                                            <button v-if="items.active" type="button" class="btn btn-sm btn-danger" @click="setArchive(items.id,false)">
                                              Disable
                                            </button>
                                            <button v-if="!items.active" type="button" class="btn btn-sm btn-success" @click="setArchive(items.id,true)">
                                              Enable
                                            </button>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list-item-group>
                                    </v-list>
                                  <hr>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closePromo">Close</v-btn>
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
                            @click="deleteCoupon(item)"
                        >
                            mdi-delete
                        </v-icon>
                        </template>

                        <template v-slot:item.promoCode="{ item }">
                        <button type="button" class="btn btn-sm btn-danger" @click="viewPromoDialog(item)">
                          View Promo Codes
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
  import moment from 'moment';
  Vue.component('downloadCsv', JsonCSV)
  export default {
    data: () => ({
      items: ['once', 'repeating' , 'forever'],
      dialogDelete: false,
      row:'',
      dialog: false,
      dialogPromo: false,
      search: '',
      loading: false,
      json_data: [],
      headers: [
        {text: 'ID',value: 'id',},
        { text: 'Name', value: 'name' },
        { text: 'Promo Codes', value: 'promoCode', sortable: false },
        { text: 'max_redemptions', value: 'max_redemptions' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Updated At', value: 'updatedAt' },
        { text: 'Amount Off', value: 'amount_off' },
        { text: 'Percent Off', value: 'percent_off' },
        { text: 'Duration', value: 'duration' },
        { text: 'Redeem By', value: 'redeem_by' },
        { text: 'Duration_in_months', value: 'duration_in_months' },
        { text: 'Currency', value: 'currency' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      couponArray: [],
      selectedCouponId:0,
        editedIndex: -1,
      duration:'',
      percentage_off:0,
      amount_off:0,
      duration_in_months:0,
      redeem_by:'',
      max_redemtions:0,
      name:'',

      promoName:'',
      promoMaxRed:0,

      viewedPromoCode:{}
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
      viewPromoDialog(promoCodesGet){
        this.viewedPromoCode=promoCodesGet
        this.dialogPromo=true
        console.log(this.viewedPromoCode)
      },
      async savePromoCode(){
        let data={
          coupon:this.viewedPromoCode.id,
          code:this.promoName,
          max_redemptions:parseInt(this.promoMaxRed)
        }
        console.log(data)
        try{
        let response = await quickRequest("/create-promotion-code", "POST", data);
        if ("error" in response) {
          this.viewedPromoCode={}
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
            this.viewedPromoCode={}
            this.loading = false;
            this.initialize()
            }
        } catch (e) {
          this.viewedPromoCode={}
          Swal.fire({
            type: "error",
            title: "Error Fetching Information",
            text: "Could not update through the server.",
          });
        } finally {
          this.viewedPromoCode={}
          this.loading = false;
        }
        this.closePromo()
      },
      closePromo(){
        this.viewedPromoCode={}
        this.dialogPromo=false
      },
      createCoupon () {
          this.dialog = true
      },
      async save () {
        this.loading = true;
        let data={
            duration:this.duration,
            name:this.name
        }
        console.log(this.redeem_by)
        if(this.redeem_by!=''){
          data.redeem_by=this.redeem_by
          data.max_redemptions=parseInt(this.max_redemtions)
        }
        console.log(this.row)
        console.log(this.amount_off)
        console.log(this.percent_off)
        if(this.row=='1'){
          data.percent_off=parseInt(this.percentage_off)
          delete data.amount_off
        }else if(this.row=='2'){
          data.amount_off=parseInt(this.amount_off)
          delete data.percent_off
        }
        if(this.duration=='repeating'){
          data.duration_in_months=this.duration_in_months
        }
        try{
        let response = await quickRequest("/create-coupon", "POST", data);
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
        this.close()
      },
      close () {
        this.dialog = false
      },
      dateGet(numS){
            let dat=moment(numS,"x").format("DD MMM YYYY hh:mm a")
            // console.log(dat)
            return dat
        },
      async initialize() {
        this.couponArray=[]
        let couponObj={}
        try {
            let response = await quickRequest("/getAllCoupons", "GET",{});
            if ("error" in response) {
            Swal.fire({
                type: "error",
                icon: "error",
                title: "Error",
                text: response.error,
            });
            }else{
              console.log(response)
              if(response.coupons.length>0){
                for(let index=0; index<response.coupons.length; index++){
                  couponObj.id=response.coupons[index].id
                  couponObj.name=response.coupons[index].name
                  couponObj.createdAt=response.coupons[index].createdAt
                  couponObj.updatedAt=response.coupons[index].updatedAt
                  couponObj.max_redemptions=response.coupons[index].max_redemptions
                  couponObj.currency=response.coupons[index].currency
                  couponObj.amount_off='$'+response.coupons[index].amount_off
                  couponObj.percent_off=response.coupons[index].percent_off+'%'
                  couponObj.redeem_by=this.dateGet(response.coupons[index].redeem_by)
                  couponObj.duration=response.coupons[index].duration
                  couponObj.duration_in_months=response.coupons[index].duration_in_months
                  couponObj.promos=response.coupons[index].PromotionCodes
                  this.couponArray.push(couponObj)
                  couponObj={}
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

        async setArchive(idd, archiveValue){
            this.loading=true
            let data={
              id:idd,
              active:archiveValue
            }
            try{
              let response = await quickRequest("/archive-promotion-code", "POST", data);
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
            this.closePromo()
        },


        async deleteCouponA(idd, index){
            this.loading=true
            try {
                let response1 = await quickRequest("/delete-coupon", "POST",{id:idd});
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
                    this.couponArray.splice(index,1)
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

      deleteCoupon (item) {
        this.editedIndex = this.couponArray.indexOf(item)
        this.selectedCouponId = item.id
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.deleteCouponA(this.selectedCouponId,this.editedIndex)
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