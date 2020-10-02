<template>
   <header class="header-global">
        <base-nav class="navbar navbar-horizontal navbar-expand-lg navbar-dark bg-primary border-bottom" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/white.png" alt="logo">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="img/brand/blue.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <ul class="navbar-nav align-items-lg-center ml-lg-auto">
                <li class="nav-item pointer">
                  <h6 
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong>About</strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                <li class="nav-item pointer">
                  <h6
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong>Help</strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                <li class="nav-item pointer">
                  <h6
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong><router-link :to="{path: '/login'}">Pricing</router-link></strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                <li class="nav-item">
                   <base-dropdown >
                      <base-button slot="title" type="secondary" icon="fa fa-user">
                        Daud
                      </base-button>
                       <a href="#!" class="dropdown-item">
                        <i class="ni ni-single-02"></i>
                        <span>My Account</span>
                      </a>
                      <!-- <a href="#!" class="dropdown-item">
                        <i class="ni ni-settings-gear-65"></i>
                        <span>Settings</span>
                      </a> -->
                      <a href="#!" class="dropdown-item">
                        <i class="ni ni-single-copy-04"></i>
                        <span>My Exams</span>
                      </a>
                      <a href="#!" class="dropdown-item">
                        <i class="ni ni-lock-circle-open"></i>
                        <span>Change Password</span>
                      </a>
                      <div class="dropdown-divider"></div>
                      <a href="#!" class="dropdown-item" @click="logout">
                        <i class="ni ni-user-run"></i>
                        <span>Logout</span>
                      </a>
                    </base-dropdown>
                    

                </li>
            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import {quickRequest} from "../../../common/misc";
import {mapActions} from 'vuex';

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  },
  methods: {
     ...mapActions([
      'auth/setUser'
    ]),
    scrollToElement() {
      let element_id = document.getElementById("pricingSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    h6() {
      this.scrollToElement()
    },
    async logout() {
      try {
        console.log("going to send request");
        console.log(quickRequest);
        let response = await quickRequest("/api/login/logout", "POST", {});
        this['auth/setUser']({});
        localStorage.clear();
        this.$router.push("login");
      } 
      catch(e) {
        console.log("error");
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  padding: 1rem 1rem;
}
</style>
