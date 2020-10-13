<template>
   <header class="header-global">
    <base-nav type="default" effect="dark" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/ExamByPass.png" width="150" height="100">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="#">
                        <img src="img/brand/ExamByPass.png" width="150" height="100">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>
        </div>

            <ul class="navbar-nav align-items-lg-center ml-lg-auto">
                <li class="nav-item pointer">
                  <h6 
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong><router-link :to="{path: '/contactUs'}" class="nav-item">Contact Us</router-link></strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                <li class="nav-item pointer">
                  <h6 
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong><router-link :to="{path: '/about'}" class="nav-item">About</router-link></strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                <li class="nav-item pointer">
                  <h6 
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong><router-link :to="{path: '/faq'}" class="nav-item">FAQS</router-link></strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;

                <li class="nav-item pointer">
                  <h6
                    style="color: white; padding-top: 10px;"
                    @click="h6"
                  ><strong><router-link :to="{path: '/pricing'}" class="nav-item">Pricing</router-link></strong></h6>
                </li>
                &nbsp;
                &nbsp;
                &nbsp;
                

                <li v-if="!_self['auth/isAuthenticated']" class="nav-item pointer">
                  <h6 style="color: white; padding-top: 10px" @click="h6">
                    <strong>EDITOR</strong>
                  </h6>
                </li>
                &nbsp; &nbsp; &nbsp;
                <li v-if="!_self['auth/isAuthenticated']" class="nav-item">
                  <base-button
                    tag="a"
                    @click="
                      () => {
                        this.$router.push({ name: 'login' });
                      }
                    "
                    class="mb-3 mb-sm-0"
                    icon="fa fa-sign-in"
                  >
                    Login
                  </base-button>
                </li>&nbsp; &nbsp; &nbsp;


                <li v-if="_self['auth/isAuthenticated']" class="nav-item">
                   <base-dropdown >
                      <base-button slot="title" type="secondary" icon="fa fa-user">
                        {{
                          _self["auth/getUser"].email
                          }}
                    </base-button>
                    <router-link class="dropdown-item" to="/account">
                        <i class="ni ni-single-02"></i>
                        <span>My Account</span>
                    </router-link>

                    <!-- <a href="#!" class="dropdown-item">
                        <i class="ni ni-settings-gear-65"></i>
                        <span>Settings</span>
                      </a> -->
                    <a href="#!" class="dropdown-item">
                        <i class="ni ni-single-copy-04"></i>
                        <span>My Exams</span>
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
import {
    quickRequest
} from "../../../common/misc";
import {
    mapActions,
    mapGetters
} from 'vuex';

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  },
  // data() {
  //   return {
  //     user: {}
  //   }
  // },
  computed: {
    ...mapGetters(["auth/getUser"]),
    ...mapGetters(["auth/isAuthenticated"]),
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
    // data() {
    //   return {
    //     user: {}
    //   }
    // },
    computed: {
        ...mapGetters(["auth/getUser"]),
    },
    methods: {
        ...mapActions([
            'auth/setUser'
        ]),
        scrollToElement() {
            let element_id = document.getElementById("pricingSection");
            if (element_id) {
                element_id.scrollIntoView({
                    block: "end",
                    behavior: "smooth"
                });
            }
        },
        h6() {
            this.scrollToElement()
        },
        async logout() {
            try {
                let response = await quickRequest("/login/logout", "POST", {});
                this['auth/setUser']({});
                localStorage.clear();
                this.$router.push("login");
            } catch (e) {
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

@media screen and (min-width: 989px) {
    .navbar .nav-item {
        color: white;
        padding-top: 10px;
        font-weight: bolder;
    }
}
</style>
