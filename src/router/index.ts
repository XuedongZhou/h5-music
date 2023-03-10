import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('@/views/HomeView.vue');
const RecommendView = () => import('@/views/RecommendView.vue');
const HotView = () => import('@/views/HotView.vue');
const SearchView = () => import('@/views/SearchView.vue');
const SingerViewVue = () => import('@/views/SingerView.vue');
const PlayListViewVue = () => import('@/views/PlayListView.vue');
const HotSongView = () => import('@/views/HotSongView.vue');
const TopListView = () => import('@/views/TopListView.vue');

const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          name: 'recommend',
          component: RecommendView
        },
        {
          path: '/singer',
          name: 'singer',
          component: SingerViewVue
        },
        {
          path: '/hot',
          name: 'hot',
          component: HotView
        },
        {
          path: '/search',
          name: 'search',
          component: SearchView
        }
      ]
    },
    {
      path: '/playlist',
      name: '/playlist',
      component: PlayListViewVue
    },
    {
      path: '/hot-song',
      name: 'hot-song',
      component: HotSongView
    },
    {
      path: '/top-list',
      name: 'top-list',
      component: TopListView
    }
  ]
});

export default router;
