<template>
 <div>
     <div class="header bg-primary pb-6">
      <div class="container-fluid">
        <div class="header-body">
          <div class="row align-items-center py-4">
            
          </div>
       
        </div>
      </div>
    </div>
 </div>
</template>
<script>

import {mapActions, mapGetters} from 'vuex';
import {quickRequest} from "../../../common/misc";

export default {
  name: "dashboard",
  components: {
    
  },
  computed: {
    ...mapGetters([
      'auth/getUser'
    ])
  },
  async created() {
    // this.getCurrentUser();
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
      }
    }
  },
  methods: {
    ...mapActions([
      'auth/setUser'
    ]),
    async getCurrentUser() {
      try {
        let response = await quickRequest("/api/auth/get-user", "POST", {});
        this['auth/setUser'](response);
      } 
      catch(e) {
        console.log("error");
        console.log(e);
      }
    }
  }
};
</script>
