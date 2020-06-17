<template>
  <div>
    <div class="row nav-row">
      <div class="col-12">
        <ul id="nav" style="float:left;">
          <li>
            <router-link :to="'/' + $route.params.team + '/races'" exact>Official</router-link>
          </li>
          <li>
            <router-link :to="'/' + $route.params.team + '/races/unofficial'" exact>Unofficial</router-link>
          </li>
          <li>
            <router-link :to="'/' + $route.params.team + '/races/history'">History</router-link>
          </li>
        </ul>
        <button v-if="teamAdmin || (raceCreator)" type="button" class="btn btn-circle new-race-button" :class="$route.params.team + '-primary-bg'" title="New Race" v-on:click="newRace()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="row">
      <div class="container">
        <h3 id="table_title" class="maker-detail-title mt-0">Active Races</h3>
        <p v-if="races.active.length == 0">There are currently no active races.</p>
        <race-component v-for="race in races.active" :key="race.vueKey" :race="race" :tags="tags" :serverTimeOffset="serverTimeOffset" v-on:after-update="getData()"></race-component>
        <h3 id="table_title" class="maker-detail-title">Upcoming Races</h3>
        <p v-if="races.upcoming.length == 0">There are currently no upcoming races.</p>
        <race-component v-for="race in races.upcoming" :key="race.vueKey" :race="race" :tags="tags" :serverTimeOffset="serverTimeOffset" v-on:after-update="getData()"></race-component>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';
  import raceComponent from '../components/RaceComponent';
  import moment from 'moment';

  export default {
    name: 'Races',
    components: {
      raceComponent
    },
    data() {
      return {
        "data": null,
        "races": {
          "active": [],
          "upcoming": [],
          "finished": []
        },
        tags: [],
        serverTimeOffset: 0,
        globalKey: 0,
        secondCounter: 0,
        unofficial: false,
      };
    },
    mounted(){
      if(this.$route.path.endsWith("unofficial")){
        this.unofficial = true;
      }

      this.getData();

      let that = this;

      setInterval(function(){
        that.secondCounter+= 10;
        if(that.secondCounter > 5*60){
          that.getData();
        }
      }, 10000)

      console.log(this.$route);
    },
    computed: {
      teamAdmin:function(){
        return this.$route.params.team && this.$store.state[this.$route.params.team].teamAdmin
      },
      raceCreator(){
        return this.$route.params.team && this.$store.state[this.$route.params.team].raceCreator
      }
    },
    methods: {
      getData(){
        this.secondCounter = 0;
        $('.loader').show();

        let that = this;
        loadEndpoint({
          that,
          route: "json/races",
          data: {
            mode: that.unofficial ? "unofficial" : "current",
            currentTimeMillis: moment().valueOf()
          },
          reloadOnError: false,
          onLoad(data){
            $('.loader').hide();
            for(let race of data.data["active"]){
              race.vueKey = that.globalKey;
              that.globalKey++;
            }
            for(let race of data.data["upcoming"]){
              race.vueKey = that.globalKey;
              that.globalKey++;
            }
            for(let race of data.data["finished"]){
              race.vueKey = that.globalKey;
              that.globalKey++;
            }

            that.races = data.data;
            that.tags = data.tags;
            that.serverTimeOffset = data.serverTimeOffset;
          },
        })
      },
      newRace(){
        let that = this;

        this.$dialog.alert(this.$route.params.team, {
          view: 'race-edit-component', // can be set globally too
          html: true,
          animation: 'fade',
          customClass: "race-dialog",
          tags: this.tags
        })
        .then((obj) => {
          $('.loader').show();

          if(that.unofficial){
            obj.data.unofficial = 1;
          }

          loadEndpoint({
            that,
            type: "post",
            route: "race",
            data: obj.data,
            onLoad(){
              that.getData();
            },
          });
        })
        .catch(() => {

        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>