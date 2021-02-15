<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="membershipStatus">Members</label>
        <select name="membershipStatus" id="membershipStatus" class="form-control">
          <option value="1" selected>Members</option>
          <option value="2">{{$store.state[$route.params.team].teamSettings.ModName}}</option>
          <option value="4">Unofficial</option>
          <option value="5">All</option>
        </select>
        <small class="form-text text-muted">Filtered records with zero points will be hidden.</small>
      </div>

      <div class="col-md-6" v-if="hasSeasons">
        <label for="currentSeason">Season</label>
        <select name="currentSeason" id="currentSeason" class="form-control" v-model="current_season" @change="getData">
          <option v-for="(s,key) of seasons" v-bind:value="key+1" :key="key+1">{{s.name}}</option>
        </select>
        <small class="form-text text-muted">Includes only the levels submitted within that season</small>
      </div>
    </div>
    <table id="table" class="compact row-border stripe hover" style="width:100%">
    </table>
  </div>
</template>

<script>
  import { loadEndpoint, makeMedalsCreator } from '../services/helper-service';
  export default {
      name: 'Makers',
      data(){

        return {
          'data': '',
          'level_headers': '',
          'tag_labels': '',
          'clears': '',
          'raw_data': '',
          'competition_winners': [],
          'current_season': null,
          'first_load': true,
          'makers': [],
          'membershipStatus': 1,
          'seasons': [],
        }
      },
      computed:{
        hasSeasons(){
          return this.seasons.length>1
        },
      },
      mounted(){
        let that = this;

        $(document).off('click', 'a.dt-maker-link');
        $(document).on('click', 'a.dt-maker-link', function(e){
          e.stopPropagation();
          e.preventDefault();
          that.$router.push("/" + that.$route.params.team + "/maker/" + this.getAttribute("maker"));
        });

        $("#membershipStatus").change(function(){
          that.membershipStatus = this.value;
          that.getData();
        });

        $("#currentSeason").change(function(){
          if(!that.first_load){
            that.current_season = this.value;
            that.getData();
          }
        });

        $('#table').DataTable({
          "language": {
          "emptyTable": "No data found.",
          "info":           "_TOTAL_ records",
          "infoEmpty":      "0 records",
          "infoFiltered":   "/ _MAX_ records",
          },
          //responsive:true,
          paging:false,
          dom : "iti",
          "order": [[ 7, "desc" ]],
          "columns": [
            { "name": "name", data:"name", title: "Name"},
            { "name": "levels_created", data:"levels_created", title: "Levels Created"},
            { "name": "clears", data:"clears", title: "Clears"},
            { "name": "likes", data:"likes", title: "Likes"},
            { "name": "clear_like_ratio", data:"clear_like_ratio", title: "Like/Clear Ratio"},
            { "name": "avg_lcd", title: "Avg LCD"},
            { "name": "maker_skill", title: "Maker Rating"},
            { "name": "maker_points", data:"maker_points", title: "Maker Points"},
          ],
          "columnDefs": [
            {
              "render": function ( data, type ) {
                if(type!="display") return data
                if(data){
                  return "<div class='points'>"+data.toFixed(1)+"</div>"
                }
                return "<div class='points'></div>"
              },
              targets:7,
            },
            {
            "render": function ( data, type, row ) {
                if(row.clears == 0){
                  return 0.0;
                }
                let multi = 1.0;
                if(row.levels_created < 5){
                  multi = row.levels_created/5;
                }
                return (row.maker_points / row.levels_created * multi * (Math.pow(row.likes / row.clears, 1.5))).toFixed(1);
              },
              targets:6,
            },
            {
            "render": function ( data, type, row ) {
                return (row.maker_points / row.levels_created).toFixed(1);
              },
              targets:5,
            },
            {
            "render": function ( data ) {
                return data.toFixed(1)+"%"
              },
              targets:4,
            },
            {
            "render": function ( data, type,row) {

              if(type!="display") return data
              const medalsHtml=makeMedalsCreator(row.creator_id,that.competition_winners)

              return "<div class='creator-name-div'><a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURIComponent(data).replace(/[!'()*]/g, escape) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml +"</div>";
            },
            targets: 0
          }
          ]
        });
        this.getData();
      },
      methods: {
        refresh(){
          $('#table').DataTable().clear().rows.add(this.makers).draw();
          $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()
          $('.loader').hide();
        },
        getData(){
          $('.loader').show();
          $('#table').DataTable().clear().draw()

          let that = this;

          loadEndpoint({
            that,
            route:'json/makers',
            data:{
              membershipStatus: that.membershipStatus,
              season: that.current_season,
            },
            onLoad(_rawData){
              that.makers = _rawData.data;
              that.seasons = _rawData.seasons;
              that.competition_winners=_rawData.competition_winners;
              if(!that.current_season) that.current_season=that.seasons.length
              that.refresh()
            },
          })
        }
      }
  }
</script>
