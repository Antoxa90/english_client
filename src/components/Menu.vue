<template>
  <div class="menu-container">
    <ul>
      <li class="menu-item" v-for="item of menuItems" :key="item.route">
        <router-link :to="item.route" tag="span" class="menu-link">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { HOME, LEARN_WORDS, PROFILE } from '../constants/routes';

export default {
  setup() {
    const menuItems = [
      { name: 'Words List', route: HOME, roles: [] },
      { name: 'Learn Words', route: LEARN_WORDS, roles: [] },
      { name: 'Profile', route: PROFILE, roles: [] },
    ];
    
    return {
      menuItems,
    };
  },
};
</script>

<style lang="scss" scoped>
  .menu-container {
    position: fixed;
    left: 0;
    top: 60px;
    z-index: 10;
    height: calc(100vh - 60px);
    background-color: teal;
  

    ul {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      padding-left: 0;
    }

    .menu-item {
      text-align: center;
      background-color: teal;

      &:hover {
        background-color: rgb(1, 177, 177);
        cursor: pointer;
      }
    }

    .menu-link {
      display: inline-block;
      color: #fff;
      text-decoration: none;
      padding: 1rem 3rem;
    }
  }
</style>