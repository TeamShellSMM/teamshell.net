<template>
  <div class="container">
    <h2 id="table_title" :class="$route.params.team + '-secondary-fg level-detail-title'">Level Details</h2>
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

<div class="row">
<div class="col-sm-12">
<ul id="commentHTML" class="list-group d-block"></ul>
</div>
</div>



    <div id="playedTableCont" class="level-detail-played-table">
      <table id="playedTable" class="compact row-border stripe hover" style="width:100%;">
        <thead><tr>
          <th style="width:10px;">No.</th>
          <th style="width:10em">Code</th>
          <th>Player</th>
          <th style="width:10em">Cleared</th>
          <th style="width:10em">Moderator</th>
          <th style="width:10px">Liked</th>
          <th style="width:10px">Difficulty Voted</th>
          <th style="width:5em">Submitted</th>
        </tr></thead>
      </table>
    </div>
</div>
</template>

<script>
  import moment from 'moment/src/moment';
  import {  copyClipboard, loadTeamshellApi, clear} from '../services/helper-service';

  export default {
    name: 'LevelDetails',
    mounted(){
      let that = this;

      $('th').tooltip()

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
                $('#table').DataTable().row(rownum).data(tempData).draw();
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
                $('#table').DataTable().row(rownum).data(tempData).draw();
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
                $('#table').DataTable().row(rownum).data(tempData).draw();
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
                $('#table').DataTable().row(rownum).data(tempData).draw();
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

      $('#table').DataTable({
        "language": {
        "emptyTable": "Data is loading.",
        },
        paging:false,
        responsive:true,
        dom : "t",
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

              for(var i = 0; i < that.comp_winners.length; i++){
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
                let type2=that.data.tags[tags[i]]?that.data.tags[tags[i]]:"secondary"
                tags[i]='<a href="?tag='+tags[i]+'"><span class="tag badge badge-pill badge-'+type2+'">'+tags[i]+"</span></a>"
              }
              tags=tags.join("")

              let votesHtml=""
              if(that.data.vote_counts && that.data.vote_counts[currentCode]){
                if(that.data.vote_counts[currentCode].approve){

                  votesHtml+='<a class="dt-level-link" href="/level/' + encodeURI(currentCode) + '" code="' + currentCode + '" title="Votes for approval"><span class="tag badge badge-pill badge-success">'+that.data.vote_counts[currentCode].approve+"</span></a>"
                }
                if(that.data.vote_counts[currentCode].reject){
                  votesHtml+='<a class="dt-level-link" href="/level/' + encodeURI(currentCode) + '" code="' + currentCode + '" title="Votes for rejection"><span class="tag badge badge-pill badge-danger">'+that.data.vote_counts[currentCode].reject+"</span></a>"
                }
              }


              let goldsHtml = "";
              let silversHtml = "";
              let bronzesHtml = "";
              let ironsHtml = "";
              let shellsHtml = "";

              if(that.comp_winners){
                for(let i = 0; i < that.comp_winners.length; i++){
                  //return "<div class='points'><a href='../levels/?creator="+encodeURI(data)+"' target='_blank'>"+data+"</a></div>"
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
                for(let i = 0; i < that.comp_winners.length; i++){
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

              return makerLink + "<div class='font-weight-bold level-name-div'>"+data+medalsHtml +"<br/>"+ votesHtml+" "+ videos + " " + tags + "</div>";
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
            targets:[5,6,7,8,9,10]
          },
          {
            "render": function ( data, type ) {
              data=data.split(",")
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

      $('#playedTable').DataTable({
        "language": {
        "emptyTable": "Data is loading.",
        "info":           "_TOTAL_ players",
        "infoEmpty":      "0 rows",
        "infoFiltered":   "/ _MAX_ rows",
        },
        paging:false,
        responsive:true,
        dom : "ti",
        "columnDefs": [
          {
            visible: false,
            targets:[1]
          },
          {
            "render": function ( data, type ) {
              if(type!="display") return data
              let goldsHtml = "";
              let silversHtml = "";
              let bronzesHtml = "";
              let ironsHtml = "";
              let shellsHtml = "";

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

              return "<a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml;
            },
            targets: 2
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data=="1"?"1":"0";
              } else {
                  return (data=="1"?'<i title="Player has cleared this level." data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
              }
           },
            targets:3
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data=="1"?"1":"0";
              } else {
                  return (data=="1"?'<i title="This is a Mod Clear" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
              }
            },
            targets:4
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data=="1"?"1":"0";
              } else {
                  return (data=="1"?'<i title="This is a Mod Clear" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
              }
            },
            targets:4
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data=="1"?"1":"0";
              } else {
                  return (data=="1"?'<i title="Player has liked this level" data-toggle="tooltip" class="fa fa-heart text-danger" aria-hidden="true"></i>': "");
              }
            },
            targets:5
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data
              } else {
                  return data?parseFloat(data).toFixed(1):""
              }
            },
            targets:6
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data
              } else {
                  var day=moment(data)
                  return day.fromNow()
              }
            },
            targets:7
          }
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
      }
    },
    methods: {
      refresh(){
        let that = this;



    
        this.data=JSON.parse(this.raw_data);

        let commentHTML=""
        if(that.data.pending_comments){
          that.data.pending_comments.forEach( comment => {
            if(comment.type=="approve"){
              commentHTML+='<li class="list-group-item list-group-item-success"><h5 class="mb-1">'+comment.player+' voted to approve with difficulty '+comment.difficulty_vote+':</h5>'+comment.reason+'</span>'
            } else if(comment.type=="fix"){
              commentHTML+='<li class="list-group-item list-group-item-warning"><h5 class="mb-1">'+comment.player+' voted to fix with difficulty '+comment.difficulty_vote+':</h5>'+comment.reason+'</span>'
            } else {
              commentHTML+='<li class="list-group-item list-group-item-danger"><h5 class="mb-1">'+comment.player+' voted to reject:</h5>'+comment.reason+'</span>'
            }
            commentHTML+="</li>"
          })
        }
        $("#commentHTML").html(commentHTML)
        this.comp_winners = this.data.comp_winners;
        let filtered_levels=[];
        let level=this.data.level
        

        //adding automatic tags
        var curr_tags=level.tags.split(",")
        if(level.status=="0"){
          curr_tags.unshift("Pending")
        }
        level.tags=curr_tags.join(",")

        filtered_levels.push([
          '',
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
    
      var datatable=$('#table').DataTable()
      datatable.clear();
      datatable.rows.add(filtered_levels);

      let dataTablePlays = [];
      let playCounter = 1;
      if(this.data.plays){
        for(let play of this.data.plays){
          dataTablePlays.push([playCounter++, play.code, play.player, play.completed, play.is_shellder, play.liked, play.difficulty_vote, play.created_at]);
        }

        var datatable2=$('#playedTable').DataTable()
        datatable2.clear();
        datatable2.rows.add(dataTablePlays)
        datatable2.draw();
      }
      datatable.column(5).search("",false,true);
      datatable.column(14).search("",false,true);

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
        });
      },
      getData(){
        $('.loader').show();

        var datatable=$('#table').DataTable()
        var datatable2=$("#playedTable").DataTable()
        datatable.clear().draw();
        datatable2.clear().draw();
        console.log(this.currentCode)


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
        },{ code:that.$route.params.code })
      }
    }
  }
</script>