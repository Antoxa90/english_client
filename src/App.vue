<template>
  <div class="container">
    <Header />
    <div class="content">
      <router-view/>
    </div>
    <error-modal/>
  </div>
</template>

<script>
import ErrorModal from './components/ErrorModal.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Header,
    ErrorModal
  },
  setup() {
  }
};
</script>

<style lang="scss">
  body, html, ul {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1280px;
    margin: auto;

    .content {
      padding: 80px 1rem 1rem;
    }
  }
</style>
