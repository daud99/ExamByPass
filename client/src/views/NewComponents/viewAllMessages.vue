<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
      <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <div class="row">
            <div class="col offset-lg-1 offset-md-1 col-lg-10 col-md-10 col-xs-12">
                <v-layout justify-center>
                    <h4>All User Messages</h4>
                </v-layout><br><br>
                <v-card v-for="(item, index) in messages" :key="index" class="mx-auto rounded-lg" max-width="100%" color="LightGray" >
                    <v-card-text>
                        <v-layout justify-left>
                            <h5>Problem type:&nbsp;&nbsp;{{item.problemType}}</h5>
                        </v-layout>
                        <v-layout justify-left>
                            <p>{{item.message}}</p>
                        </v-layout>
                        <v-layout justify-center>
                            <v-layout justify-left>
                                <h6 style="color:green">From:&nbsp;{{item.firstName }}&nbsp;{{item.lastName}}&nbsp;&nbsp;</h6><span style="color:red">{{item.email}}</span>
                            </v-layout>
                            <v-layout justify-right>
                                <h6 style="color:green">Created At:&nbsp;{{item.createdAt }}</h6>
                            </v-layout>
                        </v-layout><br>
                        <v-layout justify-center>
                            <button type="button" class="btn btn-danger btn-block" @click="deleteMessage(item.id, index)">Delete</button>
                        </v-layout>
                        
                    </v-card-text><hr>
                </v-card>
          </div>
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


export default {
  name: "viewAllMessages",
  mixins: [PageMixin],
  data: () => ({
      loading:false,
      messages:[]
    }),

  components: {
    card
  },

  computed: {
    ...mapGetters(["auth/getUser"]),
    ...mapGetters(["auth/isAuthenticated"]),
  },
  created() {
    if(!this["auth/isAuthenticated"] && this["auth/getUser"].roles!='admin'){
        this.$router.push('/')
    }
    this.email = this["auth/getUser"].email;
    this.getAllMessages()
  },
  beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  methods: {
    async getAllMessages() {
      try {
        let response = await quickRequest("/getMessages", "GET",{});
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        }else{
            this.messages=response.messages
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Error occured",
        });
      }
    },
    async deleteMessage(idd, index){
        this.loading=true
      try {
        let response1 = await quickRequest("/deleteMessages", "POST",{id:idd});
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
            this.messages.splice(index,1)
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
    }
  }
  
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>