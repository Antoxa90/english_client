<template>
  <div class="header" v-if="isAuth">
    <i class="el-icon-menu menu" @click="toggleMenu"/>
    <Menu v-if="isOpenMenu" />
    <div class="heading">Learning English</div>
    <div class="user">
      <div>Username: {{ username }}</div>
      <div>Role: {{ role }}</div>
    </div>
    <div class="logout">
      <el-button size="mini" @click="onLogout">Logout</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { IS_AUTH } from '../constants/routes';
import { getData } from '../utils/httpUtils';
import { useRouter } from 'vue-router';
import Menu from './Menu.vue';

export default {
  components: { Menu },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuth = ref(false);
    const username = ref('');
    const role = ref('');
    const isOpenMenu = ref(false);
    
    const checkAuth = async (to, from, next) => {
      try {
        const res = await getData(IS_AUTH);
        isAuth.value = !!res.success;
        username.value = res.user ? res.user.username : '';
        role.value = res.user ? res.user.role : '';
        store.commit('SET_AUTH', isAuth.value);
        store.commit('SET_USER', { username: username.value, role: role.value });
        if (to.name !== 'AuthPage' && to.name !== 'SignUpPage' && !isAuth.value) {
          next({ name: 'AuthPage' });
        } else {
          next();
        }
      } catch (error) {
        store.commit('SET_ERROR', error.message);
      }
    };

    router.beforeEach(checkAuth);

    const onLogout = async () => {
      await store.dispatch('logout');
      username.value = '';
      role.value = '';
      isAuth.value = false;
      router.push('/auth');
    };

    const toggleMenu = () => {
      isOpenMenu.value = !isOpenMenu.value;
    };

    return {
      isAuth,
      username,
      role,
      isOpenMenu,
      onLogout,
      toggleMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 60px;
    background-color: teal;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .user {
      margin-right: 2rem;
      color: #fff;
    }

    .logout {
      margin-right: 1rem;
    }

    .heading {
      flex: 1 0 auto;
      font-size: 1.5rem;
      margin-left: 4rem;
      color: #fff;
    }

    .menu {
      margin-left: 1rem;
      font-size: 1.5rem;
      cursor: pointer;
      color: #fff;
    }
  }
</style>