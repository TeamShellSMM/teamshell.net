import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import App from './App.vue'
import VuexPersistence from 'vuex-persist'
import VuejsDialog from 'vuejs-dialog';

// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VuejsDialog);

import Home from './components/Home';
import Levels from './components/Levels';
import LevelDetails from './components/LevelDetails';
import MakerDetails from './components/MakerDetails';
import Makers from './components/Makers';
import Members from './components/Members';
import ShellAndTell from './components/ShellAndTell';
import Login from './components/Login';

const routes = [
  {path: '/', component: Home},
  {path: '/levels', component: Levels},
  {path: '/level/:code', component: LevelDetails},
  {path: '/maker/:name', component: MakerDetails},
  {path: '/makers', component: Makers},
  {path: '/members', component: Members},
  {path: '/shellandtell/:id', component: ShellAndTell},
  {path: '/login/:otp', component: Login}
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
    theme: 'light',
    token: '',
    user_info: {}
  },
  mutations: {
    setDark (state) {
      state.theme = 'dark';
      document.querySelector('html').classList.add('dark');
    },
    setLight (state) {
      state.theme = 'light';
      document.querySelector('html').classList.remove('dark');
    },
    setToken(state, payload){
      state.token = payload.token;
    },
    setUserInfo(state, payload){
      state.user_info = payload.user_info;
    },
    setLastDiffRange(state, payload){
      state.last_diff_range = payload;
    }
  },
  plugins: [vuexLocal.plugin]
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
