import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import App from './App.vue'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);
Vue.use(VueRouter);

import Home from './components/Home';
import Levels from './components/Levels';
import LevelDetails from './components/LevelDetails';
import MakerDetails from './components/MakerDetails';
import Makers from './components/Makers';
import Members from './components/Members';

const routes = [
  {path: '/', component: Home},
  {path: '/levels', component: Levels},
  {path: '/level/:code', component: LevelDetails},
  {path: '/maker/:name', component: MakerDetails},
  {path: '/makers', component: Makers},
  {path: '/members', component: Members}
];

const router = new VueRouter({
  routes,
  mode: 'history'
})


Vue.config.productionTip = false

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

const store = new Vuex.Store({
  state: {
    theme: 'light'
  },
  mutations: {
    setDark (state) {
      state.theme = 'dark';
      document.querySelector('html').classList.add('dark');
    },
    setLight (state) {
      state.theme = 'light';
      document.querySelector('html').classList.remove('dark');
    }
  },
  plugins: [vuexLocal.plugin]
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
