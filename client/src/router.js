import Vue from "vue";
import Router from "vue-router";
import LandingHeader from "./layout/landing/LandingHeader";
import LandingFooter from "./layout/landing/LandingFooter";
import DashboardHeader from "./layout/dashboard/DashboardHeader";
import DashboardFooter from "./layout/dashboard/DashboardFooter";
import LoginHeader from "./layout/login/LoginHeader";
import RegisterHeader from "./layout/register/RegisterHeader";
import Landing from "./views/landing/Landing.vue";
import Login from "./views/login/Login.vue";
import Register from "./views/register/Register.vue";
import Forget from "./views/forgetPassword/Forget-Password.vue";
import Reset from "./views/resetPassword/Reset-Password.vue";
import Profile from "./views/profile/Profile.vue";
import Dashboard from "./views/dashboard/dashboard.vue";
import Guards from "./guards.js";
import Exams from "./components/Exams/Exams.vue";
import SingleType from "./components/questionTypes/Single.vue";
import Multiple from "./components/questionTypes/Multiple.vue";
import FillInTheBlank from "./components/questionTypes/FillInTheBlank.vue";
import HotArea from "./components/questionTypes/HotArea.vue";
import DragAndDrop from "./components/questionTypes/DragAndDrop.vue";
import Main from "./components/questionTypes/Main.vue";
import Account from "./views/account/account.vue";
import ChangePassword from './views/account/changePassword.vue';
import StripeCheckout from './views/stripeCheckout/Stripe-Checkout.vue';
import Pricing from  './views/pricing/Pricing-Page.vue';
import ViewExam from './components/Exams/viewExam.vue';
import About from './views/NewComponents/about.vue';
import Faqs from './views/NewComponents/faq.vue';
import ContactUs from './views/NewComponents/contactUs.vue'
Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
  
     
  
    {
      path: "/",
      name: "landing",
      components: {
        header: LandingHeader,
        default: Landing,
        footer: LandingFooter,
      },
      beforeEnter: Guards.isNotAuthenticated,
    },
    {
      path: "/pricing",
      name: "pricing",
      components: {
        header: DashboardHeader,
        default: Pricing,
        footer: DashboardFooter
      },
      beforeEnter: Guards.isUserOrAdmin,
    },
    {
      path: "/checkout",
      name: "checkout",
      components: {
        default: StripeCheckout,
      }   
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: LoginHeader,
        default: Login,
      },
      beforeEnter: Guards.isNotAuthenticated,
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: RegisterHeader,
        default: Register,
      },
      beforeEnter: Guards.isNotAuthenticated,
    },
    {
      path: "/reset-password",
      name: "reset",
      components: {
        header: RegisterHeader,
        default: Reset
      }
    },
    {
      path: "/forget",
      name: "forget",
      components: {
        header: LoginHeader,
        default: Forget,
      },
      beforeEnter: Guards.isNotAuthenticated,
    },
    {
      path: "/account",
      name: "account",
      components: {
        header: DashboardHeader,
        default: Account,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isUserOrAdmin,
    },
    {
      path: "/changePassword",
      name: "changepassword",
      components: {
        header: DashboardHeader,
        default: ChangePassword,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isUserOrAdmin,
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        header: LandingHeader,
        default: Profile,
        footer: LandingFooter,
      },
      beforeEnter: Guards.isUserOrAdmin,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      components: {
        header: DashboardHeader,
        default: Dashboard,
        footer: DashboardFooter,
      },
    },
     {
      path: "/exams",
      name: "exams",
      components: {
        header: LandingHeader,
        default: Exams,
        footer: LandingFooter,
        
      },
    },
    {
      path: "/single",
      name: "Single",
      components: {
        header: LandingHeader,
        default: SingleType,
        footer: LandingFooter,
      },
    },
    {
      path: "/about",
      name: "About",
      components: {
        header: LandingHeader,
        default: About,
        footer: LandingFooter,
      },
    },
    {
      path: "/faq",
      name: "Faq",
      components: {
        header: LandingHeader,
        default: Faqs,
        footer: LandingFooter,
      },
    },
    {
      path: "/contactUs",
      name: "ContactUs",
      components: {
        header: LandingHeader,
        default: ContactUs,
        footer: LandingFooter,
      },
    },
    {
      path: "/multiple",
      name: "Multiple",
      components: {
        default: Multiple,
        header: LandingHeader,
        footer: LandingFooter,
      },
    },
    {
      path: "/fillInTheBlank",
      name: "FillInTheBlank",
      components: {
        default: FillInTheBlank,
        header: LandingHeader,
        footer: LandingFooter,
      },
    },
    {
      path: "/hotarea",
      name: "HotArea",
      components: {
        default: HotArea,
        header: LandingHeader,
        footer: LandingFooter,
      },
    },
    {
      path: "/drag",
      name: "DragAndDrop",
      components: {
        default: DragAndDrop,
        header: LandingHeader,
        footer: LandingFooter,
      },
    },

    {
      path: "/main",
      name: "main",
     
      components: {
        default: Main,
        header: LandingHeader,
        footer: LandingFooter,
     
      },
    },
    {
      path: "/viewexam",
      name: "viewExam",
      components: {
        default: ViewExam,
        header: LandingHeader,
        footer: LandingFooter,
      },
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});
