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
                    class="mx-auto rounded-lg text-center"
                    color="LightGray"
                    elevation="6"
                  >
                    <v-card-text class="text-al">
                       <v-layout>
                        <h5 style="text-weight: bolder">Subscription Started:&nbsp;<span style="color:green;">{{dateGet(subData.start)}}</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <h5 style="text-weight: bolder">Subscription End:&nbsp;<span style="color:green;">{{dateGet(subData.end)}}</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <h5 style="text-weight: bolder">Amount:&nbsp;<span style="color:green;">{{subData.amount}}&nbsp;&nbsp;USD</span></h5>
                      </v-layout>
                      <v-layout justify-left>
                        <p style="font-weight: bolder">Interval:&nbsp;{{subData.interval}}</p>
                      </v-layout>
                      <v-layout justify-left>
                        <p style="font-weight: bolder">Status:&nbsp;<span style="color:green;">{{subData.status}}</span></p>
                      </v-layout>
                      <v-layout justify-left>
                        <p style="font-weight: bolder">Auto Charge:&nbsp;<span style="color:green;">{{subData.autoCharge}}</span></p>
                      </v-layout>
                      <v-layout justify-center>
                        <button type="button" class="btn btn-danger btn-block" @click="cancelSub(!subData.autoCharge)">
                          <template v-if="!subData.autoCharge">
                            Enable
                          </template>
                          <template v-if="subData.autoCharge">
                            Disable 
                          </template>
                          Auto Renewal Of Subscription
                        </button>
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
        let response = await quickRequest("/get-subscription", "POST", {charge: false});
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        } else if (response.msg) {
         this.msg = response.msg;
        }else if(response.subscription){
          this.subData = response.subscription;
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
    async cancelSub(charge){
      try {
        this.loading = true;
        let response = await quickRequest("/cancel-subscription", "POST", {charge});
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
          this.subData = response.subscription;
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