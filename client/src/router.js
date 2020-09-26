import Vue from "vue";
import Router from "vue-router";
import LandingHeader from "./layout/landing/LandingHeader";
import LandingFooter from "./layout/landing/LandingFooter";
import LoginHeader from "./layout/login/LoginHeader"
import RegisterHeader from "./layout/register/RegisterHeader"
import Landing from "./views/landing/Landing.vue";
import Login from "./views/login/Login.vue";
import Register from "./views/register/Register.vue";
import Forget from "./views/forgetPassword/Forget-Password.vue";
import Profile from "./views/profile/Profile.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "components",
      components: {
        header: LandingHeader,
        default: Landing,
        footer: LandingFooter
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: LoginHeader,
        default: Login
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: RegisterHeader,
        default: Register
      }
    },
    {
      path: "/forget",
      name: "forget",
      components: {
        header: LoginHeader,
        default: Forget
      }
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        header: LandingHeader,
        default: Profile,
        footer: LandingFooter
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
