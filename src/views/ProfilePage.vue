<template>
  <div class="profile-page-container">
    <div class="pack-wrapper" v-if="!isOpenPack">
      <div class="pack-item" v-for="(pack, index) of packs" :key="index" @click="getPack(pack.name)">
        <div class="name">{{ pack.name }}</div>
        <div>{{ index + 1 }}</div>
      </div>
    </div>
    <div v-else>
      <div class="wrapper">
        <el-button 
          size="mini" 
          icon="el-icon-back"
          @click="onBack"
        >
          Back
        </el-button>
        <div class="heading">"{{ curPackName }}" pack</div>
      </div>
      <pack-view :fetchData="getWords"/>
    </div>
    <div v-if="packs.length === 0" class="no-packs">You have no packs</div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { GET_USER_INFO, PACK_WORDS } from '../constants/routes';
import { getData, postData } from '../utils/httpUtils';
import { onMounted } from '@vue/runtime-core';
import PackView from '../components/pack/PackView.vue';

export default {
  components: { PackView },
  setup() {
    const store = useStore();
    const packs = ref([]);
    const curWords = ref([]);
    const isOpenPack = ref(false);
    const curPackName = ref('');
    
    const getUserInfo = async () => {
      const username = store.state.user && store.state.user.username;
      const data = await getData(GET_USER_INFO(username));
      packs.value = data.packs;
    };

    onMounted(getUserInfo);

    const getPack = (packName) => {
      curPackName.value = packName;
      curWords.value = packs.value.find((pack) => pack.name === packName).data;
      isOpenPack.value = true;
    };

    const getWords = async (url) => {
      const searchPart = url.split(/\?/)[1];
      const searchParams = new URLSearchParams(searchPart);
      const page = +searchParams.get('page');
      const limit = +searchParams.get('limit');
      const search = searchParams.get('search');
      const paginatedWords = curWords.value.filter((_, index) => index < page * limit && index >= (page - 1) * limit);
      const data = { 
        ids: search ? curWords.value : paginatedWords,
        search,
      };

      return {
        data: await postData(PACK_WORDS, data),
        page,
        limit,
        nextPage: !search && (curWords.value.length / limit > page ? page + 1 : null),
      };
    };

    const onBack = () => {
      isOpenPack.value = false;
    };

    return {
      packs,
      curPackName,
      getPack,
      getWords,
      isOpenPack,
      onBack,
    };
  },
};
</script>

<style lang="scss" scoped>
  .profile-page-container {
    .heading {
      font-size: 2rem;
      text-align: center;
      flex: 1 0 auto;
    }

    .wrapper {
      display: flex;
      align-items: center;
    }

    .no-packs {
      text-align: center;
      font-size: 2rem;
      margin-top: 2rem;
      font-weight: bold;
    }
  }

  .pack-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .pack-item {
      width: 20%;
      max-width: 300px;
      height: 250px;
      border: 1px solid #ccc;
      text-align: center;
      background-color: rgba(0, 128, 128, 0.1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .name {
        font-size: 1.125rem;
        font-weight: bold;
      }
    }
  }
</style>