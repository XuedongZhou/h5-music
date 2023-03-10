import { createApp } from 'vue';
import { createPinia } from 'pinia';

import lazyPlugin from 'vue3-lazy';

import App from './App.vue';
import router from './router';

import './assets/main.scss';
import loadingDirective from './components/loading/directive';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.directive('loading', loadingDirective);

lazyPlugin.install(app, {
  loading: 'img.svg',
  error: 'img-error.svg'
});

app.mount('#app');
