<template>
  <div class="row">
    <div class="container">
      <div id="filter_form_cont">
        <div class="form-group row mb-1">
          <div class="col-md-4">
            <label for="active_comp_group">Competition Category</label>
            <select id="active_comp_group" v-model="active_competition_group" class="form-control" @change="refresh()">
              <option v-for="competition_group in competition_groups" :key="competition_group.id" :value="competition_group">{{competition_group.name}}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="active_comp">Competition</label>
            <select id="active_comp" v-model="active_competition" class="form-control" @change="refresh()">
              <option v-for="competition in filteredCompetitions" :key="competition.id" :value="competition">#{{competition.comp_number}} {{competition.description}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="container mb-5">
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
    </div>
  </div>
</template>

<script>
  import { loadEndpoint, makeLevelsDatatable } from '../services/helper-service';

  export default {
    name: 'ShellAndTell',
    data() {
      return {
        "competitions" : [],
        "data": {},
        "competition_winners": [],
        "tag_labels": [],
        "competition_groups": [],
        "active_competition": '',
        "active_competition_group": ''
      };
    },
    mounted(){
      let that = this;

      makeLevelsDatatable({$,id:'#table',that,hidden:[],compMode: true})
      this.getData();
    },
    computed: {
      filteredCompetitions(){
        let that = this;
        return this.competitions.filter(comp => {
          if(that.active_competition_group){
            return comp.competition_group_id == that.active_competition_group.id;
          }
          return false;
        })
      }
    },
    methods: {
      getHighestActiveCompRankForLevel(level_id){
        let highest_rank = 6;
        if(this.active_competition){
          for(let comp_winner of this.competition_winners){
            if(comp_winner.code == level_id && comp_winner.competition_id == this.active_competition.id){
              if(comp_winner.rank < highest_rank){
                highest_rank = comp_winner.rank;
              }
            }
          }
        }
        return highest_rank;
      },
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
        $('.loader').show();
        $('th').tooltip()
        let that = this;

        this.tag_labels=this.data.tags;
        this.competitions = this.data.competitions;
        this.competition_winners = this.data.competition_winners;

        this.competition_groups = [];
        for(let competition of this.competitions){
          if(this.competition_groups.map(x => x.id).indexOf(competition.competition_group[0].id) === -1){
            this.competition_groups.push(competition.competition_group[0]);
          }
        }

        if(!this.active_competition){
          this.active_competition = this.competitions.slice(-1).pop();
          this.active_competition_group = this.active_competition.competition_group[0];
        }
        if(this.active_competition.competition_group_id != this.active_competition_group.id){
          this.active_competition = this.filteredCompetitions.slice(-1).pop();
        }

        let filtered_levels=this.data.levels.filter((level)=>{
          let curr_tags=level.tags.split(',')
          if(that.active_competition_group){ //if a tag is selected
            //if the level doen't have the current tag, don't include
            if(curr_tags.indexOf(that.active_competition_group.competition_tag)=="-1"){
              return false
            }
          } else {
            return false;
          }

          if(that.active_competition){
            if(!(level.created_at >= that.active_competition.start_date && level.created_at < that.active_competition.end_date)){
              return false;
            }
          } else {
            return false;
          }

          return true;
        });

        filtered_levels.sort(function(a, b){
          let aRank = that.getHighestActiveCompRankForLevel(a.id);
          let bRank = that.getHighestActiveCompRankForLevel(b.id)

          if(aRank > bRank){
            return 1;
          } else if(aRank < bRank){
            return -1;
          } else {
            return 0;
          }
        });

        var datatable=$('#table').DataTable()
        datatable.clear();
        datatable.rows.add(filtered_levels)
        datatable.draw();
        $('.loader').hide();
        $('[data-toggle="tooltip"],#refresh,#submitButton,.medal').tooltip()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
