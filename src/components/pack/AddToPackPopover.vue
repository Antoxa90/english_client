<template>
  <div>
    <el-popover
      :width="200"
      trigger="click"
    >
      <template #reference>
        <div class="add-to-pack">
          <i class="el-icon-plus"/> Add to pack
        </div>
      </template>
      <div class="packs-list">
        <ul>
          <li v-for="(name, index) of allPackNames" :key="index" @click="addOrRemove(name)">
            <i class="el-icon-check" v-if="packNames.includes(name)"/>
            {{ name }}
          </li>
        </ul>
        <div v-if="allPackNames.length === 0">No available packs</div>
        <el-input
          :model-value="newPackName"
          @input="updatePackName"
          @keyup.enter="saveInPack"
          placeholder="Create a new pack..."
          class="new-pack-input"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
import { onUpdated, ref } from 'vue';
import { DEFAULT_PACK_NAME } from '../../constants/common';

export default {
  props: {
    packNames: {
      type: Array,
      required: false
    },
    packsList: {
      type: Array,
      required: false
    }
  },
  setup(props, { emit }) {
    const allPackNames = ref('');
    const newPackName = ref('');

    onUpdated(() => {
      const names = props.packsList.map((pack) => pack.name);
      allPackNames.value = names.filter((name) => name !== DEFAULT_PACK_NAME);
    });

    const updatePackName = (value) => {
      newPackName.value = value;
    };

    const saveInPack = () => {
      emit('addToPack', newPackName.value);
      newPackName.value = '';
    };

    const addOrRemove = (name) => {
      if(props.packNames.includes(name)) {
        emit('removeFromPack', name);
      } else {
        emit('addToPack', name);
      }
      newPackName.value = '';
    };

    return {
      allPackNames,
      newPackName,
      updatePackName,
      saveInPack,
      addOrRemove,
    };
  },
};
</script>

<style lang="scss" scoped>
  .add-to-pack {
    margin-top: 1rem;

    > i {
      cursor: pointer;
    }
  }

  .packs-list {
    ul {
      margin-bottom: 0.5rem;
    }

    li {
      list-style-type: none;
      padding: 0.5rem;
      border: 1px solid #dcdfe6;
      border-bottom: 0;
      cursor: pointer;

      &:last-child {
        border-bottom: 1px solid #dcdfe6;
      }

      &:hover {
        background-color: #dcdfe6;
      }
    }
  }
</style>