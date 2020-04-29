<template>
  <div class="container">
    <div id="filter_form_cont">
      <div class="form-group row">
        <div class="col-md-6">
        <label for="searchTerm">Search Term</label>
        <input name="member" type="text" class="form-control" id="searchTerm" autocomplete="off" placeholder="Search Term">
        <small class="form-text text-muted">With this you can search for a certain creator or levelname.</small>
        </div>

        <div class="col-md-3">
        <label for="clearedLevel">Cleared</label>
        <select name="cleared" id="clearedLevel" class="form-control">
            <option value="1" selected>All</option>
            <option value="2">Uncleared Only</option>
            <option value="3">Cleared Only</option>
          </select>
          <small class="form-text text-muted">The clears shown are clears registered to ShellBot 2000 in the team's discord.</small>
        </div>


          <div class="col-md-3">
          <label for="pendingLevel">Levels</label>
          <select name="approved" id="pendingLevel" class="form-control">
            <option value="1" selected>Approved</option>
            <option value="2" >Pending</option>
            <option value="3">All</option>
          </select>
          <small class="form-text text-muted">Approved levels are levels that have been played and approved by a moderator.</small>
        </div>

      </div>
      <div class="form-group row">

      <div class="col-md-3">
      <label for="minDifficulty">Min Difficulty</label>
      <input type="number" id="minDifficulty" name="minDifficulty" placeholder="0" step="0.5" min="0" max="12" class="form-control" />
          <small class="form-text text-muted">Minimum difficulty to show.</small>
        </div>

        <div class="col-md-3">
      <label for="maxDifficulty">Max Difficulty</label>
      <input type="number" id="maxDifficulty" name="maxDifficulty" placeholder="10"  step="0.5" min="0" max="12" class="form-control" />
          <small class="form-text text-muted">Maximum difficulty to show.</small>
        </div>


      <div class="col-md-4">
      <label for="tagSelect">Tags</label>
      <select name="tag" id="tagSelect" class="form-control"></select>
          <small class="form-text text-muted">Default view will show all Team Levels.</small>
        </div>


        <div class="col-md-2"><label for="submitButton">&nbsp;</label><button id="submitButton" class="btn btn-block" style="color:white;" :class="$route.params.team + '-primary-bg'" v-on:click="filterTable()">Filter</button></div>
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
        <th style="width:5em">Code</th>
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
  //import moment from 'moment/src/moment';
  import { get_input, removeDups, copyClipboard, store_input, loadTeamshellApi, save_input, clear} from '../services/helper-service';

  export default {
    name: 'Levels',
    data() {
      return {
        "raw_data" : '',
        "data" : '',
        "level_headers" : '',
        "tag_labels" : '',
        "spig_fav" : '',
        "clears" : '',
        "current_tag" : '',
        "tags_list" : '',
        "current_search_term": ''
      };
    },
    mounted(){
      store_input(this.$route.query, 'cleared','#clearedLevel')
      store_input(this.$route.query, 'approved','#pendingLevel')
      store_input(this.$route.query, 'minDifficulty','#minDifficulty')
      store_input(this.$route.query, 'maxDifficulty','#maxDifficulty')

      $('th').tooltip()

      let that = this;

      $(document).off('click', 'a.dt-level-link');
      $(document).on('click', 'a.dt-level-link', function(e){
        e.stopPropagation();
        e.preventDefault();
        that.$router.push("/" + that.$route.params.team + "/level/" + this.getAttribute("code"));
        console.log("level link clicked", this.getAttribute("code"));
      });

      $(document).off('click', 'a.dt-maker-link');
      $(document).on('click', 'a.dt-maker-link', function(e){
        e.stopPropagation();
        e.preventDefault();
        that.$router.push("/" + that.$route.params.team + "/maker/" + this.getAttribute("maker"));
      });

      $(document).off('click', 'i.dt-clear-button');
      $(document).on('click', 'i.dt-clear-button', function(e){
        e.stopPropagation();
        e.preventDefault();
        let thatButt = this;
        if(that.loggedIn){
          that.$dialog
          .confirm('Are you sure you want to submit a clear for ' + $(thatButt).attr('levelname') + " (" + $(thatButt).attr('code') + ") ?")
          .then(function() {
            $('.loader').show();
            clear(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              code: $(thatButt).attr('code'),
              completed: 1
            }, function(result){
              if(result.status == "sucessful"){
                $('.loader').hide();
                let rownum = $(thatButt).attr('rownum');
                let tempData = $('#table').DataTable().row(rownum).data();
                tempData[15] = "1";
                $('#table').DataTable().row(rownum).data(tempData).draw(false);
              } else {
                that.$dialog.alert("Something went wrong buzzyS").then(function() {
                });
              }
            });
          })
          .catch(function() {
          });
        }
      });

      $(document).off('click', 'i.dt-unclear-button');
      $(document).on('click', 'i.dt-unclear-button', function(e){
        e.stopPropagation();
        e.preventDefault();
        let thatButt = this;
        if(that.loggedIn){
          that.$dialog
          .confirm('Are you sure you want to remove your clear and like for ' + $(thatButt).attr('levelname') + " (" + $(thatButt).attr('code') + ") ?")
          .then(function() {
            $('.loader').show();
            clear(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              code: $(thatButt).attr('code'),
              completed: 0,
              like: 0
            }, function(result){
              if(result.status == "sucessful"){
                $('.loader').hide();
                let rownum = $(thatButt).attr('rownum');
                let tempData = $('#table').DataTable().row(rownum).data();
                tempData[15] = "0";
                tempData[17] = "0";
                $('#table').DataTable().row(rownum).data(tempData).draw(false);
              } else {
                that.$dialog.alert("Something went wrong buzzyS").then(function() {
                });
              }
            });
          })
          .catch(function() {
          });
        }
      });

      $(document).off('click', 'i.dt-like-button');
      $(document).on('click', 'i.dt-like-button', function(e){
        e.stopPropagation();
        e.preventDefault();
        let thatButt = this;
        if(that.loggedIn){
          that.$dialog
          .confirm('Are you sure you want to submit a like and clear for ' + $(thatButt).attr('levelname') + " (" + $(thatButt).attr('code') + ") ?")
          .then(function() {
            $('.loader').show();
            clear(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              code: $(thatButt).attr('code'),
              completed: 1,
              like: 1
            }, function(result){
              if(result.status == "sucessful"){
                $('.loader').hide();
                let rownum = $(thatButt).attr('rownum');
                let tempData = $('#table').DataTable().row(rownum).data();
                tempData[15] = "1";
                tempData[17] = "1";
                $('#table').DataTable().row(rownum).data(tempData).draw(false);
              } else {
                that.$dialog.alert("Something went wrong buzzyS").then(function() {
                });
              }
            });
          })
          .catch(function() {
          });
        }
      });

      $(document).off('click', 'i.dt-unlike-button');
      $(document).on('click', 'i.dt-unlike-button', function(e){
        e.stopPropagation();
        e.preventDefault();
        let thatButt = this;
        if(that.loggedIn){
          that.$dialog
          .confirm('Are you sure you want to remove your like for ' + $(thatButt).attr('levelname') + " (" + $(thatButt).attr('code') + ") ?")
          .then(function() {
            $('.loader').show();
            clear(that.$route.params.team, {
              token: that.$store.state[that.$route.params.team].token,
              code: $(thatButt).attr('code'),
              like: 0
            }, function(result){
              if(result.status == "sucessful"){
                $('.loader').hide();
                let rownum = $(thatButt).attr('rownum');
                let tempData = $('#table').DataTable().row(rownum).data();
                tempData[17] = "0";
                $('#table').DataTable().row(rownum).data(tempData).draw(false);
              } else {
                that.$dialog.alert("Something went wrong buzzyS").then(function() {
                });
              }
            });
          })
          .catch(function() {
          });
        }
      });

      $(document).off('change', "#table_length select");
      $(document).on("change", "#table_length select", function(){
        // for persistant data
        localStorage.setItem('level_table_length',$(this).val());
      });

      let pageLength = localStorage.getItem('level_table_length');
      if(!pageLength){
        pageLength = 10;
      } else {
        pageLength = parseInt(pageLength);
      }

      $('#table').DataTable({
        "language": {
        "emptyTable": "Data is loading. ",
        "info":           "_START_ - _END_ of _TOTAL_ levels",
        "infoEmpty":      "0 levels",
        "infoFiltered":   "(_MAX_ total)",
        },
        paging:true,
        pagingType: "simple",
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        pageLength:pageLength,
        responsive: true,
        dom : "litp",
        "columnDefs": [
          { responsivePriority: 1, targets: [0,1,3,4,15,17] },
          { responsivePriority: 2, targets: [14] },
          { responsivePriority: 4, targets: [2,5,6,7,8,9,10,11,12,13,16] },
          {
            "render": function ( data) {
              if(that.loggedIn){
                let copyTitle = "Copy levelcode";
                return "<div class='text-monospace level-code-div'><a class='dt-level-link' href='/" + that.$route.params.team + "/level/" + encodeURI(data) + "' code='" + data + "'>" + data + "</a></div> <span class='copy' title='" + copyTitle + "'><i class='fa fa-clipboard' aria-hidden='true'></i></span>"
              } else {
                let copyTitle = "Copy clear code";
                let likeTitle = "Copy clear code with like";
                return "<div class='text-monospace level-code-div'><a class='dt-level-link' href='/" + that.$route.params.team + "/level/" + encodeURI(data) + "' code='" + data + "'>" + data + "</a></div> <span class='copy' title='" + copyTitle + "'><i class='fa fa-clipboard' aria-hidden='true'></i></span> <span class='copyLike' title='" + likeTitle + "' data-toggle='tooltip'><i class='fa fa-heart text-danger' aria-hidden='true'></i></span>"
              }
            },
            "orderable": false,
            targets:1,
          },
          {
            "render": function ( data, type ) {
              if(type!="display") return data
              let goldsHtml = "";
              let silversHtml = "";
              let bronzesHtml = "";
              let ironsHtml = "";
              let shellsHtml = "";
              if(that.comp_winners){
                for(var i = 0; i < that.comp_winners.length; i++){
                  //return "<div class='points'><a href='../levels/?creator="+encodeURI(data)+"' target='_blank'>"+data+"</a></div>"
                  if(data == that.comp_winners[i][1]){
                    switch(that.comp_winners[i][3]){
                      case "1":
                        goldsHtml += '<div class="medal" title="Gold medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-gold"></div></div>';
                      break;
                      case "2":
                        silversHtml += '<div class="medal" title="Silver medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-silver"></div></div>';
                      break;
                      case "3":
                        bronzesHtml += '<div class="medal" title="Bronze medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-bronze"></div></div>';
                      break;
                      case "4":
                        ironsHtml += '<div class="medal" title="Runner-up of ' + that.comp_winners[i][2] + '"><div class="coin coin-iron"></div></div>';
                      break;
                      case "5":
                        shellsHtml += '<div class="medal" title="Honorable Mention for ' + that.comp_winners[i][2] + '"><div class="coin coin-shell"></div></div>';
                      break;
                    }
                  }
                }

                var medalsHtml = "";
                if(goldsHtml != ""){
                  medalsHtml += '<div class="medals">' + goldsHtml + '</div>';
                }
                if(silversHtml != ""){
                  medalsHtml += '<div class="medals">' + silversHtml + '</div>';
                }
                if(bronzesHtml != ""){
                  medalsHtml += '<div class="medals">' + bronzesHtml + '</div>';
                }
                if(ironsHtml != ""){
                  medalsHtml += '<div class="medals">' + ironsHtml + '</div>';
                }
                if(shellsHtml != ""){
                  medalsHtml += '<div class="medals">' + shellsHtml + '</div>';
                }
              }

              return "<div class='creator-name-div'><a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml +"</div>";
            },
            targets: 2
          },
          {
            "render": function ( data, type, row ) {
              if(type!="display") return data
              let currentCode=row[1];
              var videos="";

              if(row[7]){
                var raw_vids=row[7].split(",")
                for(let j=0;j<raw_vids.length;j++){
                  videos+="<a class='clear-vid-link' target='_blank' data-toggle='tooltip' title='Video clear' href='"+raw_vids[j]+"'><i class='fas fa-video' aria-hidden='true'></i></a> "
                }
              }
              var tags=row[9]
              tags=tags?tags.split(","):[]
              for(let i=0;i<tags.length;i++){
                let type2=that.tag_labels[tags[i]]?that.tag_labels[tags[i]]:"secondary"
                tags[i]='<a href="#"><span class="tag badge badge-pill badge-'+type2+'">'+tags[i]+"</span></a>"
              }

              tags=tags.join("")

              let votesHtml=""
              if(that.data.vote_counts && that.data.vote_counts[currentCode]){
                if(that.data.vote_counts[currentCode].approve){
                  votesHtml+='<a class="dt-level-link" href="/' + that.$route.params.team + '/level/' + encodeURI(currentCode) + '" code="' + currentCode + '" title="Votes for approval"><span class="tag badge badge-pill badge-success">'+that.data.vote_counts[currentCode].approve+"</span></a>"
                } else if(that.data.vote_counts[currentCode].fix){
                  votesHtml+='<a class="dt-level-link" href="/' + that.$route.params.team + '/level/' + encodeURI(currentCode) + '" code="' + currentCode + '" title="Votes for fix"><span class="tag badge badge-pill badge-warning">'+that.data.vote_counts[currentCode].fix+"</span></a>"
                } else if(that.data.vote_counts[currentCode].reject){
                  votesHtml+='<a class="dt-level-link" href="/' + that.$route.params.team + '/level/' + encodeURI(currentCode) + '" code="' + currentCode + '" title="Votes for rejection"><span class="tag badge badge-pill badge-danger">'+that.data.vote_counts[currentCode].reject+"</span></a>"
                }
              }

              let goldsHtml = "";
              let silversHtml = "";
              let bronzesHtml = "";
              let ironsHtml = "";
              let shellsHtml = "";

              if(that.comp_winners){
                for(let i = 0; i < that.comp_winners.length; i++){
                  if(row[1] == that.comp_winners[i][0]){
                    switch(that.comp_winners[i][3]){
                      case "1":
                        goldsHtml += '<div class="medal" title="Gold medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-gold"></div></div>';
                      break;
                      case "2":
                        silversHtml += '<div class="medal" title="Silver medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-silver"></div></div>';
                      break;
                      case "3":
                        bronzesHtml += '<div class="medal" title="Bronze medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-bronze"></div></div>';
                      break;
                      case "4":
                        ironsHtml += '<div class="medal" title="Runner-up of ' + that.comp_winners[i][2] + '"><div class="coin coin-iron"></div></div>';
                      break;
                      case "5":
                        shellsHtml += '<div class="medal" title="Honorable Mention for ' + that.comp_winners[i][2] + '"><div class="coin coin-shell"></div></div>';
                      break;
                    }
                  }
                }

                var medalsHtml = "";
                if(goldsHtml != ""){
                  medalsHtml += '<div class="medals">' + goldsHtml + '</div>';
                }
                if(silversHtml != ""){
                  medalsHtml += '<div class="medals">' + silversHtml + '</div>';
                }
                if(bronzesHtml != ""){
                  medalsHtml += '<div class="medals">' + bronzesHtml + '</div>';
                }
                if(ironsHtml != ""){
                  medalsHtml += '<div class="medals">' + ironsHtml + '</div>';
                }
                if(shellsHtml != ""){
                  medalsHtml += '<div class="medals">' + shellsHtml + '</div>';
                }
              }

              let goldsHtmlCreator = "";
              let silversHtmlCreator = "";
              let bronzesHtmlCreator = "";
              let ironsHtmlCreator = "";
              let shellsHtmlCreator = "";
              if(that.comp_winners){
                for(var i = 0; i < that.comp_winners.length; i++){
                  //return "<div class='points'><a href='../levels/?creator="+encodeURI(data)+"' target='_blank'>"+data+"</a></div>"
                  if(row[2] == that.comp_winners[i][1]){
                    switch(that.comp_winners[i][3]){
                      case "1":
                        goldsHtmlCreator += '<div class="medal" title="Gold medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-gold"></div></div>';
                      break;
                      case "2":
                        silversHtmlCreator += '<div class="medal" title="Silver medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-silver"></div></div>';
                      break;
                      case "3":
                        bronzesHtmlCreator += '<div class="medal" title="Bronze medalist of ' + that.comp_winners[i][2] + '"><div class="coin coin-bronze"></div></div>';
                      break;
                      case "4":
                        ironsHtmlCreator += '<div class="medal" title="Runner-up of ' + that.comp_winners[i][2] + '"><div class="coin coin-iron"></div></div>';
                      break;
                      case "5":
                        shellsHtmlCreator += '<div class="medal" title="Honorable Mention for ' + that.comp_winners[i][2] + '"><div class="coin coin-shell"></div></div>';
                      break;
                    }
                  }
                }

                var medalsHtmlCreator = "";
                if(goldsHtmlCreator != ""){
                  medalsHtmlCreator += '<div class="medals">' + goldsHtmlCreator + '</div>';
                }
                if(silversHtmlCreator != ""){
                  medalsHtmlCreator += '<div class="medals">' + silversHtmlCreator + '</div>';
                }
                if(bronzesHtmlCreator != ""){
                  medalsHtmlCreator += '<div class="medals">' + bronzesHtmlCreator + '</div>';
                }
                if(ironsHtmlCreator != ""){
                  medalsHtmlCreator += '<div class="medals">' + ironsHtmlCreator + '</div>';
                }
                if(shellsHtmlCreator != ""){
                  medalsHtmlCreator += '<div class="medals">' + shellsHtmlCreator + '</div>';
                }
              }

              let makerLink = "<div class='creator-name-div diff-text-mobile'><a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(row[2]) + "' maker='" + row[2] + "'>" + row[2] + "</a>"+medalsHtmlCreator +"</div>";

              return makerLink + "<div class='font-weight-bold level-name-div'>"+data+medalsHtml +"<br/>"+ votesHtml+" "+videos + " " + tags + "</div>";
            },
            targets:3,
          },
          {
            "render": function ( data, type, row ) {
              var tags=row[9]
              tags=tags?tags.split(","):[]
              if(tags.indexOf("TeamConsistency")!=-1){
                return "N/A";
              } else {
                return Number(data).toFixed(1);
              }
            },
            targets:4,
          },
          {
            visible: false,
            targets:that.loggedIn?[5,6,7,8,9,10]:[5,6,7,8,9,10,15,16,17],
          },
          {
            "render": function ( data, type ) {
              data=data?data.split(","):[0,0]
              if ( type !="display" ) {
                return data[0];
              } else {
                return data[0]+"<br/><span class='tag badge badge-secondary'>"+data[1]+" votes</span>";
              }
            },
            targets:12
          },
          {
            "render": function ( data, type, row, meta ) {
              if ( type !="display" ) {
                return data=="1"?"1":"0";
              } else {
                if(that.loggedIn){
                  return (data=="1"?'<i title="You have cleared this level" data-toggle="tooltip" class="fa fa-check text-success dt-unclear-button" aria-hidden="true" code="' + row[1] + '" levelname="' + row[3] + '" rownum="' + meta.row + '"></i>': '<i title="You have not submitted a clear for this level yet" data-toggle="tooltip" class="fa fa-check fa-inactive dt-clear-button" aria-hidden="true" code="' + row[1] + '" levelname="' + row[3] + '" rownum="' + meta.row + '"></i>');
                } else {
                  return (data=="1"?'<i title="Entered player has cleared this level" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': '');
                }
              }
            },
            targets:15
          },
          {
            "render": function ( data ) {
              return isNaN(data)||data==0?"":Number(data).toFixed(1);
            },
            targets:16
          },
          {
            "render": function ( data, type, row, meta ) {
              if ( type !="display" ) {
                return data=="1"?"1":"0";
              } else {
                if(that.loggedIn){
                  return (data=="1"?'<i title="You liked this level" data-toggle="tooltip" class="fa fa-heart text-danger dt-unlike-button" aria-hidden="true" code="' + row[1] + '" levelname="' + row[3] + '" rownum="' + meta.row + '"></i>': '<i title="You have not submitted a like for this level yet" data-toggle="tooltip" class="fa fa-heart fa-inactive dt-like-button" aria-hidden="true" code="' + row[1] + '" levelname="' + row[3] + '" rownum="' + meta.row + '"></i>');
                } else {
                  return (data=="1"?'<i title="Entered player has liked this level" data-toggle="tooltip" class="fa fa-heart text-danger" aria-hidden="true"></i>': '');
                }
              }
            },
            targets:17
          },
          {
            defaultContent:"",
            targets:[6,7,8,9,10,11,12,13,14,15,16,17]
          },
        ]
      });

      this.getData();
    },
    computed: {
      loggedIn: function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].token ? true : false;
        }
        return false;
      },
      is_shellder:function(){
        if(this.$route.params.team){
          return this.$store.state[this.$route.params.team].user_info.shelder ? true : false;
        }
        return false;
      }
    },
    methods: {
      refresh(){
        let that = this;

        this.data=JSON.parse(this.raw_data);
        this.tag_labels=this.data.tags;
        this.tags_list=[];
        this.comp_winners = this.data.comp_winners;
        let filtered_levels=[];

        for(let i=0;i<this.data.levels.length;i++){ //main loop that processes all the stats for the levels
          let level=this.data.levels[i]

          //adding automatic tags
          var include=true;
          var curr_tags=level.tags.split(",")
          if(level.status=="0"){
            curr_tags.unshift("Pending")
          }
          level.tags=curr_tags.join(",")

          //get all the tags used from the data set
          for(let k=0;k<curr_tags.length;k++){
            if(curr_tags[k] && this.tags_list.indexOf(curr_tags[k])=="-1")
              this.tags_list.push(curr_tags[k])
          }

          if(this.current_tag){ //if a tag is selected
            //if the level doen't have the current tag, don't include
            if(curr_tags.indexOf(this.current_tag)=="-1"){
              include=false
            }
          } else { //default view. default view doesn't select certain tags like TeamConsistency
            for(let k=0;k<curr_tags.length;k++){
              if(this.data.seperate.indexOf(curr_tags[k])!="-1"){
                include=false
              }
            }
          }
          if(get_input("minDifficulty")){
            if(parseFloat(level.difficulty)<parseFloat(get_input("minDifficulty"))){
              include=false
            }
          }
          if(get_input("maxDifficulty")){
            if(parseFloat(level.difficulty)>parseFloat(get_input("maxDifficulty"))){
              include=false
            }
          }

          if(this.current_search_term){
            let cName = level.creator.toLowerCase();
            let lName = level.level_name.toLowerCase();

            let lowerSearchTerm = this.current_search_term.toLowerCase();
            if(cName.indexOf(lowerSearchTerm) === -1 && lName.indexOf(lowerSearchTerm) === -1){
              include = false;
            }
          }

          if(include){
            filtered_levels.push([
              i+1,
              level.code,
              level.creator,
              level.level_name,
              level.difficulty,
              level.status,
              level.new_code || '',
              level.videos || '',
              level.created_at,
              level.tags || '',
              level.is_free_submission || '',
              level.clear,
              `${level.vote||0},${level.votetotal||0}`,
              level.likes,
              level.lcd,
              '-',
              '-',
              '-',
          ])
          }
        } //end main level loops

        var tempSelect="<option value=''>Default</option>"
        //Removing these to put them at the beginning
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
        var datatable=$('#table').DataTable()
        datatable.clear();
        datatable.rows.add(filtered_levels)
        //
        if(!get_input('approved') || get_input('approved')=="1"||get_input('approved')=="2"){
          datatable.column(5).search( (get_input('approved')=="2"?'"0"':'"1"'),false,true)
        } else {
          datatable.column(5).search("",false,true)
        }

        if(get_input("cleared")=="2"||get_input("cleared")=="3"){
          datatable.column(15).search(get_input('cleared')=="3"?'"1"':'"0"',false,true)
        } else {
          datatable.column(15).search("",false,true);
        }

        datatable.draw();
        $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()
        $('.copy').click(function(){
          if(!that.$store.state[that.$route.params.team].token){
            let code=$(this).parent().text().substring(0,11);
            let old_title="Copy clear code"
            let new_title="Code copied."

            $(this).addClass("text-success")
              $(this).tooltip('hide')
                  .attr('title', new_title)
                  .attr('data-original-title', new_title)
                  .tooltip('update')
                  .tooltip('show')
              let temp=this

            setTimeout(function(){
              $(temp).removeClass("text-success")
              $(temp).tooltip('hide')
                  .attr('title', old_title)
                  .attr('data-original-title', old_title)
                  .tooltip('update')
                  .tooltip('enable')
            },2000)
            copyClipboard("!clear "+code)
          } else {
            let code=$(this).parent().text().substring(0,11);
            let old_title="Copy levelcode"
            let new_title="Code copied."

            $(this).addClass("text-success")
              $(this).tooltip('hide')
                  .attr('title', new_title)
                  .attr('data-original-title', new_title)
                  .tooltip('update')
                  .tooltip('show')
              let temp=this

            setTimeout(function(){
              $(temp).removeClass("text-success")
              $(temp).tooltip('hide')
                  .attr('title', old_title)
                  .attr('data-original-title', old_title)
                  .tooltip('update')
                  .tooltip('enable')
            },2000)
            copyClipboard(code)
          }
        })

        $('.loader').hide();

        $('.copyLike').click(function(){
          if(!that.$store.state[that.$route.params.team].token){
            var code=$(this).parent().text().substring(0,11);
            var old_title="Copy clear code with like"
            var new_title="Code copied."

            $(this).addClass("text-success")
              $(this).tooltip('hide')
                  .attr('title', new_title)
                  .attr('data-original-title', new_title)
                  .tooltip('update')
                  .tooltip('show')
              var temp=this

            setTimeout(function(){
              $(temp).removeClass("text-success")
              $(temp).tooltip('hide')
                  .attr('title', old_title)
                  .attr('data-original-title', old_title)
                  .tooltip('update')
                  .tooltip('enable')
            },2000)
            copyClipboard("!clear "+code+" like")
          } else {
            console.log("send like post");
          }
        });
      },
      getData(){
        $('.loader').show();

        let datatable;
        if ( $.fn.dataTable.isDataTable( '#table' ) ) {
            datatable = $('#table').DataTable();
        }
        else {
            datatable = $('#table').DataTable( {
                "deferRender": true,
            });
        }
        datatable.clear().draw();

        let that = this;
        loadTeamshellApi(that.$route.params.team, that.$store.state[that.$route.params.team].token,function(_rawData,dataNoChange){
          if(dataNoChange){
            $.notify("No new data was loaded",{
              className:"success",
              position:"top right",
            });
          }
          that.raw_data=_rawData
          that.refresh()
        })
      },
      filterTable(){
        $('.loader').show();

        save_input('cleared','#clearedLevel')
        save_input('approved','#pendingLevel')
        save_input('minDifficulty','#minDifficulty')
        save_input('maxDifficulty','#maxDifficulty')
        this.current_tag = $('#tagSelect').val();
        this.current_search_term = $('#searchTerm').val();

        let that = this;
        setTimeout(function(){
          that.getData();
        }, 100);
      }
    }
  }
</script>