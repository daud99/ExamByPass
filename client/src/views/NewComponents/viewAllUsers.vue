<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container-fluid">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
                <v-layout justify-center>
                    <h4>All Users</h4>
                </v-layout><br><br>
                
                <v-layout justify-center>
                    <download-csv
                        class   = "btn btn-primary"
                        :data   = "json_data"
                        name    = "Users.csv">
                        Download CSV Of All Users(Excel File)
                    </download-csv>
                    <button type="button" class="btn btn-success" @click="gotToCreateUser()">
                      Create New User
                    </button>
                    <button type="button" class="btn btn-warning" @click="enableSessionEdit()">
                      Edit Allowed Number of sessions
                    </button>
                </v-layout><br><br>
                <v-layout v-if="canEditSession" justify-center>
                    <v-text-field
                        v-model="sessionsAllowed"
                        label="Enter Allowed sessions"
                        type="number"
                        outlined shaped
                    ></v-text-field>&nbsp;&nbsp;
                    <button type="button" class="btn btn-sm btn-success" @click="submitSession()">
                      Submit
                    </button>&nbsp;&nbsp;
                    <button type="button" class="btn btn-sm btn-danger" @click="disableSessionEdit()">
                      Cancel
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
                        :items="userArray"
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
                        <v-icon
                            color="teal darken-2"
                            small
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        </template>

                        <template v-slot:item.archive="{ item }">
                        <button v-if="item.archieved" type="button" class="btn btn-sm btn-danger" @click="setArchive(item,false)">
                          Disable
                        </button>
                        <button v-if="!item.archieved" type="button" class="btn btn-sm btn-success" @click="setArchive(item,true)">
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
  import { quickRequest, dateGet } from "../../../common/misc";
  import PageMixin from "../page-mixin";
  import Vue from 'vue'
  import JsonCSV from 'vue-json-csv'
  Vue.component('downloadCsv', JsonCSV)
  export default {
    data: () => ({
      canEditSession:false,
      sessionsAllowed:Number,
      dialogDelete: false,
      search: '',
      loading: false,
      json_data: [],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Email Verified', value: 'emailVerified' },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'Role', value: 'roles' },
        { text: 'Subscription', value: 'subscription' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Sessions', value: 'sessions' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Enable/Disable', value: 'archive', sortable: false },
      ],
      userArray: [],
      editedIndex: -1,
      selectedUserId:0,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
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
        this.getSessionsAllowed()
    },
    beforeDestroy: function(){
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
      async submitSession(){
        try {
                const data = {max_session_allow:this. sessionsAllowed};
                this.loading = true;
                let response = await quickRequest("/sessionallowedUpdate", "POST", data);
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
                if(response.record){
                    console.log(response.record)
                }
                this.loading = false;
                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                type: "error",
                title: "Error Fetching Information",
                text: "Could not update through the server.",
                });
            } finally {
                this.loading = false;
            }
      },
      enableSessionEdit(){
        this.canEditSession=true
      },
      disableSessionEdit(){
        this.canEditSession=false
      },
      async getSessionsAllowed(){
         try {
              let response = await quickRequest("/getSessionAllowed", "GET",{});
              if ("error" in response) {
              Swal.fire({
                  type: "error",
                  icon: "error",
                  title: "Error",
                  text: response.error,
              });
              }else if(response.sess){
                  this.sessionsAllowed=response.sess[0].max_session_allow
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
      gotToCreateUser(){
        this.$router.push("/create_User");
      },
        async initialize() {
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
                      userObject.name=response.users[index].firstName +  ' ' + response.users[index].lastName
                      userObject.email=response.users[index].email
                      userObject.emailVerified=response.users[index].emailVerified
                      userObject.phoneNumber=response.users[index].phoneNumber
                      userObject.roles=response.users[index].roles
                      userObject.createdAt=dateGet(response.users[index].createdAt)
                      userObject.archieved=response.users[index].archieved
                      userObject.sessions=response.users[index].Sessions.length
                      if(response.users[index].subscription!=null){
                        if(response.users[index].subscription.subscription_id){
                          userObject.subscription=response.users[index].subscription.status
                        }else{
                          userObject.subscription='none'
                        }
                      }else{
                        userObject.subscription='none'
                      }
                      this.userArray.push(userObject)
                      userObject={}
                    }
                    console.log(this.userArray)
                    this.json_data=this.userArray
                    console.log(this.json_data)
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

        async setArchive(userDetails, archiveValue){
            this.loading=true
            try {
                let response1 = await quickRequest("/archivedUser", "POST",{id:userDetails.id, archieved:archiveValue});
                console.log(response1)
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
                    Swal.fire({
                        type: "success",
                        icon: "success",
                        title: "Message",
                        text: response1.msg,
                    });
                    let response2 = await quickRequest("/deleteUserSession", "POST",{id:userDetails.id});
                    if ("error" in response2) {
                      this.loading=false
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response2.error,
                    });
                    }else if (response2.msg) {
                      this.loading=false
                      Swal.fire({
                          type: "success",
                          icon: "success",
                          title: "Message",
                          text: response2.msg,
                      });
                    }
                    this.initialize()

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
      editItem(item){
        this.$router.push('/update_User/'+item.id)
      },
      deleteItemConfirm () {
        console.log(this.selectedUserId)
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