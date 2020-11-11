<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container-fluid">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
                <v-layout justify-center>
                    <h4>Subscriptions</h4>
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
                        :items="subscriptionArray"
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
  import moment from 'moment';
  Vue.component('downloadCsv', JsonCSV)
  export default {
    data: () => ({
      search: '',
      loading: false,
      headers: [
        {text: 'id',value: 'id',},
        { text: 'Amount', value: 'amount' },
        { text: 'Auto Charge', value: 'autoCharge' },
        { text: 'Start', value: 'start' },

        { text: 'End', value: 'end' },
        { text: 'Interval', value: 'interval' },
        { text: 'Status', value: 'status' },

        { text: 'User First Name', value: 'firstname' },
        { text: 'User last Name', value: 'lastname' },
        { text: 'User Email', value: 'email' },
        
        { text: 'User ID', value: 'userId' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Updated At', value: 'updatedAt' },
      ],
      subscriptionArray: [],
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
        dateGet(numS){
            let dat=moment(numS,"x").format("DD MMM YYYY hh:mm a")
            // console.log(dat)
            return dat
        },
      async initialize() {
        this.subscriptionArray=[]
        let subscriptionObject={}
        try {
            let response = await quickRequest("/getSubscriptions", "GET",{});
            if ("error" in response) {
            Swal.fire({
                type: "error",
                icon: "error",
                title: "Error",
                text: response.error,
            });
            }else{
              if(response.subscriptions.length>0){
                for(let index=0; index<response.subscriptions.length; index++){
                  subscriptionObject.id=response.subscriptions[index].subscription_id
                  subscriptionObject.amount='$'+response.subscriptions[index].amount
                  subscriptionObject.createdAt=response.subscriptions[index].createdAt
                  subscriptionObject.updatedAt=response.subscriptions[index].updatedAt
                  subscriptionObject.autoCharge=response.subscriptions[index].autoCharge
                  subscriptionObject.userId=response.subscriptions[index].userId
                  subscriptionObject.start=this.dateGet(response.subscriptions[index].start)
                  subscriptionObject.end=this.dateGet(response.subscriptions[index].end)
                  subscriptionObject.interval=response.subscriptions[index].interval

                  subscriptionObject.status=response.subscriptions[index].status
                  subscriptionObject.firstname=response.subscriptions[index].user.firstName
                  subscriptionObject.lastname=response.subscriptions[index].user.lastName
                  subscriptionObject.email=response.subscriptions[index].user.email

                  this.subscriptionArray.push(subscriptionObject)
                  subscriptionObject={}
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