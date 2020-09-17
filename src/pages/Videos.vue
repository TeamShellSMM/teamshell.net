<template>
  <div>
    <div class="row">
      <div class="container">
        <h3 id="table_title" class="maker-detail-title mt-0">Recent Videos</h3>
        <div class="row">
          <div class="container">
            <video-card-component v-for="video in data" :key="video.id" :video="video"></video-card-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';
  import videoCardComponent from '../components/VideoCardComponent';
  //import moment from 'moment';

  export default {
    name: 'Videos',
    components: {
      videoCardComponent
    },
    data() {
      return {
        "data": null,
      };
    },
    mounted(){
      this.getData();

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
          route: "json/videos",
          data: {
            page: 0,
            size: 10
          },
          reloadOnError: false,
          onLoad(data){
            $('.loader').hide();
            that.data = data;
          },
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>