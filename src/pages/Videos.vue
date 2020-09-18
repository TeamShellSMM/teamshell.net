<template>
  <div>
    <div class="row">
      <div class="container">
        <h3 id="table_title" class="maker-detail-title mt-0">Recent Videos</h3>
        <div>
          <button class="btn" style="color:white;" :class="$route.params.team + '-primary-bg'" v-on:click="prevPage">&lt;</button>
          <span class="font-weight-bold video-page-label">Page {{page}}</span>
          <button class="btn" style="color:white;" :class="$route.params.team + '-primary-bg'" v-on:click="nextPage">&gt;</button>
        </div>
        <div class="row">
          <video-card-component v-for="video in videos" :key="video.id" :video="video" :tag_labels="tag_labels"></video-card-component>
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
        "videos": null,
        "tag_labels": [],
        "page": 1
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
            page: that.page - 1,
            size: 10
          },
          reloadOnError: false,
          onLoad(data){
            $('.loader').hide();
            that.videos = data.videos;
            that.tag_labels = data.tag_labels;
          },
        })
      },
      prevPage(){
        if(this.page > 1){
          this.page --;
          this.getData();
        }
      },
      nextPage(){
        if(this.videos.length == 10){
          this.page++;
          this.getData();
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>