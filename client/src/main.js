/*!

=========================================================
* Vue Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import Vuelidate from "vuelidate";
import './registerServiceWorker'
import axios from "./axios.js";
import { store } from './store/store';
import vuetify from './plugins/vuetify';
import CoreContent from './components/Core-content';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
 //import 'bootstrap/dist/css/bootstrap.css'
 import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(Argon);
Vue.use(Vuelidate);
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.component('core-content', CoreContent)
const EventBus = new Vue()
Vue.prototype.$bus = EventBus;
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
