<template>
  <core-content :loading="loading">
  <div class="py-5" id="accountComponentSection">
    <v-card flat :style="{paddingLeft:'3%',paddingRight:'3%'}">
        <v-card-text>
            <h4 v-if="msg">{{msg}}</h4><br><br>
            <div class="container-fluid" v-if="!msg">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <v-card
                    v-for="(item, index) in subData.data" :key="index"
                    class="mx-auto rounded-lg text-center"
                    color="LightGray"
                    elevation="6"
                  >
                    <v-card-text class="text-al">
                       <v-layout>
                        <h5 style="text-weight: bolder">Subscription Started:&nbsp;<span style="color:green;">{{dateGet(subData.current_period_start)}}</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <h5 style="text-weight: bolder">Subscription End:&nbsp;<span style="color:green;">{{dateGet(subData.current_period_end)}}</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <h5 style="text-weight: bolder">Amount:&nbsp;<span style="color:green;">{{item.amount}}&nbsp;&nbsp;{{item.currency}}</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <p style="font-weight: bolder">Interval:&nbsp;{{item.interval_count}}&nbsp;{{item.interval}}</p>
                      </v-layout>
                      <v-layout justify-left>
                        <p style="font-weight: bolder">Active:&nbsp;<span style="color:green;">{{item.active}}</span></p>
                      </v-layout>
                      <v-layout justify-right>
                        <p style="font-weight: bolder">Usage Type:&nbsp;<span style="color:green;">{{item.usage_type}}</span></p>
                      </v-layout>
                      <v-layout justify-center>
                        <button type="button" class="btn btn-danger btn-block" @click="cancelSub">Cancel Renewal Of Subscription</button>
                      </v-layout>

                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </div>
            
            
        </v-card-text>
    </v-card>
  </div>
  </core-content>
</template>

<script>
import card from '../../components/Card'
import {mapActions, mapGetters} from 'vuex';
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";
import moment from 'moment';

export default {
  mixins: [PageMixin],
  data: () => ({
      loading:false,
      subData:{
        created: '',
        current_period_end: '',
        current_period_start: '',
        quantity: '',

        data:[]
      },

      dataObj:{
        amount: '',
        currency: '',
        billing_scheme: '',
        interval: '',
        interval_count:'',
        usage_type:'',
        active:null
      },
      msg: ''
      
    }),
  components: {
    card
  },
  computed: {
    ...mapGetters(["auth/getUser"])
  },
  async mounted() {
    this.loading = true;
    this.subData.Data=[]
    try {
        // this.loading = true;
        let response = await quickRequest("/get-subscription", "POST", {});
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        } else if (response.msg) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.msg,
          });
        }else if(response.subscription){
          this.subData.created= response.subscription.created
          this.subData.current_period_end= response.subscription.current_period_end
          this.subData.current_period_start= response.subscription.current_period_start
          this.subData.quantity= response.subscription.quantity
          for(var index=0;index<response.subscription.items.data.length;index++){
            this.dataObj.amount= response.subscription.items.data[index].plan.amount
            this.dataObj.currency= response.subscription.items.data[index].plan.currency
            this.dataObj.billing_scheme= response.subscription.items.data[index].plan.billing_scheme
            this.dataObj.interval= response.subscription.items.data[index].plan.interval
            this.dataObj.interval_count=response.subscription.items.data[index].plan.interval_count
            this.dataObj.usage_type=response.subscription.items.data[index].plan.usage_type
            this.dataObj.active=response.subscription.items.data[index].price.active
            this.subData.data.push(this.dataObj)
            // this.dataObj.amount= ''
            // this.dataObj.currency=''
            // this.dataObj.billing_scheme= ''
            // this.dataObj.interval= ''
            // this.dataObj.interval_count=''
            // this.dataObj.usage_type=''
            // this.dataObj.active=''
          }
        // console.log(this.subData)
        }
        // console.log(response)
        
        
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not fetch subscription through the server.",
        });
      } finally {
        this.loading = false;
      }
  },
  created() {
    this.firstname = this["auth/getUser"].firstName;
    this.lastname = this["auth/getUser"].lastName;
    this.email = this["auth/getUser"].email;
    this.uuid = this["auth/getUser"].uuid;
  },
  methods: {
    dateGet(numS){
      let dat=moment(numS,"x").format("DD MMM YYYY hh:mm a")
      // console.log(dat)
      return dat
    },
    submit () {
        console.log(this.firstname)
        console.log(this.lastname)
        console.log(this.email)
    },
    clear () {
        this.$v.$reset()
        this.firstname = ''
        this.lastname = ''
    },
    async cancelSub(){
      try {
        this.loading = true;
        let response = await quickRequest("/cancel-subscription", "POST", {});
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
        }
        } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Error while performing this action",
        });
      } finally {
        this.loading = false;
      }
    }
  },
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>