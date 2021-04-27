import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import WordsCard from '../views/WordsCard.vue';
import AuthPage from '../views/AuthPage.vue';
import PackPage from '../views/PackPage';
import store from '../store';
import { getData } from '../utils/httpUtils';
import { IS_AUTH } from '../constants/routes';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/cards/:id',
    name: 'WordsCard',
    component: WordsCard
  },
  {
    path: '/auth',
    name: 'AuthPage',
    component: AuthPage
  },
  {
    path: '/learn-words',
    name: 'PackPage',
    component: PackPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
