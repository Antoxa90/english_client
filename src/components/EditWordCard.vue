<template>
  <div class="edit-word-container">
    <el-input
      type="text"
      @input="onDefinitionChange"
      :modelValue="newDefinition"
    />
    <ul>
      <li class="item-wrapper" v-for="(example, index) of newExamples" :key="index">
        <el-input
          type="text"
          @input="onChangeExample($event, index)"
          :modelValue="example"
          @blur="updateWordCard"
        />
        <el-button @click="onDeleteExample(index)">Delete</el-button>
      </li>
      <li class="item-wrapper">
        <el-input
          type="text"
          @input="onAddExampleChange"
          :model-value="additionalExample"
          placeholder="Enter a new example..."
        />
        <el-button @click="onAddExample">Add</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';
import { putData } from '../utils/httpUtils';
import { GET_WORDS } from '../constants/routes';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: false,
    },
    examples: {
      type: Array,
      required: false,
    }
  },
  setup(props) {
    const definition = ref(props.definition);
    const examples = ref(props.examples);
    const additionalExample = ref('');

    const updateWordCard = async () => {
      const data = {
        definition: definition.value,
        examples: examples.value,
      };
      await putData(`${GET_WORDS}/${props.id}`, data);
    };

    const onDefinitionChange = (value) => {
      definition.value = value;
      updateWordCard();
    };

    const onChangeExample = (value, index) => {
      examples.value[index] = value;
    };

    const onDeleteExample = (index) => {
      const newExamples = [...examples.value];
      newExamples.splice(index, 1);
      examples.value = [...newExamples];
      updateWordCard();
    };

    const onAddExample = () => {
      examples.value = examples.value.concat(additionalExample.value);
      additionalExample.value = '';
      updateWordCard();
    };

    const onAddExampleChange = (value) => {
      additionalExample.value = value;
    };

    return {
      newDefinition: definition,
      newExamples: examples,
      additionalExample,
      onDefinitionChange,
      onChangeExample,
      onDeleteExample,
      onAddExample,
      onAddExampleChange,
      updateWordCard,
    };
  },
};
</script>

<style lang="scss" scoped>
  .edit-word-container {
    ul {
      padding-left: 2rem;
      margin-top: 1rem;
    }
  }

  .item-wrapper {
    display: flex;
    margin-bottom: 0.5rem;

    > button {
      margin-left: 1rem;
    }
  }
</style>