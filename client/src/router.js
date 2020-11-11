import Vue from "vue";
import Router from "vue-router";
import LandingHeader from "./layout/landing/LandingHeader";
import LandingFooter from "./layout/landing/LandingFooter";
import DashboardHeader from "./layout/dashboard/DashboardHeader";
import DashboardFooter from "./layout/dashboard/DashboardFooter";
import LoginHeader from "./layout/login/LoginHeader";
import RegisterHeader from "./layout/register/RegisterHeader";
import ExamsHeader from "./layout/exams/ExamsHeader";
import StartHeader from "./layout/startexam/startHeader";
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
import Evaluation from './components/Exams/Evaluation.vue';
import About from './views/NewComponents/about.vue';
import Faqs from './views/NewComponents/faq.vue';
import ContactUs from './views/NewComponents/contactUs.vue';
import ViewMessage from './views/NewComponents/viewAllMessages.vue';
import ViewUsers from './views/NewComponents/viewAllUsers.vue';

import CreateProducts from './views/NewComponents/createProduct.vue';
import ViewProducts from './views/NewComponents/products.vue';
import ViewInvoices from './views/NewComponents/invoices.vue';
import ViewSubscription from './views/NewComponents/subscriptions.vue';
import ViewCoupon from './views/NewComponents/coupen.vue';
import verifyTokenEmail from './views/NewComponents/verifyEmailS.vue';

import CreateUser from './views/NewComponents/createUser.vue';
import UpdateUserByadmin from './views/NewComponents/editUserByAdmin.vue'
Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
  
     
  
    {
      path: "/",
      name: "landing",
      components: {
        header: DashboardHeader,
        default: Landing,
        footer: DashboardFooter,
      },
     // beforeEnter: Guards.isNotAuthenticated,
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
        header: DashboardHeader,
        default: Profile,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isUserOrAdmin,
    },
    {
      path: "/messages",
      name: "messages",
      components: {
        header: DashboardHeader,
        default: ViewMessage,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/products",
      name: "product",
      components: {
        header: DashboardHeader,
        default: ViewProducts,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/createProducts",
      name: "createproduct",
      components: {
        header: DashboardHeader,
        default: CreateProducts,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/invoices",
      name: "invoice",
      components: {
        header: DashboardHeader,
        default: ViewInvoices,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/coupons",
      name: "coupon",
      components: {
        header: DashboardHeader,
        default: ViewCoupon,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/verify-password/:token",
      name: "verifyEmailToken",
      components: {
        default: verifyTokenEmail,
      },
    },
    {
      path: "/subscriptions",
      name: "subscription",
      components: {
        header: DashboardHeader,
        default: ViewSubscription,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    
    {
      path: "/users",
      name: "users",
      components: {
        header: DashboardHeader,
        default: ViewUsers,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/create_User",
      name: "createUser",
      components: {
        header: DashboardHeader,
        default: CreateUser,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
    },
    {
      path: "/update_User/:id",
      name: "editUserByAdmin",
      components: {
        header: DashboardHeader,
        default: UpdateUserByadmin,
        footer: DashboardFooter,
      },
      beforeEnter: Guards.isAdmin,
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
        header: ExamsHeader,
        default: Exams,
       
        
      },
    },
    {
      path: "/single",
      name: "Single",
      components: {
        header: DashboardHeader,
        default: SingleType,   
        footer: DashboardFooter,

      },
    },
    {
      path: "/about",
      name: "About",
      components: {
        header: DashboardHeader,
        default: About,
        footer: DashboardFooter,
      },
    },
    {
      path: "/faq",
      name: "Faq",
      components: {
        header: DashboardHeader,
        default: Faqs,
        footer: DashboardFooter,
      },
    },
    {
      path: "/contactUs",
      name: "ContactUs",
      components: {
        header: DashboardHeader,
        default: ContactUs,
        footer: DashboardFooter,
      },
    },
    {
      path: "/multiple",
      name: "Multiple",
      components: {
        default: Multiple,
        header: DashboardHeader,
        footer: DashboardFooter,
      },
    },
    {
      path: "/fillInTheBlank",
      name: "FillInTheBlank",
      components: {
        default: FillInTheBlank,
        header: DashboardHeader,
        footer: DashboardFooter,
      },
    },
    {
      path: "/hotarea",
      name: "HotArea",
      components: {
        default: HotArea,
        header: DashboardHeader,
        footer: DashboardFooter,
      },
    },
    {
      path: "/drag",
      name: "DragAndDrop",
      components: {
        default: DragAndDrop,
        header: DashboardHeader,
        footer: DashboardFooter,
      },
    },

    {
      path: "/main",
      name: "main",
     
      components: {
        default: Main,
        header: StartHeader,               
        footer: DashboardFooter,

      },
    },
    {
      path: "/viewexam",
      name: "viewExam",
      components: {
        default: ViewExam,
        header: DashboardHeader,
        footer: DashboardFooter,
      },
    },
    {
      path: "/Evaluation",
      name: "Evaluation",
      components: {
        default: Evaluation,
        header: ExamsHeader,
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
