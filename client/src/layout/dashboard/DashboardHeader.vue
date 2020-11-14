<template>
<header class="header-global">
    <headroom>
        <header>
            <base-nav background='background-color:  #e3f2fd;' effect="dark" expand>
                <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                    <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
                </router-link>

                <div class="row" slot="content-header" slot-scope="{closeMenu}">
                    <div class="col-6 collapse-brand">
                        <a href="#">
                            <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
                        </a>
                    </div>
                    <div class="col-6 collapse-close">
                        <close-button @click="closeMenu"></close-button>
                    </div>
                </div>

                <ul class="navbar-nav align-items-lg-center ml-lg-auto">
                    <li v-if="(_self['auth/getUser'].roles!='admin')" class="nav-item pointer">

                        <router-link :to="{path: '/contactUs'}" class="nav-item nav-Text" @click="h6">Contact Us</router-link>

                    </li>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <li v-if="(_self['auth/getUser'].roles!='admin')" class="nav-item pointer">

                        <router-link :to="{path: '/about'}" class="nav-item nav-Text" @click="h6">About</router-link>

                    </li>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <li v-if="(_self['auth/getUser'].roles!='admin')" class="nav-item pointer">

                        <router-link :to="{path: '/faq'}" class="nav-item nav-Text" @click="h6">FAQS</router-link>

                    </li>
                    &nbsp;
                    &nbsp;
                    &nbsp;

                    <li class="nav-item pointer">

                        <router-link :to="{path: '/pricing'}" class="nav-item nav-Text" @click="h6">Pricing</router-link>

                    </li>

                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <li v-if="(_self['auth/isAuthenticated']) && (_self['auth/getUser'].roles=='admin')" class="nav-item pointer">
                        <base-dropdown>
                            <base-button slot="title" type="transparent">
                                Administration
                            </base-button>
                            <router-link class="dropdown-item" to="/users">
                                <i class="ni ni-single-02"></i>
                                <span>All Users</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/messages">
                                <i class="ni ni-email-83"></i>
                                <span>Messages</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/products">
                                <i class="ni ni-basket"></i>
                                <span>Products</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/invoices">
                                <i class="ni ni-badge"></i>
                                <span>Invoices</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/subscriptions">
                                <i class="ni ni-bag-17"></i>
                                <span>Subscritions</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/coupons">
                                <i class="ni ni-key-25"></i>
                                <span>Coupons</span>
                            </router-link>
                        </base-dropdown>
                    </li>

                    &nbsp; &nbsp;
                    <li v-if="!_self['auth/isAuthenticated']" class="nav-item">
                        <b-button size="sm" variant="outline-success" @click="
                      () => {
                        this.$router.push({ name: 'login' });
                      }
                    " class="mb-3 mb-sm-0">
                            <v-icon small color="green lighten-1">
                                mdi-login
                            </v-icon>
                            Login
                        </b-button>
                    </li>&nbsp; &nbsp; &nbsp;

                    <li v-if="_self['auth/isAuthenticated']" class="nav-item">
                        <base-dropdown>
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
                            <router-link class="dropdown-item" to="/exams">
                                <i class="ni ni-single-copy-04"></i>
                                <span>My Exams</span>
                            </router-link>

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
    </headroom>
</header>
</template>

<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import {
    headroom
} from 'vue-headroom'
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
        BaseDropdown,
        headroom
    },
    data() {
        return {
            canViewMessages: false
        }
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"])
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
                let response2 = await quickRequest("/deleteUserSession", "POST", {
                    id: this["auth/getUser"].id
                });
                this['auth/setUser']({});
                localStorage.clear();
                this.$router.push("login");
            } catch (e) {
                console.log("error");
                console.log(e);
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');

.navbar {
    padding: 1rem 1rem;
}

@media screen and (min-width: 989px) {
    .navbar .nav-item {
        color: black;
        padding-top: 8px;

    }

    .nav-Text {
        font-size: 15px;
        font-weight: 700;
        padding: 0 6px;
        min-width: 96;
        font-family: 'PT Sans', sans-serif;
    }
}
</style>
