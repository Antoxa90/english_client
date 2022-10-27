<template>
  <div class="irregular-verbs-container">
    <div class="heading">Irregular verbs</div>
    <div class="verbs-wrapper">
      <div class="infinitive">
        Infinitive: to {{verbs[currentNumber]?.verb}}
      </div>
      <verb-item
        isInput
        :verb="secondForm"
        placeholder="Enter Past Simple"
        @input:verb="secondForm = $event"
        :result="verbs[currentNumber]?.secondForm"
        :showResult="isValidated"
        label="Past Simple:"
        class="input-item-container"
      ></verb-item>
      <verb-item
        isInput
        :verb="thirdForm"
        placeholder="Enter Past Participle"
        @input:verb="thirdForm = $event"
        :result="verbs[currentNumber]?.thirdForm"
        :showResult="isValidated"
        label="Past Participle:"
        class="input-item-container"
      ></verb-item>
    </div>
    <div class="result-wrapper">
      <div v-if="verbs.length > 0" class="verbs-counter">
        {{currentNumber + 1}} of {{verbs.length}} (right answers: {{rightAnswersCount}})
      </div>
      <el-button @click="onClickResult">
        {{isValidated ? 'Next' : 'Check'}}
      </el-button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { GET_IRREGULAR_VERBS } from '../../constants/routes';
import { getData } from '../../utils/httpUtils';
import VerbItem from './VerbItem.vue';

export default {
  components: { VerbItem },
  setup() {
    const store = useStore();
    const verbs = ref([]);
    const pagination = ref({});
    const currentNumber = ref(0);
    const isValidated = ref(false);
    const secondForm = ref('');
    const thirdForm = ref('');
    const rightAnswersCount = ref(0);

    const getIrregularVerbs = async () => {
      try {
        const url = GET_IRREGULAR_VERBS;
        const response = await getData(url);
        const { data, ...restPagination } = response;
        verbs.value = data;
        if (typeof pagination.value.page === 'undefined') {
          verbs.value = data.sort(() => (Math.random() > .5) ? 1 : -1); // random shuffle
        }
        pagination.value = restPagination;
      } catch (error) {
        store.commit('SET_ERROR', error.message);
      }
    };

    onMounted(() => {
      getIrregularVerbs();
    });

    const onClickResult = () => {
      if (isValidated.value) {
        secondForm.value = '';
        thirdForm.value = '';
        currentNumber.value++;
        isValidated.value = false;
      } else {
        if(secondForm.value === verbs.value[currentNumber.value].secondForm &&
          thirdForm.value === verbs.value[currentNumber.value].thirdForm) {
          rightAnswersCount.value++;
        }
        isValidated.value = true;
      }
    };

    return {
      verbs,
      pagination,
      currentNumber,
      isValidated,
      secondForm,
      thirdForm,
      rightAnswersCount,
      onClickResult,
    };
  }
};
</script>


<style lang="scss" scoped>
.irregular-verbs-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  .heading {
    font-size: 1.4rem;
    text-align: center;
    margin-bottom: 50px;
  }

  .verbs-wrapper {
    font-size: 1rem;
  }

  .infinitive {
    text-transform: capitalize;
  }

  .input-item-container,
  .infinitive,
  .result-wrapper {
    max-width: 500px;
    margin: 0 auto 20px auto;
  }

  .result-wrapper {
    text-align: center;
  }

  .verbs-counter {
    margin-bottom: 20px;
  }
}
</style>