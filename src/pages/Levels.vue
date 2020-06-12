<template>
  <div class="container">
    <div id="filter_form_cont">
      <div class="form-group row">
        <div class="col-md-6">
        <label for="searchTerm">Search Term</label>
        <input name="member" type="text" class="form-control" id="searchTerm" autocomplete="off" placeholder="Search Term" @change="clientReload()">
        <small class="form-text text-muted">With this you can search for a certain creator or levelname.</small>
        </div>

        <div v-if="loggedIn" class="col-md-3" @change="clientReload()">
        <label for="clearedLevel">Cleared</label>
        <select name="cleared" id="clearedLevel" class="form-control">
            <option value="1" selected>All</option>
            <option value="2">Uncleared Only</option>
            <option value="3">Cleared Only</option>
          </select>
        </div>


          <div class="col-md-3" @change="clientReload()">
          <label for="pendingLevel">Levels</label>
          <select name="approved" id="pendingLevel" class="form-control">
            <option value="approved" selected>Approved</option>
            <option value="pending" >Pending</option>
            <option value="infix" >In Fix Request</option>
            <option value="all">All</option>
          </select>
          <small class="form-text text-muted">Approved levels are levels that have been played and approved by a moderator.</small>
        </div>

      </div>
      <div class="form-group row">

      <div class="col-md-3" @change="clientReload()">
      <label for="minDifficulty">Min Difficulty</label>
      <input type="number" id="minDifficulty" name="minDifficulty" placeholder="0" step="0.5" min="0" max="12" class="form-control" />
          <small class="form-text text-muted">Minimum difficulty to show.</small>
        </div>

        <div class="col-md-3" @change="clientReload()">
      <label for="maxDifficulty">Max Difficulty</label>
      <input type="number" id="maxDifficulty" name="maxDifficulty" placeholder="10"  step="0.5" min="0" max="12" class="form-control" />
          <small class="form-text text-muted">Maximum difficulty to show.</small>
        </div>


      <div class="col-md-4" @change="clientReload()">
      <label for="tagSelect">Tags</label>
      <select name="tag" id="tagSelect" class="form-control"></select>
          <small class="form-text text-muted">Default view will show all Team Levels.</small>
        </div>


        <div class="col-md-2"><label for="submitButton">&nbsp;</label><button id="submitButton" class="btn btn-block" style="color:white;" :class="$route.params.team + '-primary-bg'" v-on:click="filterTable">Reload</button></div>
      </div>
    </div>

    <h2 id="table_title" :class="$route.params.team + '-secondary-fg'"></h2>
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
</template>

<script>
  import { get_input,removeDups, store_input, loadEndpoint, save_input, makeLevelsDatatable } from '../services/helper-service';

  export default {
    name: 'Levels',
    data() {
      return {  
        "level_headers" : '',
        "tag_labels" : '',
        "spig_fav" : '',
        "clears" : '',
        "current_tag" : '',
        "tags_list" : '',
        "current_search_term": '',
        ...this.$store.state[this.$route.params.team].teamvars,
      };
    },
    mounted(){
      let that = this;

   
      if(this.$route.params.tags){
        this.current_tag =this.$route.params.tags
        this.tagOnce=this.$route.params.tags
      }

      store_input(this.$route.query, 'cleared','#clearedLevel')
      store_input(this.$route.query, 'approved','#pendingLevel')
      store_input(this.$route.query, 'minDifficulty','#minDifficulty')
      store_input(this.$route.query, 'maxDifficulty','#maxDifficulty')


      $(document).off('change', "#table_length select");
      $(document).on("change", "#table_length select", function(){
        // for persistant data
        localStorage.setItem('level_table_length',$(this).val());
      });

      that.pageLength = localStorage.getItem('level_table_length');
      if(!that.pageLength){
        that.pageLength = 10;
      } else {
        that.pageLength = parseInt(that.pageLength,10);
      }

      makeLevelsDatatable({$,id:'#table',that })
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
        $('th').tooltip()
        let that = this;
        this.tag_labels=this.data.tags;
        this.competition_winners = this.data.competition_winners;
        this.tags_list=this.data.tags.map(t=>t.name);
        


        let filtered_levels=this.data.levels.filter((level)=>{
          let curr_tags=level.tags.split(',')
          if(that.current_tag){ //if a tag is selected
            //if the level doen't have the current tag, don't include
            if(curr_tags.indexOf(that.current_tag)=="-1"){
              return false
            }
          } else { //default view. default view doesn't select certain tags like TeamConsistency
            for(let k=0;k<curr_tags.length;k++){
              if(that.data.seperate.indexOf(curr_tags[k])!="-1"){
                return false
              }
            }
          }
          if(get_input("minDifficulty")){
            if(parseFloat(level.difficulty)<parseFloat(get_input("minDifficulty"))){
              return false
            }
          }
          if(get_input("maxDifficulty")){
            if(parseFloat(level.difficulty)>parseFloat(get_input("maxDifficulty"))){
              return false
            }
          }

          const statusType=get_input('approved');
          if(statusType==='infix' && level.status!==this.$constants.LEVEL_STATUS.NEED_FIX) return false;
          if(statusType==='approved' && level.status !==this.$constants.LEVEL_STATUS.APPROVED) return false;
          if(statusType==='pending' && !this.$constants.PENDING_LEVELS.includes(level.status)) return false;

          const clearType=get_input("cleared")
          const completed=level.completed===1 || level.creator===this.username
          if(clearType==="2" && completed) return false;
          if(clearType==="3" && !completed) return false;
              

          if(that.current_search_term){
            let cName = level.creator.toLowerCase();
            let lName = level.level_name.toLowerCase();

            let lowerSearchTerm = that.current_search_term.toLowerCase();
            if(cName.indexOf(lowerSearchTerm) === -1 && lName.indexOf(lowerSearchTerm) === -1){
              return false
            }
          }

          return true;
        })

        var tempSelect="<option value=''>Default</option>"
        var removeIndexes = [];
        var removeTags = ["SMB1", "SMB3", "SMW", "NSMBU", "3DW"];
        for(let i = 0; i < this.tags_list.length; i++){
          if(removeTags.indexOf(this.tags_list[i].toUpperCase()) !== -1){
            removeIndexes.push(i);
          }
        }

        //Reversing to make splicing simpler
        removeIndexes = removeIndexes.reverse();
        for(var i = 0; i < removeIndexes.length; i++){
          this.tags_list.splice(removeIndexes[i], 1);
        }

        //Removing duplicates
        this.tags_list = removeDups(this.tags_list);

        //Sorting tags by Alphabet
        this.tags_list.sort();

        //Adding Game Types to the beginning
        this.tags_list.unshift("SMB1", "SMB3", "SMW", "NSMBU", "3DW");

        for(let k=0;k<this.tags_list.length;k++){
          tempSelect+="<option "+ (this.current_tag==this.tags_list[k]?"selected":"")+">"+this.tags_list[k]+"</option>"
        }
        $("#tagSelect").html(tempSelect)
        if(that.tagOnce){
          $('#tagSelect').val(that.tagOnce)
          delete that.tagOnce
        }
        
        var datatable=$('#table').DataTable()
        datatable.clear();
        datatable.rows.add(filtered_levels)
        datatable.draw();
        $('.loader').hide();
        $('[data-toggle="tooltip"],#refresh,#submitButton,.medal').tooltip()


      },

      getData(){
        $('.loader').show();

        let that = this;
        loadEndpoint({
          that,
          onLoad(_rawData){
            that.cachedData=JSON.stringify(_rawData)
            that.data=_rawData
            that.refresh()
          },
        })
      },
      clientReload(){
        this.filterSave()
        this.data=JSON.parse(this.cachedData)
        this.refresh()
      },
      filterSave(){
        save_input('cleared','#clearedLevel')
        save_input('approved','#pendingLevel')
        save_input('minDifficulty','#minDifficulty')
        save_input('maxDifficulty','#maxDifficulty')
        this.current_tag = $('#tagSelect').val();
        this.current_search_term = $('#searchTerm').val();
      },
      filterTable(){
        $('.loader').show();
        this.filterSave();
        let that = this;
        setTimeout(function(){
          that.getData();
        }, 100);
      }
    }
  }
</script>