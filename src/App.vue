<template>
  <div class="container">
    <div class="row header-row">
      <div class="col-xl-7">
        <h1><img src="/assets/buzzySpin.gif"/> <span class="green">#Team</span><span class="orange">Shell</span> Levels</h1>
        <ul id="nav">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/levels">Levels</router-link>
          </li>
          <li>
            <router-link to="/makers">Makers</router-link>
          </li>
          <li>
            <router-link to="/members">Members</router-link>
          </li>
        </ul>
        <h4>Join the discord for more information: <a href="https://discord.gg/7tQJewa">https://discord.gg/7tQJewa</a></h4>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="darkmode" v-model="theme" true-value="dark" false-value="light">
          <label class="form-check-label" for="darkmode">Dark Mode <i class="fa fa-moon-o" aria-hidden="true"></i></label>
        </div>
      </div>
      <div class="col-xl-5" style="display:none;">
        <div class="row comp-winners" >
          <div class="col-md-2" style="text-align: center;">
            <i class="fa fa-trophy"></i>
          </div>
          <div class="col-md-10">
            <div class="">
              <h4>Winners - Shell and Tell 1 (SMB1-like)</h4>
              <h6><div class="medal" style="margin-right:10px;"><div class="coin coin-gold"></div></div>Gimme Shellter by Hauspanther (3PG-DT0-NRF)</h6>
              <h6><div class="medal" style="margin-right:10px;"><div class="coin coin-silver"></div></div>Rocky Mountains: #TeamShell by cheese_chicken3 (C16-BT1-NVG)</h6>
              <h6><div class="medal" style="margin-right:10px;"><div class="coin coin-bronze"></div></div>#TeamShell: Buckets O. Fun v2 by Dekaizo (3PQ-0PV-LXF)</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      if(this.$store.state.theme === "dark"){
        document.querySelector('html').classList.add('dark');
      }
    },
    computed: {
      theme:{
        get: function(){
          return this.$store.state.theme;
        },
        set: function(theme){
          if(theme === "dark"){
            this.$store.commit('setDark');
          } else {
            this.$store.commit('setLight');
          }
        }
      }
    }
  };
</script>

<style>
  @import "//fonts.googleapis.com/css?family=Bangers&display=swap";
  @import "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css";
  @import "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
  @import "//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/css/jquery.dataTables.css";
  @import "assets/teamshell.css?v=1.0.5";
</style>
