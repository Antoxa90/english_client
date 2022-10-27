<template>
  <div class="verb-item-wrapper">
    <div v-if="isInput" class="input-item-wrapper">
      <div class="label" v-if="label">{{label}}</div>
      <el-input
        :modelValue="verb"
        :placeholder="placeholder"
        @input="onVerbChange"
        :class="{'input-item': true, 'is-valid': showResult && isValid, 'is-invalid': showResult && !isValid}"
      ></el-input>
      <div class="result" v-if="showResult">
        <i class="el-icon-check" v-if="isValid" />
        <i class="el-icon-close" v-else />
        {{result}}
      </div>
    </div>
    <div v-else>{{verb}}</div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onUpdated } from '@vue/runtime-core';
export default {
  props: {
    verb: {
      type: String,
      required: true,
    },
    isInput: {
      type: Boolean,
      required: false,
    },
    label: String,
    result: String,
    placeholder: String,
    showResult: Boolean,
  },
  setup(props, { emit }) {
    const isValid = ref(props.verb === props.result);

    onUpdated(() => {
      isValid.value = props.verb === props.result;
    });

    const onVerbChange = (value) => {
      emit('input:verb', value);
    };

    return {
      isValid,
      onVerbChange,
    };
  },
};
</script>

<style lang="scss">
.input-item-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 10px;
  align-items: center;

  .input-item {
    max-width: 100%;

    &.is-valid > input {
      border: 1px solid #3b980d;
    }

    &.is-invalid > input {
      border: 1px solid #c91616;
    }
  }

  .el-icon-check {
    color: #3b980d;
    font-size: 1.2rem;
  }

  .el-icon-close {
    color: #c91616;
    font-size: 1.2rem;
  }
}
</style>