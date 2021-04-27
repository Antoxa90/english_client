<template>
  <div v-if="!isAuth">
    <Authorization />
  </div>
</template>

<script>
import { ref } from 'vue';
import Authorization from '../components/Authorization.vue';

export default {
  components: { Authorization },
  setup() {
    const isAuth = ref(false);

    return {
      isAuth,
    };
  },
};
</script>