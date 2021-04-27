<template>
  <div class="auth-container">
    <el-input
      type="text"
      @input="onChangeUsername"
      :model-value="username"
      placeholder="Enter login"
    />
    <el-input
      type="password"
      @input="onChangePassword"
      :model-value="password"
      placeholder="Enter password"
      @keyup.enter="onClickLogin"
    />
    <div class="button-wrapper">
      <el-button @click="onClickLogin" type="primary">Login</el-button>
      <el-button>Sign up</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const onChangeUsername = (value) => {
      username.value = value;
    };

    const onChangePassword = (value) => {
      password.value = value;
    };

    const onClickLogin = async() => {
      const isAuth = await store.dispatch('login', { username: username.value, password: username.value });
      if (isAuth) {
        router.push('/');
      }
    };

    return {
      username,
      password,
      onChangeUsername,
      onChangePassword,
      onClickLogin,
    };
  },
};
</script>

<style lang="scss">
  .auth-container {
    width: 100%;
    max-width: 500px;
    margin: auto;
    height: 200px;
    margin-top: 25vh;

    .el-input {
      margin-bottom: 1rem;
    }

    .button-wrapper {
      text-align: center;
    }
  }
</style>