<template>
  <div class='table-container'>
    <div class="wrapper">
      <el-input
        placeholder="Search..." 
        v-model="search"
        @input="searchChange"
        clearable
      ></el-input>
      <el-button :disabled="!search" @click="addWord">Add</el-button>
    </div>
    <el-table :data="words">
      <el-table-column type="index" label="№"/>
      <el-table-column prop="word" label="Word">
        <template v-slot:default="item">
          <router-link :to="/cards/ + item.row.id" tag="span" class="word-link">
            {{ item.row.word }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type"/>
      <el-table-column>
        <template #default="scope">
          <el-button @click="deleteWord(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="+pagination.page"
      :page-count="pagination.total"
      layout="prev, pager, next"
      @current-change="getWords($event, pagination.limit, search)"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { CARDS, GET_WORD, GET_WORDS } from '../constants/routes';
import { deleteData, getData, postData } from '../utils/httpUtils';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const words = ref([]);
    const pagination = ref({});
    const search = ref('');
    const router = useRouter();

    const getWords = async (page, limit = 10, search = '') => {
      sessionStorage.setItem('page', page);
      sessionStorage.setItem('limit', limit);

      const url = `${GET_WORDS}?page=${page}&limit=${limit}${search ? `&search=${search}`: ''}`;
      const response = await getData(url);
      const { data, ...restPagination } = response;
      words.value = data;
      pagination.value = restPagination;
    };

    onMounted(() => {
      const page = sessionStorage.getItem('page') || 1;
      const limit = sessionStorage.getItem('limit') || 10;
      getWords(page, limit);
    });

    const deleteWord = async (id) => {
      await deleteData(`${GET_WORDS}/${id}`);
      // TODO: delete this id from all users
      search.value = '';
      getWords(pagination.value.page, pagination.value.limit);
    };

    const searchChange = async () => {
      if (search.value.length < 2) {
        await getWords(1, pagination.value.limit);
        return;
      }
      getWords(1, pagination.value.limit, search.value);
    };

    const addWord = async () => {
      try {
        const data = await postData(`${GET_WORD}`, { word: search.value });
        search.value = '';
        router.push(`${CARDS}/${data.id}`);
      } catch (error) {
        search.value = '';
      }
    };

    return {
      words,
      pagination,
      search,
      getWords,
      deleteWord,
      searchChange,
      addWord,
    };
  },
};
</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;

    > button {
      margin-left: 1rem;
    }
  }

  .pagination {
    text-align: center;
  }
</style>