<template>
    <div id="app">
        <router-view name="header"></router-view>
        <main>
            <fade-transition origin="center" mode="out-in" :duration="250">
                <router-view/>
            </fade-transition>
        </main>
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
    console.log("calling tryAutoLogin");
    this.tryAutoLogin();
    console.log("returning from created in App.vue");
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
      const user = {
        firstName,
        lastName,
        id,
        roles,
        uuid
      }
      console.log("On login we are setting up the user data in vuex");
      this['auth/setUser'](user);
      console.log("let's see is it even getting store on not on vuex");
       console.log(this['auth/getUser']);
      // this.$user = user;
      // console.log("this.$user below in app.vue");
      // console.log(this.$user);
    }
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
