import { USER_ROLE } from '../constants/common';
import { LOGIN, LOGOUT, SIGNUP } from '../constants/routes';
import { getData, postData } from '../utils/httpUtils';

export default {
  state: {
    isAuth: false,
    username: null,
    role: USER_ROLE['user'],
  },
  mutations: {
    SET_AUTH(state, isAuth) {
      state.isAuth = isAuth;
    },
    SET_USER(state, data) {
      state.username = data.username;
      state.role = USER_ROLE[data.role];
    }
  },
  actions: {
    async login({ commit }, user) {
      try {
        const res = await postData(LOGIN, user);
        if (res.user) {
          commit('SET_USER', res.user);
          commit('SET_AUTH', true);
          return true;
        } else {
          throw new Error(JSON.stringify(res));
        }
      }
      catch(error) {
        commit('SET_ERROR', error.message);
        commit('SET_USER', {});
        commit('SET_AUTH', false);
        throw new Error(error.message);
      }
    },
    async logout({ commit }) {
      try {
        await getData(LOGOUT);
        commit('SET_USER', {});
        commit('SET_AUTH', false);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    async signup({ commit }, user) {
      try {
        const userData = await postData(SIGNUP, user);
        console.log(userData);
        commit('SET_USER', userData);
        commit('SET_AUTH', true);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw new Error(error.message);
      }
    }
  }
};