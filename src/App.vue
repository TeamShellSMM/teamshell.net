<template>
  <div class="container">
    <template v-if="$route.params.team">
      <div class="row header-row">
        <div class="d-inline-flex header-flex-container" style="flex-wrap:wrap;">
          <div class="header-logo-div" style="">
            <h1 v-if="$route.params.team == 'teamshell'" ><router-link :to="'/'" class="mt-back-link"><i class="fas fa-chevron-left"></i></router-link><img class="buzzyS" src="/assets/teamshell/buzzySpin.gif"/><span class="teamshell-primary-fg">#Team</span><span class="teamshell-secondary-fg">Shell</span></h1>
            <h1 v-if="$route.params.team == 'teamjamp'" ><router-link :to="'/'" class="mt-back-link"><i class="fas fa-chevron-left"></i></router-link><img class="buzzyS teamjamp-logo" src="/assets/teamjamp/logo.png"/><span class="teamjamp-primary-fg">Team</span><span class="teamjamp-secondary-fg"> Jamp</span></h1>
            <h1 v-if="$route.params.team == 'teampipe'" ><router-link :to="'/'" class="mt-back-link"><i class="fas fa-chevron-left"></i></router-link><img class="buzzyS teamjamp-logo" src="/assets/teampipe/logo.png"/><span class="teampipe-primary-fg">#Team</span><span class="teampipe-secondary-fg">Pipe</span></h1>
          </div>
          <div v-if="$route.params.team == 'teamshell'" class="header-comp-div" style="">
            <div class="row comp-winners" >
              <div class="col-2" style="text-align: center;">
                <img src="/assets/teamshell/bam.png">
              </div>
              <div class="col-8">
                <div class="">
                  <h4 style="text-align:center;">Shell And Tell 1 - SMB1-like</h4>
                  <h5 style="text-align:center;font-family: 'Bangers', sans-serif"><div class="medal" style="margin-right:10px;padding-top: 2px;"><div class="coin coin-gold"></div></div>Permafrost #ST #TS by TheAnswer (<router-link to="/level/4WD-7GR-TWF">4WD-7GR-TWF</router-link>)</h5>
                  <h5 style="text-align:center;font-family: 'Bangers', sans-serif; margin-bottom:0px;"><router-link to="/teamshell/shellandtell/1">Check out the other winners here</router-link></h5>
                </div>
              </div>
              <div class="col-2" style="text-align: center;">
                <img src="/assets/teamshell/bam.png">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row nav-row">
        <div class="col-12">
          <ul id="nav" style="float:left;">
            <li>
              <router-link :to="'/' + $route.params.team + '/'">Home</router-link>
            </li>
            <li>
              <router-link :to="'/' + $route.params.team + '/levels'">Levels</router-link>
            </li>
            <li>
              <router-link :to="'/' + $route.params.team + '/makers'">Makers</router-link>
            </li>
            <li>
              <router-link :to="'/' + $route.params.team + '/members'">Members</router-link>
            </li>
          </ul>
          <ul id="nav" class="login-ul" style="float:right;">
            <li v-if="loggedIn">
              <button :class="$route.params.team + '-primary-bg'" class="btn random-button" title="Random Level" @click="randomLevel()"><i class="fa fa-random"></i></button>
              <span class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Logged in as {{userName}}</span>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" v-on:click="showFeedbackDialog()">Submit feedback</a>
                <a class="dropdown-item" href="#" v-on:click="logout()">Logout</a>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h4 v-if="$route.params.team == 'teamshell'">Join the discord for more information: <a href="https://discord.gg/7tQJewa">https://discord.gg/7tQJewa</a></h4>
          <h4 v-if="$route.params.team == 'teamjamp'">Join the discord for more information: <a href="https://discord.gg/rekPFnq">https://discord.gg/rekPFnq</a></h4>
          <h4 v-if="$route.params.team == 'teampipe'">Join the discord for more information: <a href="https://discord.gg/PcC5eKp ">https://discord.gg/PcC5eKp</a></h4>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="darkmode" v-model="theme" true-value="dark" false-value="light">
            <label class="form-check-label" for="darkmode">Dark Mode <i class="fa fa-moon-o" aria-hidden="true"></i></label>
          </div>
        </div>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </template>
    <template v-if="!$route.params.team">
      <div class="row header-row header-row-makerteams">
        <div class="d-inline-flex header-flex-container" style="flex-wrap:wrap;">
          <div class="header-logo-div" style="">
            <h1 class="logo-shadow"><span class="makerteams-primary-fg">Maker</span><span class="makerteams-secondary-fg">Teams</span></h1>
          </div>
        </div>
      </div>
      <div class="row nav-row-makerteams">
        <div class="col-12">
          <ul id="nav" class="makerteams-nav" style="float:left;">
            <li>
              <router-link :to="'/'">Teams</router-link>
            </li>
            <li>
              <router-link :to="'/features'">Features</router-link>
            </li>
            <li>
              <router-link :to="'/howtojoin'">How to join</router-link>
            </li>
          </ul>
        </div>
      </div>
      <router-view :key="$route.fullPath"></router-view>
      <div class="row" style="height:100px;">

      </div>
      <div class="makerteams-footer makerteams-secondary-bg">
        <h4>If you want your very own team bot and page, you can reach us on discord (<span class="teamshell-secondary-fg">Liaf#0443</span> or <span class="teamshell-secondary-fg">a_unique_id#6616</span>).</h4>
      </div>
    </template>
  </div>
</template>

<script>
  import { random, putFeedback } from './services/helper-service';
  import noUiSlider from 'nouislider';
  import 'nouislider/distribute/nouislider.css';

  export default {
    name: 'App',
    mounted() {
      if(this.$route.params.team){
        if(this.$store.state[this.$route.params.team].theme === "dark"){
          document.querySelector('html').classList.add('dark');
        }
      }
    },
    computed: {
      theme:{
        get: function(){
          if(this.$route.params.team){
            return this.$store.state[this.$route.params.team].theme;
          } else {
            return "light"
          }
        },
        set: function(theme){
          if(theme === "dark"){
            this.$store.commit(this.$route.params.team + '/setDark');
          } else {
            this.$store.commit(this.$route.params.team + '/setLight');
          }
        }
      },
      loggedIn: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].token ? true : false;
        }
        return false;
      },
      userName: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].user_info.Name;
        }
        return "";
      }
    },
    methods: {
      showFeedbackDialog(){
        let that = this;

        this.$dialog
        .confirm({
          title: "Submit your feedback (anonymously)",
          body: "<div class='feedback-div'><textarea rows='5' class='feedback-area' id='feedback-textarea'></textarea><div>"
        }, {
          html: true
        })
        .then(dialog => {
          // Triggered when proceed button is clicked
          // Show an alert with the user's input as the message
          console.log(dialog);

          $('.loader').show();
          putFeedback(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              message: $('#feedback-textarea').val()
          }, function(response){
            $('.loader').hide();
            if(response.status !== "successful"){
              that.$dialog.alert("<p>" + response.message + "</p>", {html: true});
            }
          })
        })
        .catch(() => {
          // Triggered when dialog is dismissed by user

          console.log('Prompt dismissed');
        });
      },
      logout(){
          this.$store.commit(this.$route.params.team + '/setToken', { token: null });
          this.$store.commit(this.$route.params.team + '/setUserInfo', { user_info: {} });
      },
      randomLevel(){
        let that = this;

        this.$dialog
        .confirm({
          title: "Choose difficulty range",
          body: "<div class='diff-range-container'><div id='difficulty-range-slider'></div><div>"
        }, {
          html: true
        })
        .then(dialog => {
          console.log("ok", dialog);
          let slider = document.getElementById('difficulty-range-slider');
          let diffs = slider.noUiSlider.get()
          that.$store.commit(that.$route.params.team + '/setLastDiffRange', diffs);

          $('.loader').show();
            random(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              minDifficulty: parseFloat(diffs[0]).toFixed(1),
              maxDifficulty: parseFloat(diffs[1]).toFixed(1)
            }, function(level){
              $('.loader').hide();
              console.log(level);
              if(level){
                that.$router.push("/" + that.$route.params.team + "/level/" + level.Code);
              } else {
                that.$dialog.alert("<p>Sorry, but we couldn't find a level in the specified difficulty range that you haven't cleared yet!</p>", {html: true});
              }
            });
        })
        .catch(() => {
          console.log('Prompt dismissed');
        });

        setTimeout(function(){
          let slider = document.getElementById('difficulty-range-slider');

          let formatNumber = {
            to: function(number){
              return number.toFixed(1);
            },
            from: function(text){
              return parseFloat(text);
            }
          }

          noUiSlider.create(slider, {
              start: [0.5, 11],
              connect: true,
              tooltips: [formatNumber, formatNumber],
              range: {
                  'min': 0.5,
                  'max': 11
              },
              step: 0.5,
              pips: {
                  mode: 'values',
                  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  density: 4
              }
          });

          if(that.$store.state[that.$route.params.team].last_diff_range){
            slider.noUiSlider.set(that.$store.state[that.$route.params.team].last_diff_range);
          }
        }, 50);
      }
    }
  };
</script>

<style>
  @import "//fonts.googleapis.com/css?family=Bangers&display=swap";
  @import "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css";
  @import "//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";
  @import "//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/css/jquery.dataTables.css";
  @import "//cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css";
  @import "assets/teamshell.css?v=1.0.5";
</style>
