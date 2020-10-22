<template>
  <div class="col-md-6 col-sm-12 p-1">
    <div class="card video-card" :class="$route.params.team + '-primary-bc ' + video.type + '-card'">
      <div class="video-card-header font-weight-bold" :class="$route.params.team + '-secondary-bc'">
        <div style="float:left;width:65%" v-if="video.level" v-html="levelNameHtml">
        </div>
        <div style="float:right;text-align:right;width:35%;" v-if="video.play && video.play.completed">
          Cleared by <router-link :to="'/'+$route.params.team+'/maker/'+video.play.player">{{video.play.player}}</router-link>
          <br>
          <span style="font-weight: 500;">{{timeAgo}}</span>
        </div>
      </div>
      <div class="video-card-body">
        <Tweet v-if="video.type == 'twitter' && twitterId" :id="twitterId" :options="{'conversation': 'none', 'align': 'center'}" >
          <img class="video-card-loader" src="/assets/defaults/buzzySpin.gif">
        </Tweet>
        <youtube v-if="video.type == 'youtube' && youtubeId" :video-id="youtubeId" :player-vars="{start: youtubeStart}" @ready="ready = true;">
        </youtube>
        <iframe v-if="video.type == 'twitch-clips'" @load="ready = true"
          :src="twitchClipUrl"
          height="100%"
          width="100%"
          scrolling="no"
          allowfullscreen="false"
          parent="makerteams.net">
        </iframe>
        <iframe v-if="video.type == 'twitch-videos'" @load="ready = true"
          :src="twitchVideoUrl"
          height="100%"
          width="100%"
          scrolling="no"
          allowfullscreen="false"
          parent="makerteams.net">
        </iframe>
        <iframe v-if="video.type == 'streamable'" @load="ready = true" :src="streamableUrl" frameborder="0" width="100%" height="100%" style="width: 100%; height: 100%;">

        </iframe>
        <img v-if="(video.type == 'youtube' || video.type == 'twitch-videos' || video.type == 'twitch-clips' || video.type == 'streamable') && !ready" class="video-card-loader" src="/assets/defaults/buzzySpin.gif">
      </div>
    </div>
  </div>
</template>

<script>
  //import moment from 'moment';
  //import { loadEndpoint } from '../services/helper-service'
  import { Tweet } from 'vue-tweet-embed'
  import { makeLevelName } from '../services/helper-service';
  import moment from 'moment';

  export default {
    name: 'video-card-component',
    props: {
      video: Object,
      tag_labels: Array
    },
    components: {
      Tweet
    },
    data(){
      return {
        'levelNameHtml': "",
        'timeAgo': "",
        'ready': false,
        "host": ""
      };
    },
    mounted(){
      this.levelNameHtml = makeLevelName({row: this.video.level, "that": this, skipVideos: true, alwaysAddCreator: true, addLevelLink: true});
      if(this.video.play){
        this.timeAgo = moment(this.video.play.created_at).fromNow();
      }
      this.host = document.location.host;
      if(this.host.indexOf(":") !== -1){
        this.host = this.host.substring(0, this.host.indexOf(":"));
      }
    },
    computed: {
      twitterId(){
        if(this.video.type == 'twitter'){
          return this.video.url.substring(this.video.url.lastIndexOf("/") + 1, (this.video.url.lastIndexOf("?") !== -1 ? this.video.url.lastIndexOf("?") : this.video.url.length));
        }
        return null;
      },
      youtubeId(){
        if(this.video.type == 'youtube'){
          return this.$youtube.getIdFromURL(this.video.url)
        }
        return null;
      },
      youtubeStart(){
        if(this.video.type == 'youtube'){
          return this.$youtube.getTimeFromURL(this.video.url)
        }
        return null;
      },
      twitchClipUrl(){
        if(this.video.type == 'twitch-clips'){
          let twitch_slug = this.video.url.substring(this.video.url.lastIndexOf("/") + 1, (this.video.url.lastIndexOf("?") !== -1 ? this.video.url.lastIndexOf("?") : this.video.url.length));
          let url = 'https://clips.twitch.tv/embed?clip=' + twitch_slug + '&autoplay=false&mute=false&parent=' + this.host;
          return url;
        }
        return null;
      },
      twitchVideoUrl(){
        if(this.video.type == 'twitch-videos'){
          let twitch_slug = this.video.url.substring(this.video.url.lastIndexOf("/") + 1, (this.video.url.lastIndexOf("?") !== -1 ? this.video.url.lastIndexOf("?") : this.video.url.length));
          let url = 'https://player.twitch.tv/?video=v' + twitch_slug + '&autoplay=false&mute=false&parent=' + this.host;
          return url;
        }
        return null;
      },
      streamableUrl(){
        if(this.video.type == 'streamable'){
          return 'https://streamable.com/o/' + this.video.url.substring(this.video.url.lastIndexOf("/") + 1, (this.video.url.lastIndexOf("?") !== -1 ? this.video.url.lastIndexOf("?") : this.video.url.length));
        }
        return null;
      },
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