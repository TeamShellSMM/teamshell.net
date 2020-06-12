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
        <button v-if="teamAdmin" type="button" class="btn btn-circle new-race-button" :class="$route.params.team + '-primary-bg'" title="New Race" v-on:click="newRace()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="row">
      <div class="container">
        <h3 id="table_title" class="maker-detail-title mt-0">Active Races</h3>
        <p v-if="false">There are currently no active races.</p>
        <race-component :race="testRaceActive"></race-component>
        <h3 id="table_title" class="maker-detail-title">Upcoming Races</h3>
        <p v-if="false">Currently no upcoming races in the next few weeks.</p>
        <race-component :race="testRace"></race-component>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint } from '../services/helper-service';
  import raceComponent from '../components/RaceComponent';

  export default {
    name: 'Races',
    components: {
      raceComponent
    },
    data() {
      return {
        "data": null,
        "testRace": {
          name: "Weekly Teamshell Race",
          status: "active",
          start_date: "2020-06-12T19:40:00.000Z",
          end_date: "2020-06-12T20:40:00.000Z",
          race_type: "FC",
          level_type: "random-uncleared",
          level_filter_diff_from: 1.0,
          level_filter_diff_to: 2.0,
          level_filter_tag: {
            id: 1,
            name: "SMB1",
            type: "success"
          },
          level_filter_submission_time_type: "month",
          level_code: null,
          level_filter_failed: true,
          race_entrants: [
            {
              "finished_date": "2020-06-10T23:15:00.000Z",
              "rank": 1,
              "member": {"id":1,"created_at":"2019-09-29T10:42:53.000Z","updated_at":null,"deleted_at":null,"name":"Space_Pig","is_member":1,"discord_name":"Space_Pig","maker_id":null,"maker_name":null,"world_description":null,"badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":0,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":1978.9,"levels_created":11,"levels_cleared":449,"is_mod":1,"maker_points":2488.5,"own_score":58,"free_submissions":0,"creator_id":1,"hexColor":"#9b59b6","avatarURL":"https://cdn.discordapp.com/avatars/155778181125636096/8e67a9d517379835f53200de6a67088b.png?size=128"},
            },
            {
              "finished_date": "2020-06-10T23:17:00.000Z",
              "rank": 2,
              "member": {"finished_date": "2020-06-10T23:15:00.000Z", rank: 1, "id":48,"created_at":"2019-09-29T21:00:10.000Z","updated_at":null,"deleted_at":null,"name":"Mumbo","is_member":1,"discord_name":"𝐦Ữ𝓂๒๏","maker_id":null,"maker_name":null,"world_description":null,"badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":null,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":2742.1,"levels_created":3,"levels_cleared":1011,"is_mod":1,"maker_points":52.6,"own_score":14.7,"free_submissions":0,"creator_id":48,"hexColor":"#ff61c0","avatarURL":"https://cdn.discordapp.com/avatars/103802162731057152/203e9be02af56b30824a5b5b08b8f877.png?size=128"},
            },
          ]
        },
        "testRaceActive": {
          name: "Active Race",
          status: 'active',
          start_date: "2020-06-11T20:00:00.000Z",
          end_date: "2020-06-11T21:00:00.000Z",
          race_type: "FC",
          level_type: "random",
          level_filter_diff_from: 0.0,
          level_filter_diff_to: 10.0,
          level_filter_tag: {
            id: 8,
            name: "Shell And Tell",
            type: "primary"
          },
          level_filter_submission_time_type: "all",
          level_code: null,
          level_filter_failed: false,
          race_entrants: [
            {
              "finished_date": null,
              "rank": null,
              "member": {"id":218,"created_at":"2019-11-30T19:38:55.000Z","updated_at":null,"deleted_at":null,"name":"Liaf","is_member":1,"discord_name":"Liaf","maker_id":"2MT-MQB-WTF","maker_name":"Liaf","world_description":"","badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":null,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":4493,"levels_created":4,"levels_cleared":1423,"is_mod":1,"maker_points":250.3,"own_score":8.1,"free_submissions":2,"creator_id":218,"hexColor":"#f5910c","avatarURL":"https://cdn.discordapp.com/avatars/284027418375618570/db9547261d833643578727146f6315a7.png?size=128"}
            },
            {
              "finished_date": "2020-06-10T23:15:00.000Z",
              "rank": 1,
              "member": {"id":39,"created_at":"2019-09-29T10:42:53.000Z","updated_at":null,"deleted_at":null,"name":"a_unique_id","is_member":1,"discord_name":"a_unique_id","maker_id":"SQ3-6BD-35G","maker_name":null,"world_description":null,"badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":0,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":39.8,"levels_created":6,"levels_cleared":24,"is_mod":null,"maker_points":183.5,"own_score":17.6,"free_submissions":2,"creator_id":39,"hexColor":"#f1c40f","avatarURL":"https://cdn.discordapp.com/avatars/456681756750249994/0da243a918267b6cba6c79035e53517a.png?size=128"}
            },
            {
              "finished_date": "2020-06-10T23:15:00.000Z",
              "rank": 2,
              "member": {"id":1,"created_at":"2019-09-29T10:42:53.000Z","updated_at":null,"deleted_at":null,"name":"Space_Pig","is_member":1,"discord_name":"Space_Pig","maker_id":null,"maker_name":null,"world_description":null,"badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":0,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":1978.9,"levels_created":11,"levels_cleared":449,"is_mod":1,"maker_points":2488.5,"own_score":58,"free_submissions":0,"creator_id":1,"hexColor":"#9b59b6","avatarURL":"https://cdn.discordapp.com/avatars/155778181125636096/8e67a9d517379835f53200de6a67088b.png?size=128"}
            },
            {
              "finished_date": null,
              "rank": null,
              "member": {"id":48,"created_at":"2019-09-29T21:00:10.000Z","updated_at":null,"deleted_at":null,"name":"Mumbo","is_member":1,"discord_name":"𝐦Ữ𝓂๒๏","maker_id":null,"maker_name":null,"world_description":null,"badges":null,"twitch":null,"youtube":null,"twitter":null,"is_banned":null,"atme":null,"discord_id_temp":null,"world_world_count":0,"world_level_count":0,"clear_score_sum":2742.1,"levels_created":3,"levels_cleared":1011,"is_mod":1,"maker_points":52.6,"own_score":14.7,"free_submissions":0,"creator_id":48,"hexColor":"#ff61c0","avatarURL":"https://cdn.discordapp.com/avatars/103802162731057152/203e9be02af56b30824a5b5b08b8f877.png?size=128"}
            }
          ]
        }
      };
    },
    mounted(){
      //let that = this;
    },
    computed: {
      teamAdmin:function(){
        return this.$route.params.team && this.$store.state[this.$route.params.team].teamAdmin
      }
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

      },
      newRace(){
        this.$dialog.alert(this.$route.params.team, {
          view: 'race-edit-component', // can be set globally too
          html: true,
          animation: 'fade',
          backdropClose: true,
          customClass: "race-dialog"
        })
        .then((obj) => { //dialog
          // Triggered when proceed button is clicked
          // Show an alert with the user's input as the message
          console.log(obj.data);
        })
        .catch(() => {
          // Triggered when dialog is dismissed by user
          console.log('Prompt dismissed');
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>