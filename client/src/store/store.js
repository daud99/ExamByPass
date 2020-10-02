import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// Modules
import auth from './auth/auth';

Vue.prototype.$user = {};
Vue.use(Vuex);

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    auth
  }
});