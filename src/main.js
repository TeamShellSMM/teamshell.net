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
  {path: '/', beforeEnter: (to, from, next) => {
    document.querySelector('html').classList.remove('dark');
    next();
  }},
  {path: '/:team', component: Home},
  {path: '/:team/levels', component: Levels},
  {path: '/:team/level/:code', component: LevelDetails},
  {path: '/:team/maker/:name', component: MakerDetails},
  {path: '/:team/makers', component: Makers},
  {path: '/:team/members', component: Members},
  {path: '/:team/shellandtell/:id', component: ShellAndTell},
  {path: '/:team/login/:otp', component: Login}
];

const router = new VueRouter({
  routes,
  mode: 'history'
})


Vue.config.productionTip = false

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

const moduleTeamShell = {
  namespaced: true,
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
  }
}

const moduleTeamJamp = {
  namespaced: true,
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
  }
}

const store = new Vuex.Store({
  modules: {
    teamshell: moduleTeamShell,
    teamjamp: moduleTeamJamp
  },
  plugins: [vuexLocal.plugin]
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
