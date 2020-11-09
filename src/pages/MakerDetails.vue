<template>
  <div class="container">
    <h2 v-if="data" id="table_title" class="maker-detail-title" v-bind:style="{ color: data.maker.hexColor }" ><img v-bind:src="data.maker.avatarURL ? data.maker.avatarURL : '/assets/defaults/discord-default-avatar.png'" class="maker-avatar" /> {{$route.params.name}}</h2>
    <h2 v-if="!data" id="table_title" class="maker-detail-title"><img src="/assets/defaults/discord-default-avatar.png" class="maker-avatar" /> {{$route.params.name}}</h2>

    <h3 id="table_title" class="maker-detail-title">Levels</h3>

    <table id="table" class="compact row-border stripe hover" style="width:100%">
      <thead><tr>
        <th class="all" style="width:10px;">No.</th>
        <th class="all" style="width:10em;"><span class="diff-text-default">Level Code</span><span class="diff-text-mobile">Code</span></th>
        <th style="width:10em">Creator</th>
        <th class="all">Level Name</th>
        <th class="all" style="width:10px"><span class="diff-text-default">Difficulty</span><span class="diff-text-mobile">Diff</span></th>
        <th>Approved</th>
        <th style="width:10px">New Code</th>
        <th style="width:10px">Video</th>
        <th style="width:5em">Registered On</th>
        <th style="width:5em">Tags</th>
        <th style="width:10px">Clears</th>
        <th style="width:10px">Diff Vote</th>
        <th style="width:10px">Likes</th>
        <th style="width:10px" title="Like-Clear-Diff Score (aka how many Maker Points this level is worth)"><span class="diff-text-default">LCD Score</span><span class="diff-text-mobile">LCD</span></th>
        <th class="all" style="width:10px"><span class="diff-text-default">Clear</span><span class="diff-text-mobile"><i class='fa fa-check text-success' aria-hidden='true'></i></span></th>
        <th style="width:10px">Your Vote</th>
        <th class="all" style="width:10px"><span class="diff-text-default">Like</span><span class="diff-text-mobile"><i class='fa fa-heart text-danger' aria-hidden='true'></i></span></th>
      </tr></thead>
    </table>

    <template v-show="data && data.collabs && data.collabs.length > 0">
      <h3 id="table_title" class="maker-detail-title">Collabs</h3>

      <table id="table2" class="compact row-border stripe hover" style="width:100%">
        <thead><tr>
          <th class="all" style="width:10px;">No.</th>
          <th class="all" style="width:10em;"><span class="diff-text-default">Level Code</span><span class="diff-text-mobile">Code</span></th>
          <th style="width:10em">Creator</th>
          <th class="all">Level Name</th>
          <th class="all" style="width:10px"><span class="diff-text-default">Difficulty</span><span class="diff-text-mobile">Diff</span></th>
          <th>Approved</th>
          <th style="width:10px">New Code</th>
          <th style="width:10px">Video</th>
          <th style="width:5em">Registered On</th>
          <th style="width:5em">Tags</th>
          <th style="width:10px">Clears</th>
          <th style="width:10px">Diff Vote</th>
          <th style="width:10px">Likes</th>
          <th style="width:10px" title="Like-Clear-Diff Score (aka how many Maker Points this level is worth)"><span class="diff-text-default">LCD Score</span><span class="diff-text-mobile">LCD</span></th>
          <th class="all" style="width:10px"><span class="diff-text-default">Clear</span><span class="diff-text-mobile"><i class='fa fa-check text-success' aria-hidden='true'></i></span></th>
          <th style="width:10px">Your Vote</th>
          <th class="all" style="width:10px"><span class="diff-text-default">Like</span><span class="diff-text-mobile"><i class='fa fa-heart text-danger' aria-hidden='true'></i></span></th>
        </tr></thead>
      </table>
    </template>

    <h3 id="table_title" class="maker-detail-title">Plays</h3>

    <div id="playedTableCont" class="level-detail-played-table">
      <table id="playedTable" class="compact row-border stripe hover" style="width:100%;">
        <thead><tr>
          <th style="width:10px;">No.</th>
          <th style="width:10em">Code</th>
          <th style="width:10em">Level Name</th>
          <th style="width:10em">Level Creator</th>
          <th style="width:10em">Level Difficulty</th>
          <th>Player</th>
          <th style="width:10em">Cleared</th>
          <th style="width:10em">{{$store.state[$route.params.team].teamSettings.ModName}}</th>
          <th style="width:10px">Liked</th>
          <th style="width:10px">Videos</th>
          <th style="width:10px">Difficulty Voted</th>
          <th style="width:5em">Submitted</th>
        </tr></thead>
      </table>
    </div>
  </div>
</template>

<script>
  import { loadEndpoint, makeClearDatatable, makeLevelsDatatable} from '../services/helper-service';
  export default {
    name: 'MakerDetails',
    data(){
      return{
        data: null,
        ...this.$store.state[this.$route.params.team].teamvars,
      }
    },
    mounted(){
      let that = this;
      $('th').tooltip();
      makeClearDatatable($,'#playedTable',this,this.$route.params.team === "curatedtrolls" ? [5, 7, 4, 10] : [5, 7],'plays');
      makeLevelsDatatable({$,id:'#table',that,hidden: this.$route.params.team === "curatedtrolls" ? [2, 4, 11, 15] : [2]});
      makeLevelsDatatable({$,id:'#table2',that,hidden: this.$route.params.team === "curatedtrolls" ? [4, 11, 15] : []});
      this.getData();
    },
    computed: {
      loggedIn: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].token ? true : false;
        }
        return false;
      },
      username:function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].user_info.name;
        }
        return false;
      },
    },
    methods: {
      refresh(){
        this.tag_labels=this.data.tags;
        this.competition_winners = this.data.competition_winners;
        var datatable=$('#table').DataTable()
        datatable.clear();
        datatable.rows.add(this.data.levels)
        datatable.draw();

        if(this.data.collabs && this.data.collabs.length > 0){
          console.log("should refresh", this.data.collabs);
          var datatableCollabs=$('#table2').DataTable()
          datatableCollabs.clear();
          datatableCollabs.rows.add(this.data.collabs)
          datatableCollabs.draw();
        }

        if(this.data.plays){
          const datatable2=$('#playedTable').DataTable()
          datatable2.clear();
          datatable2.rows.add(this.data.plays)
          datatable2.draw();
        }

        $('.loader').hide();
        $('[data-toggle="tooltip"],#refresh,#submitButton,.medal').tooltip()

      },
      getData(){
        $('.loader').show();
        let that = this;
        loadEndpoint({
          that,
          data:{
            name: that.$route.params.name,
          },
          onLoad(_rawData){
            that.data=_rawData
            that.refresh()
          },
        })
      }
    }
  }
</script>
