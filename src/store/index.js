import { createStore } from 'vuex';
import auth from './auth';

const store = createStore({
  state: {
    error: {}
  },
  mutations: {
    SET_ERROR(state, data) {
      state.error = data;
    }
  },
  modules: {
    user: auth
  }
});

export default store;