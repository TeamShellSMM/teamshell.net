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
import TeamSettings from './components/TeamSettings';

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
  {path: '/:team/levels/tags/:tags', component: Levels},
  {path: '/:team/levels/status/:status', component: Levels},
  {path: '/:team/level/:code', component: LevelDetails},
  {path: '/:team/maker/:name', component: MakerDetails},
  {path: '/:team/worlds', component: Worlds},
  {path: '/:team/makers', component: Makers},
  {path: '/:team/members', component: Members},
  {path: '/:team/shellandtell/:id', component: ShellAndTell},
  {path: '/:team/login/:otp', component: Login},
  {path: '/:team/admin/settings', component: TeamSettings},
];

const router = new VueRouter({
  routes,
  mode: 'history'
});


const defaultSetting={
  title:"MakerTeams",
  TeamName:'MakerTeams',
  icon:'/favicon.ico',
  maker:true,
}

const teams={
  teamshell:{
    TeamName:'#TeamShell',
    icon:'/favicon-teamshell.ico',
    discord_invite:'https://discord.gg/7tQJewa',
    twitter:'TeamShellSMM',
    ModName:'Shellder',
  },
  teamjamp:{
    TeamName:'Team Jamp',
    icon:'/favicon-teamjamp.ico',
    discord_invite:'https://discord.gg/rekPFnq',
    twitter:'team_jamp',
    ModName:'Jampolice',
  },
  teampipe:{
    TeamName:'#TeamPipe',
    icon:'/favicon-teampipe.ico',
    discord_invite:'https://discord.gg/PcC5eKp',
    twitter:'teamPipe1',
    ModName:'Admin',
  }
}

router.beforeEach((to, from, next) => {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    let settings= teams[to.params.team] || defaultSetting
    document.title=settings.TeamName;
    link.href=settings.icon;
    if(settings.maker){
      document.querySelector('body').classList.add('makerteams-body-bg');
    } else {
      document.querySelector('body').classList.remove('makerteams-body-bg');
    }
    document.getElementsByTagName('head')[0].appendChild(link);
  next()
})


Vue.config.productionTip = false;

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});


function makeTeam(args){
  return {
    namespaced: true,
    state: {
      theme: 'light',
      token: '',
      user_info: {},
      teamvars:args,
      ...args
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
      },
      setTeamAdmin(state,payload){
        state.teamAdmin=payload;
      }
    }
  }
}

const teamModules={}
for(var url_slug in teams){
  teamModules[url_slug]=makeTeam(teams[url_slug]);
}

const store = new Vuex.Store({
  modules: teamModules,
  plugins: [vuexLocal.plugin]
});

const LEVEL_STATUS={
  PENDING:0,
  PENDING_APPROVED_REUPLOAD:3,
  PENDING_FIXED_REUPLOAD:4,
  PENDING_NOT_FIXED_REUPLOAD:5,

  NEED_FIX:-10,
  APPROVED:1,
  REJECTED:-1,

  REUPLOADED:2,
  REMOVED:-2, 
  USER_REMOVED:-3,
};

const PENDING_LEVELS=[
  LEVEL_STATUS.PENDING,
  LEVEL_STATUS.PENDING_NOT_FIXED_REUPLOAD,
  LEVEL_STATUS.PENDING_APPROVED_REUPLOAD,
  LEVEL_STATUS.PENDING_FIXED_REUPLOAD,
];

Vue.prototype.$constants={
  LEVEL_STATUS,PENDING_LEVELS
}

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
