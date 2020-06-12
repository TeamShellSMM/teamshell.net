<template>
  <div class="mb-2 feature-box">
    <div class="bs-callout bs-callout-race bs-callout-title" :class="$route.params.team + (race.status == 'upcoming' ? '-primary-blc' : '-secondary-blc')">
      <div class="bs-callout-title-box">
        <h2 :class="$route.params.team + '-primary-fg'" class="race-title">{{race.name}}</h2>
        <h3 class="race-date">{{formattedStartDate}}</h3>
        <h3 class="race-type">{{race.race_type}} Race<template v-if="lengthMinutes"> ({{lengthMinutes}} minutes)</template></h3>
        <p class="mt-2 mb-4">
          {{levelFilters}}<template v-if="race.level_filter_tag">, <span class='tag badge badge-pill' :class="'badge-' + race.level_filter_tag.type">{{race.level_filter_tag.name}}</span></template>
        </p>
        <template v-if="race.status == 'upcoming'">
          <h4 class="race-type">Registered Participants ({{finishedEntrants + unfinishedEntrants}})</h4>
          <div class="row">
            <div class="col-xl-3 mb-2 mt-2" v-for="entrant in race.race_entrants" :key="entrant.id">
              <h2 class="race-entrant-title" v-bind:style="{ color: entrant.member.hexColor }" ><img v-bind:src="entrant.member.avatarURL ? entrant.member.avatarURL : '/assets/defaults/discord-default-avatar.png'" class="maker-avatar" /> {{entrant.member.name}}<template v-if="loginName == entrant.member.name"> (You)</template></h2>
            </div>
          </div>
        </template>
        <template v-if="race.status != 'upcoming'">
          <div class="row">
            <div class="col-md-6" v-if="finishedEntrants > 0">
              <h4 class="race-type">Finished Participants ({{finishedEntrants}})</h4>
              <div class="row">
                <template v-for="entrant in race.race_entrants">
                  <div v-if="entrant.finished_date && entrant.rank" class="col-12 mb-2 mt-2" :key="entrant.id">
                    <h2 class="race-entrant-title"><span class="race-entrant-rank">#{{entrant.rank}}</span> <img v-bind:src="entrant.member.avatarURL ? entrant.member.avatarURL : '/assets/defaults/discord-default-avatar.png'" class="maker-avatar" /> <span v-bind:style="{ color: entrant.member.hexColor }">{{entrant.member.name}}</span><template v-if="loginName == entrant.member.name"> (You)</template></h2>
                  </div>
                </template>
              </div>
            </div>
            <div class="col-md-6" v-if="unfinishedEntrants > 0">
              <h4 class="race-type">Unfinished Participants ({{unfinishedEntrants}})</h4>
              <div class="row">
                <template v-for="entrant in race.race_entrants">
                  <div v-if="!entrant.finished_date" class="col-12 mb-2 mt-2" :key="entrant.id">
                    <h2 class="race-entrant-title" v-bind:style="{ color: entrant.member.hexColor }" ><img v-bind:src="entrant.member.avatarURL ? entrant.member.avatarURL : '/assets/defaults/discord-default-avatar.png'" class="maker-avatar" /> {{entrant.member.name}}<template v-if="loginName == entrant.member.name"> (You)</template></h2>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
        <h3 v-if="race.status == 'upcoming' && startsSoon && currentTimeMillis <= startDateMillis" class="race-time-remaining mt-3"><template v-if="race.level_filter_failed">Postponed (No level could be found) - Trying again</template><template v-if="!race.level_filter_failed">Race is starting</template> in: {{timeRemainingStart}}</h3>
        <h3 v-if="race.status == 'active' && currentTimeMillis <= endDateMillis" class="race-time-remaining mt-3">Race is ending in: {{timeRemainingEnd}}</h3>
        <template v-if="race.status == 'upcoming' && !race.level_filter_failed">
          <button v-if="participating" type="button" class="btn btn-circle race-button" :class="$route.params.team + '-primary-bg'" title="Leave Race"><i class="fa fa-sign-out-alt"></i></button>
          <button v-if="!participating" type="button" class="btn btn-circle race-button" :class="$route.params.team + '-primary-bg'" :title="loginName ? 'Enter Race' : 'You must login first to enter the race!'" :disabled="!loginName"><i class="fa fa-sign-in-alt"></i></button>
        </template>
        <template v-if="race.status == 'active' && race.race_type == 'FC'">
          <button v-if="participating" type="button" class="btn btn-circle race-button" :class="$route.params.team + '-primary-bg'" title="Finish Race"><i class="fa fa-flag-checkered"></i></button>
        </template>
      </div>
      <h2 v-if="race.status == 'finished'" class="race-ribbon" :class="$route.params.team + '-primary-bg'"><i class="fa fa-flag-checkered"></i></h2>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'race-component',
    props: {
      race: Object,
      serverTimeDifferenceMillis: Number
    },
    data(){
      return {
        loginName: "",
        participating: false,
        lengthMinutes: "",
        startsSoon: false,
        currentTimeMillis: 0,
        startDateMillis: 0,
        endDateMillis: 0,
        timeRemainingStart: "00:00:00",
        timeRemainingEnd: "00:00:00",
        unfinishedEntrants: 0,
        finishedEntrants: 0,
        readyForReload: false
      };
    },
    mounted(){
      if(this.$store.state[this.$route.params.team].user_info){
        this.loginName = this.$store.state[this.$route.params.team].user_info.name;
      }

      for(let entrant of this.race.race_entrants){
        if(entrant.member.name == this.loginName){
          this.participating = true;
        }
        if(entrant.finished_date){
          this.finishedEntrants++;
        } else {
          this.unfinishedEntrants++;
        }
      }

      let start_date = moment(this.race.start_date);
      let end_date = moment(this.race.end_date);

      let duration = moment.duration(end_date.diff(start_date));
      this.lengthMinutes = duration.asMinutes();

      if(this.serverTimeDifferenceMillis){
        //We're sending the current moment time to the web api and it gives back the time difference between that and the server time, then we add this here so we are in sync with the server
        this.currentTimeMillis = moment().valueOf() + this.serverTimeDifferenceMillis - 1000; //Minus 1 second to be safe (so it doesn't refresh before the server has started the race)
      } else {
        this.currentTimeMillis = moment().valueOf();
      }
      this.startDateMillis = start_date.valueOf();
      this.endDateMillis = end_date.valueOf();

      if(this.race.status == "upcoming"){
        this.recalcTimeRemainingStart();
      }
      if(this.race.status == "active"){
        this.recalcTimeRemainingEnd();
      }

      let that = this;
      setTimeout(() => {
        that.readyForReload = true;
      }, 5000);
    },
    computed: {
      formattedStartDate(){
        let startDate = moment(this.race.start_date)
        let strFormatted = startDate.format("YYYY/MM/DD HH:mm:ss") + " UTC";
        if(this.race.status == "upcoming" && !this.startsSoon){
          strFormatted += " (" + startDate.fromNow() + ")";
        }
        return strFormatted;
      },
      levelFilters(){
        let vars = [];

        let levelType = "MISSING LEVEL TYPE";
        if(this.race.level_type == "random-uncleared"){
          levelType = "Random Uncleared";
        } else if (this.race.level_type == "random") {
          levelType = "Random Cleared & Uncleared";
        } else if (this.race.level_type == "specific-level"){
          levelType = "Specific Level";
        }

        vars.push(levelType);

        let diffString = this.race.level_filter_diff_from.toFixed(1);
        if(this.race.level_filter_diff_from < this.race.level_filter_diff_to){
          diffString += " - " + this.race.level_filter_diff_to.toFixed(1)
        }

        vars.push(diffString);

        let submissionFilter = "";
        if (this.race.level_filter_submission_time_type == "month"){
          submissionFilter = "submitted in the last 30 days";
        } else if(this.race.level_filter_submission_time_type == "week") {
          submissionFilter = "submitted in the last 7 days";
        }

        if(submissionFilter){
          vars.push(submissionFilter);
        }

        return vars.join(", ");
      }
    },
    methods: {
      recalcTimeRemainingStart(){
        this.timeRemainingStart = moment.utc(this.startDateMillis - this.currentTimeMillis).format("HH:mm:ss");

        if((this.startDateMillis - this.currentTimeMillis) < 1000*60*60){
          this.startsSoon = true;
        }

        if(this.currentTimeMillis >= this.startDateMillis && this.readyForReload){
          //TODO: trigger reload
          console.log("triggering reload, race has started");
          this.readyForReload = false;
        }
      },
      recalcTimeRemainingEnd(){
        this.timeRemainingEnd = moment.utc(this.endDateMillis - this.currentTimeMillis).format("HH:mm:ss");

        if(this.currentTimeMillis >= this.endDateMillis && this.readyForReload){
          //TODO: trigger reload
          console.log("triggering reload, race has ended");
          this.readyForReload = false;
        }
      }
    },
    watch: {
      currentTimeMillis: {
        handler(value) {
          if((this.race.status == "upcoming" || this.race.status == "active") && value > 0){
            setTimeout(() => {
              this.currentTimeMillis += 1000;
              if(this.race.status == "upcoming"){
                this.recalcTimeRemainingStart();
              }
              if(this.race.status == "active"){
                this.recalcTimeRemainingEnd();
              }
            }, 1000);
          }
        },
        immediate: true // This ensures the watcher is triggered upon creation
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>