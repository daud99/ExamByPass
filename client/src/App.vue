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
      const user = {
        firstName,
        lastName,
        id,
        roles,
        uuid
      }
      this['auth/setUser'](user);
    }
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
