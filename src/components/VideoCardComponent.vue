<template>
  <div class="col-md-6 col-sm-12 p-1">
    <div class="card video-card" :class="$route.params.team + '-primary-bc'">
      <Tweet v-if="video.type == 'twitter' && twitterId" :id="twitterId" :options="{conversation: 'none'}" >
        <img class="video-card-loader" src="/assets/defaults/buzzySpin.gif">
      </Tweet>
    </div>
  </div>
</template>

<script>
  //import moment from 'moment';
  //import { loadEndpoint } from '../services/helper-service'
  import { Tweet } from 'vue-tweet-embed'

  export default {
    name: 'video-card-component',
    props: {
      video: Object,
    },
    components: {
      Tweet
    },
    data(){
      return {
      };
    },
    mounted(){
    },
    computed: {
      twitterId(){
        if(this.video.type == 'twitter'){
          return this.video.url.substring(this.video.url.lastIndexOf("/") + 1, this.video.url.lastIndexOf("?"));
        }
        return null;
      }
    },
    methods: {

    },
    watch: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>