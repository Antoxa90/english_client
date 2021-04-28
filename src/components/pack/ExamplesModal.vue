<template>
  <div class='examples-modal'>
    <el-dialog title="Examples" :modelValue="isVisible" @update:modelValue="updateModal">
      <ul>
        <li v-for="(example, index) of examples" :key="index">
          {{example}}
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onUpdated } from '@vue/runtime-core';

export default {
  props: {
    modalVisible: {
      type: Boolean,
      default: false,
    },
    examples: Array,
  },
  setup(props, { emit }) {
    const isVisible = ref(props.modalVisible);

    onUpdated(() => isVisible.value = props.modalVisible);

    const updateModal = (value) => {
      emit('update:modalVisible', value);
    };

    return {
      isVisible,
      updateModal
    };
  },
};
</script>

<style lang="scss">
  .examples-modal {
    ul {
      li {
        list-style-type: none;
        padding: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
    }

    .el-dialog {
      max-height: 80vh;
      overflow: auto;
    }

    .el-dialog__body {
      word-break: initial;
      text-align: start;
      padding-top: 1rem;
    }
  }
</style>