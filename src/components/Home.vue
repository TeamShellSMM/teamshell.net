<template>
  <div class="">
    <div class="row" v-if="!loggedIn">
      <h2 class="howto-header">How to become a part of the team</h2>
      <div class="howto-content">
        <div class="howto-bg-element">

        </div>
        <div class="howto-step howto-step-1" :class="$route.params.team + '-primary-bg'">
          <canvas width="10" height="10" class="howto-circle">

          </canvas>
          <i class='fab fa-discord howto-icon'></i>
          <div class="howto-text-container">
            <h4>Step #1</h4>
            <p>
              Join the discord (the link is up top) and use
            </p>
            <p class="text-bold">
              !register YourName
            </p>
            <p>
              in the #{{$store.state[$route.params.team].teamSettings.RegistrationChannel || 'bot-command'}} text-channel to register with your desired name!
            </p>
          </div>
        </div>
        <div class="howto-step howto-step-2" :class="$route.params.team + '-secondary-bg'">
          <canvas width="10" height="10" class="howto-circle">

          </canvas>
          <i class='fas fa-sign-in-alt howto-icon'></i>
          <div class="howto-text-container">
            <h4>Step #2</h4>
            <p>
              After that you can go to the #{{$store.state[$route.params.team].teamSettings.MiscChannel || 'bot-command'}} text-channel and use
            </p>
            <p class="text-bold">
              !login
            </p>
            <p>
              to get a login URL for this webpage
            </p>
          </div>
        </div>
        <div class="howto-step howto-step-3" :class="$route.params.team + '-primary-bg'">
          <canvas width="10" height="10" class="howto-circle">

          </canvas>
          <i class='fas fa-heart howto-icon'></i>
          <div class="howto-text-container">
            <h4>Step #3</h4>
            <p>
              Play some levels from the list on this site and submit your clears by clicking the clear or like button on the right side of each level.
            </p>
            <p>
              For beginners we'd recommend playing stuff with a lower difficulty.
            </p>
          </div>

        </div>
        <div class="howto-step howto-step-4" :class="$route.params.team + '-secondary-bg'">
          <canvas width="10" height="10" class="howto-circle">

          </canvas>
          <i class='fas fa-thumbs-up howto-icon'></i>
          <div class="howto-text-container">
            <h4>Step #4</h4>
            <p>{{$store.state[$route.params.team].teamSettings.AddLevelRequirements}}</p>
            <p class="text-bold">
              !add XXX-XXX-XXX LevelName
            </p>
            <p>
              As soon as it's approved by the {{$store.state[$route.params.team].teamSettings.ModName}} you're done and you'll get your official initiation into the team!
            </p>
          </div>
        </div>
      </div>
      <p class="howto-footer">If you need any help you can always ask in one of the text channels or you can just message a {{$store.state[$route.params.team].teamSettings.ModName}}. {{$store.state[$route.params.team].teamSettings.HaveFun}}</p>
    </div>
    <div class="row">
      <div class="col-md-6">
        <h4>Current Stats</h4>
        <table class="dashboard">
          <tr><td>Official Levels</td><td id="numApproved">Loading</td></tr>
          <tr><td>Pending Levels</td><td id="numPending">Loading</td></tr>
          <tr><td>Members</td><td id="numMembers">Loading</td></tr>
          <tr><td>Unoffical Members</td><td id="numUnofficialMembers">Loading</td></tr>
          <tr><td>Clears</td><td id="numClears">Loading</td></tr>
          <tr><td>Votes</td><td id="numVotes">Loading</td></tr>
          <tr><td>Likes</td><td id="numLikes">Loading</td></tr>
          <tr><td>Maximum Score</td><td id="maxScore">Loading</td></tr>
          <tr v-if="$route.params.team == 'teamshell'"><td>Shell Jamps Done</td><td>A Lot</td></tr>
        </table>
        <h4>Levels by difficulty</h4>
        <div class="chart-container" style="position: relative;width:100%;">
          <canvas id="difficulty_chart"></canvas>
        </div>
      </div>
      <div class="col-md-2">
      </div>
      <div class="col-md-4" v-if="$store.state[$route.params.team].teamSettings.TwitterUser">
        <h4>We have a twitter now! <a v-bind:href="'https://twitter.com/'+$store.state[$route.params.team].teamSettings.TwitterUser">https://twitter.com/{{$store.state[$route.params.team].teamSettings.TwitterUser}}</a></h4>
        <div class="embed-responsive-item">
          <Timeline v-bind:id="$store.state[$route.params.team].teamSettings.TwitterUser" sourceType="profile" :key="theme" :options="timelineOptions"></Timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Timeline } from 'vue-tweet-embed'
  import { Chart } from 'chart.js';
  import { loadEndpoint } from '../services/helper-service';

  export default {
    name: 'Home',
    components: {
      Timeline
    },
    data() {
      return {
        'tweetLimit': 3,
        'theme': 'dark',
        'data': '',
        'level_headers': '',
        'tag_labels': '',
        'spig_fav': '',
        'clearers': '',
        'clears': '',
        'raw_data': '',
        'tags_list': ''
      };
    },
    mounted(){
      this.theme = this.$store.state[this.$route.params.team].theme;

      if(this.$store.state[this.$route.params.team].theme === "dark"){
        document.querySelector('html').classList.add('dark');
      }

      this.getData();
    },
    computed: {
      timelineOptions(){
        let options = {};
        options.tweetLimit = this.tweetLimit;
        options.theme = this.theme;
        return options;
      },
      loggedIn: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].token ? true : false;
        }
        return false;
      },
    },
    created(){
      this.$store.subscribe((mutation, state) => {
        if(mutation.type === this.$route.params.team + "/setDark" || mutation.type === this.$route.params.team + "/setLight"){
          this.theme = state[this.$route.params.team].theme;
        }
      });
    },
    methods: {
      getData(){
        $('.loader').show();
        let that = this;
        loadEndpoint({
          that,
          data:{
            dashboard:true,
          },
          onLoad(_rawData){
            that.data=_rawData
            that.refresh()

            $('.loader').hide();
          },
        })
      },
      refresh(){
        var dashboardData={
          "numApproved":0,
          "numPending":0,
          "numMembers":0,
          "numUnofficialMembers":0,
          "numClears":0,
          "numVotes":0,
          "numLikes":0,
          "maxScore":0,
        }

        var all_difficulty=["0.1"]
        var difficulty_no={
          "0.1":0
        }

        const maxDifficulty=Number(this.$store.state[this.$route.params.team].teamSettings.maxDifficulty) || 10

        for(var i=0.5 ;i<=maxDifficulty;i+=0.5){
          all_difficulty.push(i.toString())
          difficulty_no[i.toString()]=0
        }

        this.clearers=[]
        this.clears={}
        this.tag_labels=this.data.tags
        this.tags_list=[];



        for(let i=0;i<this.data.levels.length;i++){ //main loop that processes all the stats for the levels
          let level=this.data.levels[i]
          dashboardData.numClears+= (level.clears||0)
          dashboardData.numVotes += (level.num_votes||0)
          dashboardData.numLikes += (level.likes||0)

          var include=true;
          //get all the tags used from the data set
          var curr_tags=level.tags.split(",")
          for(var k=0;k<curr_tags.length;k++){
            if(this.data.seperate.indexOf(curr_tags[k])!=-1){
              include=false
            }
          }

          if(level.status=="0"){
            dashboardData.numPending++
          }

          if(include && level.status===1){
            dashboardData.maxScore += (level.score||0)
            difficulty_no[level.difficulty]++
            dashboardData.numApproved++;
          }

        }

        dashboardData.numMembers=this.data.dashboard.members.official;
        dashboardData.numUnofficialMembers=this.data.dashboard.members.unoffocial;
        for(let i in dashboardData){
          $("#"+i).html(Math.round(dashboardData[i]))
        }
        var difficulty_no_data=[]
        var backgroundColor=[]
        for(let i=0;i<all_difficulty.length;i++){
          difficulty_no_data.push(difficulty_no[all_difficulty[i]])
          backgroundColor.push('rgba(248,133 , 1, 1)')
        }


        var ctx = document.getElementById('difficulty_chart');
        new Chart(ctx, {
            type: 'horizontalBar',
            responsive:true,
            maintainAspectRatio: false,
            data: {
                labels: all_difficulty,
                datasets: [{
                    //barThickness:20,
                    label: '# of levels with stated difficulty',
                    data: difficulty_no_data,
                    backgroundColor:backgroundColor,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                layout: {
                  padding: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                  }
              }
            }
        });
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
