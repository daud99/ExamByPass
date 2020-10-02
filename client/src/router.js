import Vue from "vue";
import Router from "vue-router";
import LandingHeader from "./layout/landing/LandingHeader";
import LandingFooter from "./layout/landing/LandingFooter";
import DashboardHeader from "./layout/dashboard/DashboardHeader";
import DashboardFooter from "./layout/dashboard/DashboardFooter";
import LoginHeader from "./layout/login/LoginHeader"
import RegisterHeader from "./layout/register/RegisterHeader"
import Landing from "./views/landing/Landing.vue";
import Login from "./views/login/Login.vue";
import Register from "./views/register/Register.vue";
import Forget from "./views/forgetPassword/Forget-Password.vue";
import Profile from "./views/profile/Profile.vue";
import Dashboard from "./views/dashboard/dashboard.vue";
import Guards from './guards.js';


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
      },
      beforeEnter: Guards.isNotAuthenticated
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: LoginHeader,
        default: Login
      },
      beforeEnter: Guards.isNotAuthenticated
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: RegisterHeader,
        default: Register
      },
      beforeEnter: Guards.isNotAuthenticated
    },
    {
      path: "/forget",
      name: "forget",
      components: {
        header: LoginHeader,
        default: Forget
      },
      beforeEnter: Guards.isNotAuthenticated
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        header: LandingHeader,
        default: Profile,
        footer: LandingFooter
      },
      beforeEnter: Guards.isUserOrAdmin
    },
    {
      path: "/dashboard",
      name: "dashboard",
      components: {
        header: DashboardHeader,
        default: Dashboard,
        footer: DashboardFooter
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

