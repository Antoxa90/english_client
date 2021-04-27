<template>
  <div class="container">
    <Header />
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Header
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
