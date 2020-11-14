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
                        <button type="button" class="btn btn-success" @click="getAssignedSub()">
                          VIEW ADMIN ASSIGNED SUBSCRIPTIONS
                        </button>
                        <button type="button" class="btn btn-primary" @click="initialize()">
                          VIEW ALL USERS SUBSCRIPTIONS
                        </button>
                        <button type="button" class="btn btn-warning" @click="assignSubUser()">
                          ASSIGN SUBSCRIPTION TO USER
                        </button>
                    </v-layout><br><br>

                    <v-layout v-if="canAddSub" justify-center>
                    <v-select
                        v-model="userIdForSub"
                        :items="userArray"
                        item-text="name"
                        item-value="id"
                        label="Select User"
                        outlined
                    ></v-select>&nbsp;&nbsp;
                    <button type="button" class="btn btn-sm btn-success" @click="submitSub()">
                      Submit
                    </button>&nbsp;&nbsp;
                    <button type="button" class="btn btn-sm btn-danger" @click="disableSub()">
                      Cancel
                    </button>
                </v-layout><br><br>

                    <v-layout justify-center>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search By All Fields (Any type of query)" outlined shaped></v-text-field>
                    </v-layout>
                    <v-data-table v-if="!isAdminSubscribedSub" :headers="headers" :items="subscriptionArray" :search="search" class="elevation-1">
                    </v-data-table>

                     <v-data-table v-if="isAdminSubscribedSub" :headers="headers2" :items="subscriptionArray" :search="search" class="elevation-1">
                        <template v-slot:top>
                        <v-toolbar
                            flat
                        >
                            <v-divider
                            class="mx-4"
                            inset
                            vertical
                            ></v-divider>
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
                                color="pink"
                                small
                                @click="deleteItem(item)"
                            >
                                mdi-delete
                            </v-icon>&nbsp;
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
import {
    mapActions,
    mapGetters
} from 'vuex';
import Swal from "sweetalert2";
import {
    quickRequest
} from "../../../common/misc";
import PageMixin from "../page-mixin";
import Vue from 'vue'
import JsonCSV from 'vue-json-csv'
import moment from 'moment';
Vue.component('downloadCsv', JsonCSV)
export default {
    data: () => ({

        search: '',
        loading: false,
        canAddSub:false,
        userIdForSub:'',
        editedIndex: -1,
        dialogDelete: false,
        userArray:[],
        selectedId:'',
        headers: [{
                text: 'id',
                value: 'id',
            },
            {
                text: 'Amount',
                value: 'amount'
            },


            {
                text: 'Auto Charge',
                value: 'autoCharge'
            },
            {
                text: 'Start',
                value: 'start'
            },

            {
                text: 'End',
                value: 'end'
            },
            {
                text: 'Interval',
                value: 'interval'
            },
            {
                text: 'Status',
                value: 'status'
            },

            {
                text: 'Name',
                value: 'name'
            },
            {
                text: 'Email',
                value: 'email'
            },

            {
                text: 'User ID',
                value: 'userId'
            },
            {
                text: 'Created',
                value: 'createdAt'
            },
            {
                text: 'Last Updated',
                value: 'updatedAt'
            },
        ],

        headers2: [{
                text: 'id',
                value: 'id',
            },
            {
                text: 'Amount',
                value: 'amount'
            },


            {
                text: 'Auto Charge',
                value: 'autoCharge'
            },
            {
                text: 'Start',
                value: 'start'
            },

            {
                text: 'End',
                value: 'end'
            },
            {
                text: 'Interval',
                value: 'interval'
            },
            {
                text: 'Status',
                value: 'status'
            },

            {
                text: 'Name',
                value: 'name'
            },
            {
                text: 'Email',
                value: 'email'
            },

            {
                text: 'User ID',
                value: 'userId'
            },
            {
                text: 'Created',
                value: 'createdAt'
            },
            {
                text: 'Last Updated',
                value: 'updatedAt'
            },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        subscriptionArray: [],
        isAdminSubscribedSub:false
    }),
    components: {
        card
    },

    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },

    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        if (!this["auth/isAuthenticated"] && this["auth/getUser"].roles != 'admin') {
            this.$router.push('/')
        }
        this.initialize()
        this.getUserS()
    },
    beforeDestroy: function () {
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
        async deleteSub(idd, index){
            this.loading=true
            try {
                let response1 = await quickRequest("/delete-self-assign-subscription", "POST",{id:idd});
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
                    this.subscriptionArray.splice(index,1)
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
        deleteItemConfirm () {
        console.log(this.selectedId)
        this.deleteSub(this.selectedId,this.editedIndex)
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
        deleteItem (item) {
            console.log(item)
            this.editedIndex = this.subscriptionArray.indexOf(item)
            this.selectedId = item.id
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async getAssignedSub(){
            this.isAdminSubscribedSub=true
            this.subscriptionArray = []
            let subscriptionObject = {}
            try {
                let response = await quickRequest("/getAdminSubSubscriptions", "GET", {});
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                } else {
                    if (response.subscriptions.length > 0) {
                        for (let index = 0; index < response.subscriptions.length; index++) {
                            subscriptionObject.id = response.subscriptions[index].subscription_id
                            subscriptionObject.amount = '$'+response.subscriptions[index].amount
                            subscriptionObject.createdAt = this.dateGet(response.subscriptions[index].createdAt)
                            subscriptionObject.updatedAt = this.dateGet(response.subscriptions[index].updatedAt)
                            subscriptionObject.autoCharge = response.subscriptions[index].autoCharge
                            subscriptionObject.userId = response.subscriptions[index].userId
                            subscriptionObject.start = this.dateGet(response.subscriptions[index].start)
                            subscriptionObject.end = this.dateGet(response.subscriptions[index].end)
                            subscriptionObject.interval = response.subscriptions[index].interval


                            subscriptionObject.status = response.subscriptions[index].status
                            subscriptionObject.name = response.subscriptions[index].user.firstName + ' ' +  response.subscriptions[index].user.lastName
                            subscriptionObject.email = response.subscriptions[index].user.email

                            this.subscriptionArray.push(subscriptionObject)
                            subscriptionObject = {}
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
        async submitSub(){
            console.log(this.userIdForSub)
            try {
              let response = await quickRequest("/assign-subscription", "POST",{id:this.userIdForSub});
              if ("error" in response) {
              Swal.fire({
                  type: "error",
                  icon: "error",
                  title: "Error",
                  text: response.error,
              });
              }else if(response.msg){
                  console.log(response)
                  this.loading=false
                    Swal.fire({
                        type: "success",
                        icon: "success",
                        title: "Message",
                        text: response.msg,
                    });
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
        assignSubUser(){
            this.canAddSub=true
        },
        disableSub(){
            this.canAddSub=false
        },
        dateGet(numS) {
            let dat = moment(numS, "x").format("DD MMM YYYY hh:mm a")
            // console.log(dat)
            return dat
        },
        async getUserS(){
            this.userArray=[]
          let userObject={}
          try {
              let response = await quickRequest("/getUsers", "GET",{});
              if ("error" in response) {
              Swal.fire({
                  type: "error",
                  icon: "error",
                  title: "Error",
                  text: response.error,
              });
              }else{
                  if(response.users.length>0){
                    for(let index=0; index<response.users.length; index++){
                      userObject.id=response.users[index].id
                      userObject.email=response.users[index].email
                      userObject.roles=response.users[index].roles
                      userObject.name=response.users[index].firstName +  ' ' + response.users[index].lastName+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0('+userObject.email+')\xa0\xa0\xa0\xa0\xa0\xa0\xa0('+userObject.roles+')'
                      this.userArray.push(userObject)
                      userObject={}
                    }
                    console.log(this.userArray)
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
        async initialize() {
            this.isAdminSubscribedSub=false
            this.subscriptionArray = []
            let subscriptionObject = {}
            try {
                let response = await quickRequest("/getSubscriptions", "GET", {});
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                } else {
                    if (response.subscriptions.length > 0) {
                        for (let index = 0; index < response.subscriptions.length; index++) {
                            subscriptionObject.id = response.subscriptions[index].subscription_id
                            subscriptionObject.amount = '$'+response.subscriptions[index].amount
                            subscriptionObject.createdAt = this.dateGet(response.subscriptions[index].createdAt)
                            subscriptionObject.updatedAt = this.dateGet(response.subscriptions[index].updatedAt)
                            subscriptionObject.autoCharge = response.subscriptions[index].autoCharge
                            subscriptionObject.userId = response.subscriptions[index].userId
                            subscriptionObject.start = this.dateGet(response.subscriptions[index].start)
                            subscriptionObject.end = this.dateGet(response.subscriptions[index].end)
                            subscriptionObject.interval = response.subscriptions[index].interval


                            subscriptionObject.status = response.subscriptions[index].status
                            subscriptionObject.name = response.subscriptions[index].user.firstName + ' ' +  response.subscriptions[index].user.lastName
                            subscriptionObject.email = response.subscriptions[index].user.email

                            this.subscriptionArray.push(subscriptionObject)
                            subscriptionObject = {}
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
