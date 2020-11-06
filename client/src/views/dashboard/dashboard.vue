<template>
   <core-content :loading="loading">
     <div class="header bg-primary pb-6">
      <div class="container-fluid">
        <div class="header-body">
          <div class="row align-items-center py-4">
            
          </div>
       
        </div>
      </div>
    </div>
 </core-content>
</template>
<script>

import {mapActions, mapGetters} from 'vuex';
import {quickRequest} from "../../../common/misc";
import PageMixin from "../page-mixin";
import Swal from "sweetalert2";

export default {
  name: "dashboard",
  mixins: [PageMixin],
  computed: {
    ...mapGetters([
      'auth/getUser'
    ])
  },
  async created() {
    let response = {};
    if(!(localStorage.getItem("email"))) {
      await this.getCurrentUser();
      response = this['auth/getUser'];
      if(Object.keys(response).length === 0 && response.constructor === Object) {
        this.$router.push("login");
      } else {
        localStorage.setItem("email", response.email);
        localStorage.setItem("firstName", response.firstName);
        localStorage.setItem("lastName", response.lastName);
        localStorage.setItem("id", response.id);
        localStorage.setItem("roles", response.roles);
        localStorage.setItem("uuid", response.uuid);
        localStorage.setItem("subscription_status", response.subscription_status); 
        localStorage.setItem("auth_type", response.auth_type); 
      }
      if(localStorage.getItem("redirectToPricing")) this.$router.push("pricing");
    } else if(localStorage.getItem("redirectToPricing")) {
      this.$router.push("pricing");
    }
  },
  methods: {
    ...mapActions([
      'auth/setUser'
    ]),
    async getCurrentUser() {
      try {
        let response = await quickRequest("/auth/get-user", "POST", {});
        if(response.error) {
           Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
          this.$router.push("login");
        } else {
          this['auth/setUser'](response);          
        }
      } 
      catch(e) {
        console.log("error");
        console.log(e);
      }
    }
  }
};
</script>
