import Vue from 'vue'
import VueRouter from 'vue-router'
import SingleType from '../components/questionTypes/Single.vue'
import Multiple from '../components/questionTypes/Multiple.vue'
import FillInTheBlank from '../components/questionTypes/FillInTheBlank.vue'
import HotArea from '../components/questionTypes/HotArea.vue'
import DragAndDrop from '../components/questionTypes/DragAndDrop.vue'
import Main from '../components/questionTypes/Main.vue'
import LandingHeader from "../layout/landing/LandingHeader";
import LandingFooter from "../layout/landing/LandingFooter";
import LoginHeader from "../layout/login/LoginHeader"
import RegisterHeader from "../layout/register/RegisterHeader"
import Landing from "../views/landing/Landing.vue";
import Login from "../views/login/Login.vue";
import Register from "../views/register/Register.vue";
import Forget from "../views/forgetPassword/Forget-Password.vue";
import Profile from "../views/profile/Profile.vue";

Vue.use(VueRouter)

  const routes = [
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
    },
  {
    path: '/single',
    name: 'Single',
    component: SingleType
  },
  {
    path: '/multiple',
    name: 'Multiple',
    component: Multiple
  },
  {
    path: '/fillInTheBlank',
    name: 'FillInTheBlank',
    component: FillInTheBlank
  },
  {
    path: '/hotarea',
    name: 'HotArea',
    component: HotArea
  },
  {
    path: '/drag',
    name: 'DragAndDrop',
    component: DragAndDrop
  },
  
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
