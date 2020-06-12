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
        <p>There are currently no finished races.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';

  export default {
    name: 'RaceHistory',
    data() {
      return {
        "data": null
      };
    },
    mounted(){
      //let that = this;
    },
    computed: {
    },
    methods: {
      getData(){
        $('.loader').show();

        let that = this;
        loadEndpoint({
          that,
          onLoad(_rawData){
            that.data=_rawData
            that.refresh()
          },
        })
      },
      refresh(){

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>