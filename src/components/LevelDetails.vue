<template>
  <div class="container">
    <h2 id="table_title" class="orange level-detail-title">Level Details</h2>
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
        <th style="width:10px">TS Vote</th>
        <th style="width:10px">Likes</th>
        <th style="width:10px" title="Like-Clear-Diff Score (aka how many TS Maker Points this level is worth)"><span class="diff-text-default">LCD Score</span><span class="diff-text-mobile">LCD</span></th>
        <th class="all" style="width:10px"><span class="diff-text-default">Clear</span><span class="diff-text-mobile"><i class='fa fa-check text-success' aria-hidden='true'></i></span></th>
        <th style="width:10px">Your Vote</th>
        <th class="all" style="width:10px"><span class="diff-text-default">Like</span><span class="diff-text-mobile"><i class='fa fa-heart text-danger' aria-hidden='true'></i></span></th>
      </tr></thead>
    </table>

    <div id="playedTableCont" class="level-detail-played-table">
      <table id="playedTable" class="compact row-border stripe hover" style="width:100%;">
        <thead><tr>
          <th style="width:10px;">No.</th>
          <th style="width:10em">Code</th>
          <th>Player</th>
          <th style="width:10em">Cleared</th>
          <th style="width:10em">Shellder</th>
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
  import { get_input, removeDups, copyClipboard, loadTeamshellApi, getMakerPoints, clear} from '../services/helper-service';

  const headers={
    played:{"Code":0,"Player":1,"Completed":2,"Shelder":3,"Liked":4,"DifficultyVote":5,"Timestamp":6},
    levels:{"No":0,"Code":1,"Creator":2,"LevelName":3,"Difficulty":4,"LevelStatus":5,"NewCode":6,"ClearVideo":7,"Timestamp":8,"Tags":9} //the no. is added in the code itslef.
  };

  export default {
    name: 'LevelDetails',
    mounted(){
      let that = this;

      $('th').tooltip()

      $(document).off('click', 'a.dt-level-link');
      $(document).on('click', 'a.dt-level-link', function(e){
        e.stopPropagation();
        e.preventDefault();
        that.$router.push("/level/" + this.getAttribute("code"));
        console.log("level link clicked", this.getAttribute("code"));
      });

      $(document).off('click', 'a.dt-maker-link');
      $(document).on('click', 'a.dt-maker-link', function(e){
        e.stopPropagation();
        e.preventDefault();
        that.$router.push("/maker/" + this.getAttribute("maker"));
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
            clear({
              token: that.$store.state.token,
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
            clear({
              token: that.$store.state.token,
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
            clear({
              token: that.$store.state.token,
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
            clear({
              token: that.$store.state.token,
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
        "emptyTable": "Data is loading. You may have to whitelist this site for browser extensions that block third party scripts",
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
                return "<div class='text-monospace level-code-div'><a class='dt-level-link' href='/level/" + encodeURI(data) + "' code='" + data + "'>" + data + "</a></div> <span class='copy' title='" + copyTitle + "'><i class='fa fa-clipboard' aria-hidden='true'></i></span>"
              } else {
                let copyTitle = "Copy tsclear code";
                let likeTitle = "Copy tsclear code with like";
                return "<div class='text-monospace level-code-div'><a class='dt-level-link' href='/level/" + encodeURI(data) + "' code='" + data + "'>" + data + "</a></div> <span class='copy' title='" + copyTitle + "'><i class='fa fa-clipboard' aria-hidden='true'></i></span> <span class='copyLike' title='" + likeTitle + "' data-toggle='tooltip'><i class='fa fa-heart text-danger' aria-hidden='true'></i></span>"
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

              return "<div class='creator-name-div'><a class='dt-maker-link' href='/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml +"</div>";
            },
            targets: 2
          },
          {
            "render": function ( data, type, row ) {
              if(type!="display") return data

              var videos="";

              if(row[7]){
                var raw_vids=row[7].split(",")
                for(let j=0;j<raw_vids.length;j++){
                  videos+="<a class='clear-vid-link' target='_blank' data-toggle='tooltip' title='Video clear' href='"+raw_vids[j]+"'><i class='fa fa-video-camera' aria-hidden='true'></i></a> "
                }
              }
              var tags=row[9]
              tags=tags?tags.split(","):[]
              for(let i=0;i<tags.length;i++){
                let type2=that.tag_labels[tags[i]]?that.tag_labels[tags[i]]:"secondary"
                tags[i]='<a href="?tag='+tags[i]+'"><span class="tag badge badge-pill badge-'+type2+'">'+tags[i]+"</span></a>"
              }
              tags=tags.join("")


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

              let makerLink = "<div class='creator-name-div diff-text-mobile'><a class='dt-maker-link' href='/maker/" + encodeURI(row[2]) + "' maker='" + row[2] + "'>" + row[2] + "</a>"+medalsHtmlCreator +"</div>";

              return makerLink + "<div class='font-weight-bold level-name-div'>"+data+medalsHtml +  videos + " " + tags + "</div>";
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
        "emptyTable": "Data is loading. You may have to whitelist this site for browser extensions that block third party scripts",
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

              return "<a class='dt-maker-link' href='/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml;
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
                  return (data=="1"?'<i title="This is a Shellder Clear" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
              }
            },
            targets:4
          },
          {
            "render": function ( data, type ) {
              if ( type !="display" ) {
                  return data=="1"?"1":"0";
              } else {
                  return (data=="1"?'<i title="This is a Shellder Clear" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
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
                  var day=moment.unix(data)
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
        return this.$store.state.token ? true : false;
      }
    },
    methods: {
      refresh(){
        let that = this;

        this.data=JSON.parse(this.raw_data);
        this.data.levels.shift();
        this.clearers=[];
        this.clears={};
        this.tag_labels=this.data.tags;
        this.tags_list=[];

        this.data.points.shift()
        var _points={0:0}

        this.comp_winners = this.data.comp_winners;

        for(let i=0;i<this.data.points.length;i++){
          _points[parseFloat(this.data.points[i][0])]=parseFloat(this.data.points[i][1]);
        }
        this.data.points=_points

        var filtered_plays=[];
        for(let i=0;i<this.data.played.length;i++){
          if(this.$route.params.code==this.data.played[i].code){
            filtered_plays.push(this.data.played[i])
          }
          if(this.clearers.indexOf(this.data.played[i].player)==-1){ //getting all the people who have submitted clears
            this.clearers.push(this.data.played[i].player)
          }
          if(!this.clears[this.data.played[i].code]) this.clears[this.data.played[i].code]={}
          this.clears[this.data.played[i].code][this.data.played[i].player]={ //compiling the clears in a [level-code][player] format
            cleared:this.data.played[i].completed,
            vote:this.data.played[i].difficulty_vote,
            liked:this.data.played[i].liked=="1"
          }
        }

        $('#registeredName').typeahead({source: this.clearers});

        var filtered_levels=[];

        for(let i=0;i<this.data.levels.length;i++){ //main loop that processes all the stats for the levels
          this.data.levels[i].unshift(i+1) //adds the id.

          //internal variables
          var tsclears=0;
          var votesum=0;
          var votetotal=0;
          var likes=0;

          //data definition
          var current_level=this.data.levels[i][1];
          let current_creator=this.data.levels[i][2];


          if(this.clears[current_level]){
            for(var player in this.clears[current_level]){
              if(player!=current_creator){
                if(this.clears[current_level][player].cleared=="1"){
                  tsclears++;
                }
                if(this.clears[current_level][player].vote){
                  votetotal++;
                  votesum+=Number(this.clears[current_level][player].vote)
                }
                if(this.clears[current_level][player].liked){
                  likes++;
                }
              }
            }
          }

          this.data.levels[i].push(tsclears) //no. of clears
          this.data.levels[i].push(votetotal>0? ((votesum/votetotal).toFixed(1))+","+votetotal:"0,0") //avg vote, num votes
          this.data.levels[i].push(likes) //liked
          this.data.levels[i].push(getMakerPoints(likes, tsclears, this.data.points[this.data.levels[i][4]]).toFixed(1));
          if(current_creator==get_input("member")){
              this.data.levels[i].push("1")
              this.data.levels[i].push("-")
              this.data.levels[i].push("-")
          } else if(this.clears[current_level] && this.clears[current_level][get_input("member")]){ //if this clear is made by the current entered user
              this.data.levels[i].push(this.clears[current_level][get_input("member")].cleared)
              this.data.levels[i].push(this.clears[current_level][get_input("member")].vote)
              this.data.levels[i].push(this.clears[current_level][get_input("member")].liked)
          } else {
            this.data.levels[i].push("-")
            this.data.levels[i].push("-")
            this.data.levels[i].push("-")
          }

          //adding automatic tags
          var include=true;
          var curr_tags=this.data.levels[i][9].split(",")
          if(this.data.levels[i][5]=="0"){
            curr_tags.unshift("Pending")
          }
          this.data.levels[i][9]=curr_tags.join(",")

          if(this.data.levels[i][headers.levels.Code]!=this.$route.params.code){
            include=false
          } else {
            let current_creator=this.data.levels[i][headers.levels.Creator];
            var to_remove=[]
            for(let j=0;j<filtered_plays.length;j++){
              if(filtered_plays[j].player==current_creator){
                to_remove.push(j)
              }
            }
            for(let j=to_remove.length-1;j>=0;j--){
              console.log(filtered_plays.splice(j,1))
            }
          }

          if(include){
            filtered_levels.push(this.data.levels[i])
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
        datatable.rows.add(filtered_levels);

        let dataTablePlays = [];
        let playCounter = 1;
        for(let play of filtered_plays){
          dataTablePlays.push([playCounter++, play.code, play.player, play.completed, play.is_shellder, play.liked, play.difficulty_vote, play.created_at]);
        }

        if(filtered_plays){
          var datatable2=$('#playedTable').DataTable()
          datatable2.clear();
          datatable2.rows.add(dataTablePlays)
          datatable2.draw();
        }
        //
        datatable.column(5).search("",false,true);
        datatable.column(14).search("",false,true);

        datatable.draw();
        $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()
        $('.copy').click(function(){
          if(!that.$store.state.token){
            let code=$(this).parent().text().substring(0,11);
            let old_title="Copy tsclear code"
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
            copyClipboard("!tsclear "+code)
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
          var old_title="Copy tsclear code with like"
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
          copyClipboard("!tsclear "+code+" like")
        });
      },
      getData(){
        $('.loader').show();

        var datatable=$('#table').DataTable()
        var datatable2=$("#playedTable").DataTable()
        datatable.clear().draw();
        datatable2.clear().draw();

        let that = this;
        loadTeamshellApi(function(_rawData,dataNoChange){
          if(dataNoChange){
            $.notify("No new data was loaded",{
              className:"success",
              position:"top right",
            });
          }
          that.raw_data=_rawData
          that.refresh()
        })
      }
    }
  }
</script>