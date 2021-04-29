import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import WordsCard from '../views/WordsCard.vue';
import AuthPage from '../views/AuthPage.vue';
import PackPage from '../views/PackPage';
import SignUpPage from '../views/SignUpPage';
import { AUTH, CARDS, HOME, IS_AUTH, LEARN_WORDS, SIGN_UP } from '../constants/routes';

const routes = [
  {
    path: HOME,
    name: 'Main',
    component: Main
  },
  {
    path: `${CARDS}/:id`,
    name: 'WordsCard',
    component: WordsCard
  },
  {
    path: AUTH,
    name: 'AuthPage',
    component: AuthPage
  },
  {
    path: LEARN_WORDS,
    name: 'PackPage',
    component: PackPage
  },
  {
    path: SIGN_UP,
    name: 'SignUpPage',
    component: SignUpPage
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
