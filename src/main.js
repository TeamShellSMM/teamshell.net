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

import RaceEditComponent from './components/RaceEditComponent';

Vue.dialog.registerComponent('race-edit-component', RaceEditComponent);

import Home from './pages/Home';
import Teams from './pages/Teams';
import Features from './pages/Features';
import HowToJoin from './pages/HowToJoin';
import Levels from './pages/Levels';
import LevelDetails from './pages/LevelDetails';
import MakerDetails from './pages/MakerDetails';
import Worlds from './pages/Worlds';
import Makers from './pages/Makers';
import Members from './pages/Members';
import ShellAndTell from './pages/ShellAndTell';
import Login from './pages/Login';
import ClearAll from './pages/ClearAll';
import TeamSettings from './pages/TeamSettings';
import AdminTags from './pages/AdminTags';
import AdminCommands from './pages/AdminCommands';
import Races from './pages/Races';
import RaceHistory from './pages/RaceHistory';

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
  {path: '/ClearAll', component: ClearAll},
  {path: '/:team', component: Home},
  {path: '/:team/levels', component: Levels},
  {path: '/:team/levels/tags/:tags', component: Levels},
  {path: '/:team/levels/status/:status', component: Levels},
  {path: '/:team/level/:code', component: LevelDetails},
  {path: '/:team/maker/:name', component: MakerDetails},
  {path: '/:team/worlds', component: Worlds},
  {path: '/:team/makers', component: Makers},
  {path: '/:team/members', component: Members},
  {path: '/:team/competitions', component: ShellAndTell},
  {path: '/:team/competitions/:id', component: ShellAndTell},
  {path: '/:team/races', component: Races},
  {path: '/:team/races/unofficial', component: Races},
  {path: '/:team/races/history', component: RaceHistory},
  {path: '/:team/login/:otp', component: Login},
  {path: '/:team/admin/settings', component: TeamSettings},
  {path: '/:team/admin/tags', component: AdminTags},
  {path: '/:team/admin/commands', component: AdminCommands},
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

const loaded={}
router.beforeEach((to, from, next) => {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    const keys=Object.keys(JSON.parse(localStorage.getItem('vuex') || '{}' ))
    if(to.params.team && !loaded[to.params.team]){
      store.registerModule(to.params.team,makeTeam(to.params.team),{
        preserveState:keys.includes(to.params.team),
      })
      console.log('here')
      loaded[to.params.team]=true;
    }

    document.title='Maker teams';
    link.href=`/favicon.ico`;
    if(to.params.team){
      document.querySelector('body').classList.remove('makerteams-body-bg');
    } else {
      document.querySelector('body').classList.add('makerteams-body-bg');
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
      teamAdmin: false,
      teamSettings:{},
      teamCompetitions: false,
      teamLastCompWinner: null,
      teamvars:args,
      raceCreator: false,
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
      },
      setRaceCreator(state,payload){
        state.raceCreator=payload;
      },
      setTeamSettings(state,payload){
        state.teamSettings=payload;
      },
      setTeamCompetitions(state,payload){
        if(payload){
          state.teamCompetitions=payload.length > 0;
        } else {
          state.teamCompetitions = false;
        }
      },
      setTeamLastCompWinner(state,payload){
        let last_comp_winner = null;
        for(let comp_winner of payload.competition_winners){
          if(comp_winner.rank == 1){
            if(last_comp_winner == null || comp_winner.id > last_comp_winner.id){
              last_comp_winner = comp_winner;
            }
          }
        }

        if(last_comp_winner){
          last_comp_winner.level = payload.levels.find(x => x.id == last_comp_winner.code);
        }

        state.teamLastCompWinner = last_comp_winner;
        console.log("set last", last_comp_winner);
      }
    }
  }
}

const store = new Vuex.Store({
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
