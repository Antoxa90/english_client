<template>
  <div class="modal-container">
    <el-dialog title="Error" :modelValue="isVisible" @update:modelValue="updateModal">
      {{ message }}
    </el-dialog>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { onBeforeUnmount } from '@vue/runtime-core';

export default {
  setup() {
    const store = useStore();
    const message = ref('');
    const isVisible = ref(false);

    const updateModal = () => {
      store.commit('SET_ERROR', '');
    };

    const unsubscribe = store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_ERROR') {
        message.value = state.errorMessage;
        isVisible.value = state.isOpenErrorModal;
      }
    });

    onBeforeUnmount(unsubscribe);

    return {
      isVisible,
      message,
      updateModal,
    };
  },
};
</script>