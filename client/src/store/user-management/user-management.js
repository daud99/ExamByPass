import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import * as state from './state';

Vue.use(Vuex);

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}