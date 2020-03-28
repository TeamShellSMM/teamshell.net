<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="membershipStatus">Members</label>
        <select name="membershipStatus" id="membershipStatus" class="form-control">
          <option value="1" selected>Members</option>
          <option value="2">Shelders</option>
          <option value="4">Unoffical</option>
          <option value="5">All</option>
        </select>
        <small class="form-text text-muted">Filtered records with zero points will be hidden.</small>
      </div>

      <div class="col-md-3">
        <label for="timePeriod">Level Time Period</label>
        <select name="timePeriod" id="timePeriod" class="form-control">
          <option value="1" selected>All-Time</option>
          <option value="2" >Monthly</option>
          <option value="3">Weekly</option>
          <option value="4">Daily</option>
        </select>
        <small class="form-text text-muted">Include only the levels submitted within the stated time period.</small>
      </div>

      <div class="col-md-3">
        <label for="timePeriod2">Clear Time Period</label>
        <select name="timePeriod2" id="timePeriod2" class="form-control">
            <option value="1" selected>All-Time</option>
            <option value="2">Monthly</option>
            <option value="3">Weekly</option>
            <option value="4">Daily</option>
        </select>
        <small class="form-text text-muted">Include only the clears registered within the stated time period.</small>
      </div>
    </div>

    <table id="table" class="compact row-border stripe hover" style="width:100%">
      <thead>
        <tr>
          <th>No.</th>
          <th>Member Name</th>
          <th>Shelder</th>
          <th>Member</th>
          <th>Levels Created</th>
          <th>Levels Cleared</th>
          <th>Points</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import { loadTeamshellApi, ObjectLength} from '../services/helper-service';

  export default {
      name: 'Members',
      data(){
        return {
          'data': '',
          'level_headers': '',
          'tag_labels': '',
          'clears': '',
          'raw_data': '',
          'timePeriod': '1',
          'timePeriod2': '1',
          'membershipStatus': '1'
        }
      },
      mounted(){
        let that = this;

        $(document).off('click', 'a.dt-maker-link');
        $(document).on('click', 'a.dt-maker-link', function(e){
          e.stopPropagation();
          e.preventDefault();
          that.$router.push("/maker/" + this.getAttribute("maker"));
        });

        $("#membershipStatus").change(function(){
          that.membershipStatus = this.value;
          that.refresh();
        });

        $("#timePeriod").change(function(){
          that.timePeriod = this.value;
          that.refresh();
        });

        $("#timePeriod2").change(function(){
          that.timePeriod2 = this.value;
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
          "order": [[ 6, "desc" ]],
          "columnDefs": [
            {
              "render": function ( data ) {
                  return "<div class='points'>"+data+"</div>"
              },
              //"orderable": false,
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

                return "<a class='dt-maker-link' href='/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml;
              },
              targets: 1
            },
            {
              visible: false,
              targets:[2,3]
            }
          ],
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

          var member_levels={}
          this.new_codes = {};

          for (let i=1;i<this.data.reuploaded.length;i++){
            if(this.withinTime(this.data.reuploaded[i][7])){
              this.new_codes[this.data.reuploaded[i][0]]={
                "new":this.data.reuploaded[i][5],
                "difficulty":parseFloat(this.data.reuploaded[i][3]),
                "creator":this.data.reuploaded[i][1]
              }
            }
          }
          for (let i=0;i<this.data.levels.length;i++){
            if(this.withinTime(this.data.levels[i][7])){
              this.new_codes[this.data.levels[i][0]]={
                "new":this.data.levels[i][0],
                "difficulty":parseFloat(this.data.levels[i][3]),
                "creator":this.data.levels[i][1],
              }
              if(this.data.levels[i][4]=="1"){
                member_levels[this.data.levels[i][1]]=member_levels[this.data.levels[i][1]]?member_levels[this.data.levels[i][1]]+1:1
              }
            }
          }

          for(let i=0;i<this.data.points.length;i++){
            _points[parseFloat(this.data.points[i][0])]=parseFloat(this.data.points[i][1]);
          }
          this.data.points=_points
          this.tag_labels=this.data.tags

          this.member_clears={}
          for(let i=0;i<this.data.played.length;i++){
            if(this.withinTime(this.data.played[i].created_at,1)){
              let current_player=this.data.played[i].player
              var current_code=this.data.played[i].code

              if(!this.member_clears[current_player]){
                this.member_clears[current_player]={}
              }

              if(this.data.played[i].completed=="1" && this.new_codes[current_code] && this.new_codes[current_code].creator!=current_player){
                var current_level=this.new_codes[current_code].new
                var current_points=this.data.points[this.new_codes[current_code].difficulty]
                if(this.member_clears[current_player][current_level]){ //if have value assign the largest point
                  this.member_clears[current_player][current_level]=Math.max(this.member_clears[current_player][current_level],current_points)
                } else {
                  this.member_clears[current_player][current_level]=current_points
                }
              }
            }
          }

          var toShow=[]
          for(let i=0;i<this.data.members.length;i++){
            let current_player=this.data.members[i][0]
            var levels_cleared=member_levels[current_player]? member_levels[current_player]:0;
            this.data.members[i].push( levels_cleared );
            this.data.members[i].push( ObjectLength(this.member_clears[current_player]) ) //need to fix level clears for self
            this.data.members[i].push( this.sum(this.member_clears[current_player]).toFixed(1) ) //need to use object names instead of array index ;_;
            if(this.data.members[i][5]!="0.0"){
              toShow.push(this.data.members[i])
            }
          }

          toShow.sort(function(a,b){
            return b[5]-a[5]
          })
          for(let i=0;i<toShow.length;i++){
            toShow[i].unshift(i+1)
          }

          var datatable=$('#table').DataTable()
          datatable.clear();
          datatable.rows.add(toShow)
          datatable.column(2).search("")
          datatable.column(3).search("")
          datatable.column(4).search("")
          //
          if(this.membershipStatus=="1"){ //members
            datatable.column(3).search("1",false,true)
          } else if(this.membershipStatus=="2") { //shelders
            datatable.column(2).search("1",false,true)
          } else if(this.membershipStatus=="3") { //pending

            datatable.column(3).search('^$', true, false)
            datatable.column(4).search('^[1-9]$', true, false) //wont work for points. have to filter in data itself
          } else if(this.membershipStatus=="4") { //unoffical
            datatable.column(3).search('^$', true, false)
          } else if(this.membershipStatus=="5") { //unoffical
            datatable.column(3).search("")
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

          loadTeamshellApi(function(_rawData,dataNoChange){
            if(dataNoChange){
              $.notify("No new data was loaded",{
                className:"success",
                position:"top right",
              });
            }
            that.raw_data=_rawData
            that.refresh()
          });
        },
        withinTime(date,clear){
          var varName=clear?"timePeriod2":"timePeriod"
          if(this[varName]=="1"){ //all time
            return true;
          } else if(this[varName]=="2") { //monthly
            return date>=this.data.MONTH_START
          } else if(this[varName]=="3") { //weekly
            return date>=this.data.WEEK_START
          } else if(this[varName]=="4") { //daily
            return date>=this.data.DAY_START
          }
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