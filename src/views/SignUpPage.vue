<template>
  <div class="auth-container sign-up-container">
    <el-form :model="signUpForm" ref="signUpForm" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input
          type="text"
          v-model="signUpForm.username"
          placeholder="Enter username"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="signUpForm.password"
          placeholder="Enter password"
        />
      </el-form-item>
      <el-form-item label="Confirm password" prop="confirmPassword">
        <el-input
          type="password"
          v-model="signUpForm.confirmPassword"
          placeholder="Confirm password"
        />
      </el-form-item>
      <div class="button-wrapper">
        <el-button @click="onClickSignUp" type="primary">Sign Up</el-button>
        <el-button>
          <router-link :to="loginUrl" class="button-link">Back to Login</router-link>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { AUTH } from '../constants/routes';

export default {
  data() {
    const usernameValidator = async (rule, value, callback) => {
      try {
        let isError = false;
        await this.$refs.signUpForm.validateField(['password', 'confirmPassword'], (err) => {
          isError = isError || !!err;
        });

        if (!isError) {
          await this.$store.dispatch('signup', { username: value, password: this.signUpForm.password });
          this.$router.push(AUTH);
        }
      } catch (error) {
        callback(new Error(error));
      }
    };

    const confirmPasswordValidator = async (rule, value, callback) => {
      if(value !== this.signUpForm.password) {
        callback(new Error('Passwords should match'));
      }
    };

    return {
      loginUrl: AUTH,
      signUpForm: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' },
          { validator: usernameValidator, trigger: 'submit' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { min: 8, message: 'Length should be 8 or more', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Confirm Password is required', trigger: 'blur' },
          { validator: confirmPasswordValidator, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    async onClickSignUp() {
      try {
        await this.$refs.signUpForm.validate();
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .auth-container.sign-up-container {
    margin-top: 15vh;
  }
</style>