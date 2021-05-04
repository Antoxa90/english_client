<template>
  <div class="pack-view-container">
    <div class="word-nav">
      <span
        :class="{letter: true, active: letter === searchLetter}"
        v-for="letter of alphabet"
        :key="letter"
        @click="getWordsStartWith(letter)"
      >
        {{letter}}
      </span>
    </div>
    <div class="wrapper">
      <div><i class="el-icon-arrow-left nav-icon" @click="getPreviousWord"/></div>
      <div class="pack-content">
        <template v-if="words[index]">
          <div class="favourite" @click="toggleFavourite">
            <i v-if="isFavourite" class="el-icon-star-on"/>
            <i v-else class="el-icon-star-off"/>
          </div>
          <div class="title">{{words[index].word}} <i title="Listen" class="el-icon-video-play play-icon" @click="sayWord"/></div>
          <div class="type">{{words[index].type}}</div>
          <div class="definition">
            {{words[index].definition}}
            <span @click="modalVisible = true">(examples)</span>
          </div>
          <add-to-pack-popover 
            :packNames="packNames"
            :packsList="packs"
            :index="index"
            @addToPack="addToPack"
            @removeFromPack="removeFromPack"
          />
          <examples-modal
            :examples="words[index].examples"
            :modalVisible="modalVisible"
            @update:modalVisible="modalVisible = $event"
          />
        </template>
        <div v-else class="not-found">Words not found!</div>
      </div>
      <div><i class="el-icon-arrow-right nav-icon" @click="getNextWord"/></div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { GET_USER_INFO, GET_WORDS } from '../../constants/routes';
import { getData, putData } from '../../utils/httpUtils';
import { useStore } from 'vuex';
import { DEFAULT_PACK_NAME } from '../../constants/common';
import AddToPackPopover from './AddToPackPopover.vue';
import ExamplesModal from './ExamplesModal.vue';

export default {
  props: {
    fetchData: {
      type: Function,
      default: getData,
    }
  },
  components: { AddToPackPopover, ExamplesModal },
  setup(props) {
    const store = useStore();
    const limit = 10;
    const words = ref([]);
    const pagination = ref({});
    const index = ref(0);
    const isFavourite = ref(false);
    const packs = ref([]);
    const packNames = ref([]);
    const modalVisible = ref(false);
    const searchLetter = ref('');

    const alphabet = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    const getWords = async (page = 1, limit = 10, search = '') => {
      const url = `${GET_WORDS}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
      const response = await props.fetchData(url);
      const { data, ...restPagination } = response;
      words.value = data;
      pagination.value = restPagination;
    };

    const getWordsStartWith = async (letter) => {
      const search = letter !== 'All' ? letter : '';
      searchLetter.value = search;
      await getWords(1, limit, search);
      isInPack();
    };

    const getUserInfo = async () => {
      const username = store.state.user && store.state.user.username;
      const res = await getData(GET_USER_INFO(username));
      packs.value = res.packs;
      isInPack();
    };

    onMounted(async () => {
      await getWords();
      getUserInfo();
    });

    const isInPack = () => {
      isFavourite.value = false;
      packNames.value = [];
      const wordId = words.value[index.value]?.id;
      const inPackArr = packs.value.filter((pack) => pack.data.includes(wordId));
      if (inPackArr.length > 0) {
        isFavourite.value = inPackArr.some((pack) => pack.name === DEFAULT_PACK_NAME);
        packNames.value = inPackArr.map((pack) => pack.name);
      }
    };

    const getNextWord = async () => {
      if (!pagination.value.nextPage && index.value >= words.value.length - 1)
        return;

      if (index.value + 1 < pagination.value.limit) {
        index.value++;
      } else {
        await getWords(+pagination.value.page + 1, limit, searchLetter.value);
        index.value = 0;
      }
      isInPack();
    };

    const getPreviousWord = async () => {
      if(+pagination.value.page === 1 && index.value === 0)
        return;

      if(index.value > 0) {
        index.value--;
      } else {
        await getWords(pagination.value.page - 1, limit, searchLetter.value);
        index.value = pagination.value.limit - 1;
      }
      isInPack();
    };

    const sayWord = () => {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(words.value[index.value].word);
      synth.cancel();
      synth.speak(utterThis);
    };

    const updatePacks = async (getNewPackData, packName) => {
      const username = store.state.user && store.state.user.username;
      const wordId = words.value[index.value].id;
      const favIndex = packs.value.findIndex((pack) => pack.name === packName);
      const favouriteIndex = favIndex === -1 ? packs.value.length : favIndex;
      const newPacks = [...packs.value];
      newPacks[favouriteIndex] = {
        name: packName,
        data: getNewPackData({ packs: packs.value, index: favouriteIndex, id: wordId }) 
      };

      const res = await putData(GET_USER_INFO(username), { packs: newPacks });
      packs.value = res.packs;
      isInPack();
    };

    const addToPack = (name) => {
      const getNewPacks = ({ packs, index, id }) => packs[index] ? packs[index].data.concat(id) : [id];
      updatePacks(getNewPacks, name);
    };

    const removeFromPack = (name) => {
      const getNewPacks = ({ packs, index, id }) => packs[index].data.filter((wordId) => wordId !== id);
      updatePacks(getNewPacks, name);
    };

    const toggleFavourite = () => {
      if (isFavourite.value) {
        removeFromPack(DEFAULT_PACK_NAME);
      } else {
        addToPack(DEFAULT_PACK_NAME);
      }
      isFavourite.value = !isFavourite.value;
    };

    return {
      words,
      pagination,
      index,
      isFavourite,
      packs,
      packNames,
      modalVisible,
      alphabet,
      searchLetter,
      getWords,
      getNextWord,
      getPreviousWord,
      sayWord,
      toggleFavourite,
      addToPack,
      removeFromPack,
      getWordsStartWith,
    };
  },
};
</script>

<style lang="scss" scoped>
  .pack-view-container {
    margin-top: 15vh;

    .word-nav {
      display: flex;
      margin: auto;
      margin-bottom: 2rem;
      width: fit-content;

      .letter {
        cursor: pointer;
        padding: 0.5rem;
        text-decoration: underline;
        border: 1px solid transparent;

        &.active {
          color: rgb(39, 39, 238);
          box-shadow: inset 3px 3px 6px -4px #000;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .nav-icon {
      margin: 0 2rem;
      cursor: pointer;
      font-size: 5rem;
    }

    .play-icon {
      cursor: pointer;
      font-size: 1.5rem;
      margin-left: 1rem;
    }

    .pack-content {
      text-align: center;
      width: 350px;
      position: relative;
      padding: 1rem 0;

      .favourite {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        font-size: 1.25rem;
        color: #ff0000;
      }

      .title {
        font-weight: bold;
        font-size: 2rem;
      }

      .type {
        margin-bottom: 1rem;
        font-style: italic;
      }

      .definition > span {
        font-style: italic;
        text-decoration: underline;
        cursor: pointer;
      }

      .not-found {
        font-weight: bold;
        font-size: 1.5rem;
      }
    }
  }
</style>