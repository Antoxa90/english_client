<template>
  <div class="word-card-container">
    <el-button 
      size="mini" 
      icon="el-icon-back" 
      class="back-button"
      @click="onBack"
    >
      Back
    </el-button>
    <div class="heading">{{ item.word && item.word.toUpperCase() }} ({{ item.type }})</div>
    <div class="info-wrapper" v-if="!editMode">
      <div class="definition">- {{ item.definition }}</div>
      <ul>
        <li class="item-wrapper" v-for="(example, index) of item.examples" :key="index">
          {{ example }}
        </li>
      </ul>
    </div>
    <div v-if="editMode && isAdmin">
      <edit-word-card
        :id="id"
        :definition="item.definition"
        :examples="item.examples"
      />
    </div>
    <div class="button-container">
      <el-button @click="toggleEditMode" v-if="!editMode && isAdmin">Edit</el-button>
      <el-button v-if="editMode" @click="onCancel">Cancel</el-button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GET_WORDS } from '../constants/routes';
import { getData } from '../utils/httpUtils';
import EditWordCard from './EditWordCard.vue';
import { useStore } from 'vuex';
import { USER_ROLE } from '../constants/common';

export default {
  components: { EditWordCard },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const item = ref({});
    const editMode = ref(false);

    const getWordById = async () => {
      item.value = await getData(`${GET_WORDS}/${route.params.id}`);
    };

    onMounted(getWordById);

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const onCancel = () => {
      getWordById();
      toggleEditMode();
    };

    const onBack = () => {
      router.back();
    };

    return {
      isAdmin: store.state.user.role === USER_ROLE['admin'],
      id: route.params.id,
      item,
      editMode,
      getWordById,
      toggleEditMode,
      onCancel,
      onBack,
    };
  },
};
</script>

<style lang="scss" scoped>
  .word-card-container {
    .heading {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .definition {
      font-style: italic;
    }

    .item-wrapper {
      margin-bottom: 1rem;
    }

    .back-button {
      margin-bottom: 0.5rem;
    }

    ul {
      padding-left: 2rem;
      margin-top: 1rem;
    }
  }
</style>