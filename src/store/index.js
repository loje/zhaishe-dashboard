import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
  },
  mutations: {
    mutationsUser(state, data) {
      state.user = data;
    },
  },
  actions: {
    getUser({commit}, data) {
      commit('mutationsUser', data);
    },
  },
  modules: {
  }
})
