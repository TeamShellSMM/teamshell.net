<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="membershipStatus">Members</label>
        <select name="membershipStatus" id="membershipStatus" class="form-control">
          <option value="1" selected>Members</option>
          <option value="2">Mods</option>
          <option value="3">Pending Initiation</option>
          <option value="4">Unoffical</option>
        </select>
        <small class="form-text text-muted">Filtered records with zero points will be hidden.</small>
      </div>

      <div class="col-md-6">
        <label for="currentSeason">Season</label>
        <select name="currentSeason" id="currentSeason" class="form-control">
          <option disabled selected value="1">Loading Seasons...</option>
        </select>
        <small class="form-text text-muted">Includes only the levels submitted within that season</small>
      </div>
    </div>
    <table id="table" class="compact row-border stripe hover" style="width:100%">
      <thead><tr>
        <th>Member Name</th>
        <th>Moderator</th>
        <th>Member</th>
        <th>Levels Created</th>
        <th>Clears</th>
        <th>Likes</th>
        <th>Like/Clear Ratio</th>
        <th>Maker Points</th>
      </tr></thead>
    </table>
  </div>
</template>

<script>
  import moment from 'moment/src/moment';
  import { get_input,  store_input, loadTeamshellApi, getMakerPoints} from '../services/helper-service';

  export default {
      name: 'Makers',
      data(){
        return {
          'data': '',
          'level_headers': '',
          'tag_labels': '',
          'clears': '',
          'raw_data': '',
          'comp_winners': '',
          'current_season': 1,
          'first_load': true
        }
      },
      mounted(){
        store_input('membershipStatus','#membershipStatus');

        let that = this;

        $(document).off('click', 'a.dt-maker-link');
        $(document).on('click', 'a.dt-maker-link', function(e){
          e.stopPropagation();
          e.preventDefault();
          that.$router.push("/" + that.$route.params.team + "/maker/" + this.getAttribute("maker"));
        });

        $("#membershipStatus").change(function(){
          localStorage.setItem("membershipStatus",this.value)
          that.refresh();
        });

        $("#currentSeason").change(function(){
          that.current_season = this.value;
          that.refresh();
        });

        $("#refresh").click(function(){
          that.getData();
        });

        $('#table').DataTable({
          "language": {
          "emptyTable": "Data is loading. You may have to whitelist this site for browser extensions that block third party scripts",
          "info":           "_TOTAL_ records",
          "infoEmpty":      "0 records",
          "infoFiltered":   "/ _MAX_ records",
          },
          //responsive:true,
          paging:false,
          dom : "iti",
          "order": [[ 7, "desc" ]],
          "columnDefs": [
            {
              "render": function ( data, type ) {
                if(type!="display") return data
                return "<div class='points'>"+data+"</div>"
              },
              targets:7,
            },
            {
            "render": function ( data ) {
                return data+"%"
              },
              targets:6,
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
              targets: 0
            },
            {
              visible: false,
              targets:[1,2]
            }
          ]
        });
        this.getData();
      },
      methods: {
        refresh(){
          this.data=JSON.parse(this.raw_data)
          this.data.levels.shift()
          this.data.members.shift()
          this.data.points.shift()
          var _points={0:0}

          this.comp_winners = this.data.comp_winners;

          for(let i=0;i<this.data.points.length;i++){
            _points[parseFloat(this.data.points[i][0])]=parseFloat(this.data.points[i][1]);
          }
          this.data.points=_points

          var levels={};

          var selectNode = document.getElementById('currentSeason');
          while(selectNode.firstChild){
            selectNode.removeChild(selectNode.firstChild);
          }

          for(let i = 0; i < this.data.seasons.length; i++){
            var opt = document.createElement('option');
            opt.value = i + 1;
            opt.innerHTML = this.data.seasons[i].name;
            selectNode.appendChild(opt);

            if(this.first_load){
              if(this.data.seasons[i].startdate != "" && moment().utc() > moment.unix(parseInt(this.data.seasons[i].startdate)).utc()){
                this.current_season = i + 1;
              }
            }
          }

          this.first_load = false;

          selectNode.value = this.current_season;


          for (let i=1;i<this.data.reuploaded.length;i++){
            if(this.withinSeason(this.data.reuploaded[i][7], this.data.seasons)){
              levels[this.data.reuploaded[i][0]]={
                "new":this.data.reuploaded[i][5],
                "difficulty":parseFloat(this.data.reuploaded[i][3]),
                "creator": this.data.reuploaded[i][1],
                "clears": 0,
                "likes": 0
              }
            }
          }
          for (let i=0;i<this.data.levels.length;i++){
            if(this.withinSeason(this.data.levels[i][7], this.data.seasons) && this.data.levels[i][4]){
              levels[this.data.levels[i][0]]={
                "new":this.data.levels[i][0],
                "difficulty":parseFloat(this.data.levels[i][3]),
                "creator": this.data.levels[i][1],
                "clears": 0,
                "likes": 0
              }
            }
          }

          for(let i=0;i<this.data.played.length;i++){
            var current_level=this.data.played[i].code
            var current_creator=this.data.played[i].player
            if(levels[current_level] && levels[current_level].creator!=current_creator){
              if(this.data.played[i].liked == "1"){
                levels[current_level]["likes"] = levels[current_level]["likes"] ? levels[current_level]["likes"] + 1 : 1;
              }
              if(this.data.played[i].completed == "1"){
                levels[current_level]["clears"] = levels[current_level]["clears"] ? levels[current_level]["clears"] + 1 : 1;
              }
            }
          }

          //console.log("the levels are", levels);

          var makers = {};
          for(var levelCode in levels){
            if(!makers[levels[levelCode].creator]){
              makers[levels[levelCode].creator] = {
                "levelcount": 0,
                "clears": 0,
                "likes": 0,
                "ratio": 0,
                "points": 0,
                "shelder": 0,
                "cult_member": 0
              };
            }

            makers[levels[levelCode].creator].levelcount++;
            makers[levels[levelCode].creator].likes += levels[levelCode].likes;
            makers[levels[levelCode].creator].clears += levels[levelCode].clears;
            makers[levels[levelCode].creator].points += getMakerPoints(levels[levelCode].likes, levels[levelCode].clears, this.data.points[levels[levelCode].difficulty]);
          }

          for(let i = 0; i < this.data.members.length; i++){
            if(!makers[this.data.members[i][0]]){
              makers[this.data.members[i][0]] = {
                "levelcount": 0,
                "clears": 0,
                "likes": 0,
                "ratio": 0,
                "points": 0,
                "shelder": 0,
                "cult_member": 0
              };
            }
            makers[this.data.members[i][0]].shelder = this.data.members[i][1];
            makers[this.data.members[i][0]].cult_member = this.data.members[i][2];
          }

          var toShow = [];
          for(var creatorName in makers){
            if(makers[creatorName].clears){
              makers[creatorName].ratio = Math.round(makers[creatorName].likes / makers[creatorName].clears * 100);
            } else {
              makers[creatorName].ratio = 0;
            }
            makers[creatorName].points = Math.round(makers[creatorName].points);

            var row = [
              creatorName,
              makers[creatorName].shelder,
              makers[creatorName].cult_member,
              makers[creatorName].levelcount,
              makers[creatorName].clears,
              makers[creatorName].likes,
              makers[creatorName].ratio,
              makers[creatorName].points
            ];

            toShow.push(row);
          }

          //console.log("makers are", makers);


          var datatable=$('#table').DataTable()
          datatable.clear();
          datatable.rows.add(toShow)
          datatable.column(1).search("")
          datatable.column(2).search("")
          datatable.column(3).search("")

          if(get_input('creator')){
            datatable.column(2).search('"'+get_input('creator')+'"',false,true)
          }
          //
          if(get_input('membershipStatus')=="1"){ //members
            datatable.column(2).search("1",false,true)
          } else if(get_input('membershipStatus')=="2") { //shelders
            datatable.column(1).search("1",false,true)
          } else if(get_input('membershipStatus')=="3") { //pending

            datatable.column(2).search('^$', true, false)
            datatable.column(3).search('^[1-9]$', true, false) //wont work for points. have to filter in data itself
          } else if(get_input('membershipStatus')=="4") { //unoffical
            datatable.column(2).search('^$', true, false)
          }

          datatable.draw();
          $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()

          $('.loader').hide();
        },
        getData(){
          $('.loader').show();

          var datatable=$('#table').DataTable()
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
        withinSeason(date,seasons){
          var min_date = 0;
          var max_date = 99999999999;

          for(var i = 0; i < seasons.length; i++){
            var to_date;
            if(i == (seasons.length - 1)){
              to_date = max_date;
            } else {
              to_date = seasons[i + 1].startdate;
            }

            var from_date;
            if(seasons[i].startdate == ""){
              from_date = min_date;
            } else {
              from_date = seasons[i].startdate;
            }

            if(this.current_season == (i + 1) && date >= from_date && date < to_date){
              return true;
            }
          }
          return false;
        },
        sum(obj){
          if(!obj) return 0
          var ret=0
          for(var i in obj){
            ret+=obj[i]
          }
          return ret
        }
      }
  }
</script>
