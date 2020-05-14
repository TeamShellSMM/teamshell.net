<template>
  <div class="container">
    <h2 id="table_title" :class="$route.params.team + '-secondary-fg maker-detail-title'">{{$route.params.name}}'s Levels</h2>
    
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

    <h2 id="table_title" :class="$route.params.team + '-secondary-fg maker-detail-title'">{{$route.params.name}}'s Plays</h2>

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
          <th style="width:10em">{{ModName}}</th>
          <th style="width:10px">Liked</th>
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
        ...this.$store.state[this.$route.params.team].teamvars,
      }
    },
    mounted(){
      let that = this;
      $('th').tooltip();
      makeClearDatatable($,'#playedTable',this,[5,7],'plays');
      makeLevelsDatatable({$,id:'#table',that,hidden:[2] });
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
