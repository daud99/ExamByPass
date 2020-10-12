<template>
<div>
  <div class="dark-drop" v-show="fullView"></div>
  <router-view name="header"></router-view>
  <v-app>
    <v-main>
      <router-view :fullView.sync="fullView"/>
    </v-main>
  </v-app>
  <router-view name="footer"></router-view>
</div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import {quickRequest} from "../common/misc";
import {mapActions, mapGetters} from 'vuex';

export default {
  components: {
    FadeTransition
  },
   computed: {
    ...mapGetters([
      'auth/getUser'
    ])
  },
  created() {
    this.tryAutoLogin();
  },
  methods: {
     ...mapActions([
      'auth/setUser'
    ]),
    tryAutoLogin() {
      const email = localStorage.getItem('email');
      if(!email){
        return
      }
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      const id = localStorage.getItem('id');
      const roles = localStorage.getItem('roles');
      const uuid = localStorage.getItem('uuid');
      const auth_type = localStorage.getItem('auth_type');
      const subscription_status = localStorage.getItem('subscription_status');
      const user = {
        firstName,
        lastName,
        id,
        roles,
        uuid,
        email,
        subscription_status,
        auth_type
      }
      this['auth/setUser'](user);
    }
  },
  data: function() {
      return {
          fullView: false,
      };
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
.dark-drop {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #031321;
    z-index: -1;
}
.preloader-block {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: 1040;
    background: rgba(255,255,255,0.5);
    width: 100%;
    height: 100%;
    display: none;
}
</style>
