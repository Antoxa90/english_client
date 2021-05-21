import { createStore } from 'vuex';
import auth from './auth';

const store = createStore({
  state: {
    errorMessage: '',
    isOpenErrorModal: false,
  },
  mutations: {
    SET_ERROR(state, message) {
      state.errorMessage = message;
      state.isOpenErrorModal = !!message;
    }
  },
  modules: {
    user: auth
  }
});

export default store;