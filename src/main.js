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
import Teams from './components/Teams';
import Features from './components/Features';
import HowToJoin from './components/HowToJoin';
import Levels from './components/Levels';
import LevelDetails from './components/LevelDetails';
import MakerDetails from './components/MakerDetails';
import Worlds from './components/Worlds';
import Makers from './components/Makers';
import Members from './components/Members';
import ShellAndTell from './components/ShellAndTell';
import Login from './components/Login';

const routes = [
  {path: '/', beforeEnter: (to, from, next) => {
    document.querySelector('html').classList.remove('dark');
    next();
  }, component: Teams},
  {path: '/features', beforeEnter: (to, from, next) => {
    document.querySelector('html').classList.remove('dark');
    next();
  }, component: Features},
  {path: '/howtojoin', beforeEnter: (to, from, next) => {
    document.querySelector('html').classList.remove('dark');
    next();
  }, component: HowToJoin},
  {path: '/:team', component: Home},
  {path: '/:team/levels', component: Levels},
  {path: '/:team/level/:code', component: LevelDetails},
  {path: '/:team/maker/:name', component: MakerDetails},
  {path: '/:team/worlds', component: Worlds},
  {path: '/:team/makers', component: Makers},
  {path: '/:team/members', component: Members},
  {path: '/:team/shellandtell/:id', component: ShellAndTell},
  {path: '/:team/login/:otp', component: Login}
];

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if(to.params.team){
    if(to.params.team == 'teamshell'){
      document.title = "#TeamShell";
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon-teamshell.ico';
      document.getElementsByTagName('head')[0].appendChild(link);

      document.querySelector('body').classList.remove('makerteams-body-bg');
    } else if(to.params.team == 'teamjamp'){
      document.title = "Team Jamp";
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon-teamjamp.ico';
      document.getElementsByTagName('head')[0].appendChild(link);

      document.querySelector('body').classList.remove('makerteams-body-bg');
    } else if(to.params.team == 'teampipe'){
      document.title = "#TeamPipe";
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon-teampipe.ico';
      document.getElementsByTagName('head')[0].appendChild(link);

      document.querySelector('body').classList.remove('makerteams-body-bg');
    } else {
      document.title = "MakerTeams";
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon.ico';
      document.getElementsByTagName('head')[0].appendChild(link);

      document.querySelector('body').classList.add('makerteams-body-bg');
    }
  } else {
    document.title = "MakerTeams";
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    document.querySelector('body').classList.add('makerteams-body-bg');
  }
  next()
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

const moduleTeamPipe = {
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
    teamjamp: moduleTeamJamp,
    teampipe: moduleTeamPipe
  },
  plugins: [vuexLocal.plugin]
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
