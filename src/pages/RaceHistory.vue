<template>
  <div>
    <div class="row nav-row">
      <div class="col-12">
        <ul id="nav" style="float:left;">
          <li>
            <router-link :to="'/' + $route.params.team + '/races'" exact>Current</router-link>
          </li>
          <li>
            <router-link :to="'/' + $route.params.team + '/races/history'">History</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="container">
        <h3 id="table_title" class="maker-detail-title">Finished Races</h3>
        <p v-if="races.finished.length == 0">There are currently no finished races.</p>
        <race-component v-for="race in races.finished" :key="race.vueKey" :race="race" :tags="tags" :serverTimeOffset="serverTimeOffset"></race-component>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';
  import raceComponent from '../components/RaceComponent';
  import moment from 'moment';

  export default {
    name: 'RaceHistory',
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
        globalKey: 0
      };
    },
    mounted(){
      //let that = this;
      this.getData();
    },
    computed: {
    },
    methods: {
      getData(){
        $('.loader').show();

        let that = this;
        loadEndpoint({
          that,
          route: "json/races",
          data: {
            mode: "history",
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>