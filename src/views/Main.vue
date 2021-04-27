<template>
  <div class="main">
    <word-table/>
  </div>
</template>

<script>
import WordTable from '../components/WordTable.vue';

export default {
  name: 'Main',
  components: {
    WordTable
  }
};
</script>
