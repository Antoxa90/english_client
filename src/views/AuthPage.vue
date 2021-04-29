<template>
  <div class="auth-container">
    <el-form :model="authForm" :rules="rules" ref="authForm">
      <el-form-item label="Username" prop="username">
        <el-input
          type="text"
          v-model="authForm.username"
          placeholder="Enter username"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="authForm.password"
          placeholder="Enter password"
          @keyup.enter="onClickLogin"
        />
      </el-form-item>
      <div class="button-wrapper">
        <el-button @click="onClickLogin" type="primary">Login</el-button>
        <el-button>
          <router-link :to="signUpUrl" class="button-link">Sign up</router-link>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { SIGN_UP } from '../constants/routes';

export default {
  data() {
    const usernameValidator = async (rule, value, callback) => {
      try {
        const isAuth = await this.$store.dispatch('login', { username: value, password: this.authForm.password });
        if (isAuth) {
          this.$router.push('/');
        }
      } catch (error) {
        callback(new Error('Invalid username or password'));
      }
    };

    return {
      signUpUrl: SIGN_UP,
      authForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' },
          { validator: usernameValidator, trigger: 'submit' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    async onClickLogin() {
      try {
        await this.$refs.authForm.validate();
      } catch (error) {
        console.log(error);
      }
    },
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

    .button-wrapper {
      text-align: center;
    }

    .button-link {
      text-decoration: none;
      color: #606266;
    }
  }
</style>