<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-3">
        <label for="membershipStatus">Members</label>
        <select name="membershipStatus" id="membershipStatus" class="form-control">
          <option value="1" selected>Members</option>
          <option value="2">Mods</option>
          <option value="4">Unoffical</option>
          <option value="5">All</option>
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
    </table>
  </div>
</template>

<script>
  import { loadMakers } from '../services/helper-service';

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
          'current_season': -1,
          'first_load': true,
          'makers': [],
          'membershipStatus': 1
        }
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
          that.current_season = this.value;
          that.getData();
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
          "order": [[ 5, "desc" ]],
          "columns": [
            { "name": "name", data:"name", title: "Name"},
            { "name": "levels_created", data:"levels_created", title: "Levels Created"},
            { "name": "clears", data:"clears", title: "Clears"},
            { "name": "likes", data:"likes", title: "Likes"},
            { "name": "clear_like_ratio", data:"clear_like_ratio", title: "Like/Clear Ratio"},
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
              targets:5,
            },
            {
            "render": function ( data ) {
                return Math.round(data*100)+"%"
              },
              targets:4,
            }
          ]
        });
        this.getData();
      },
      methods: {
        refresh(){
          var datatable=$('#table').DataTable()
          datatable.clear();
          datatable.rows.add(this.makers)

          datatable.draw();
          $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()

          $('.loader').hide();
        },
        getData(){
          $('.loader').show();

          var datatable=$('#table').DataTable()
          datatable.clear().draw();

          let that = this;

          loadMakers({
            token: that.$store.state[that.$route.params.team].token,
            url_slug: that.$route.params.team,
            membershipStatus: that.membershipStatus,
            season: that.current_season,
          }, function(_rawData){
            console.log(_rawData);
            that.makers = _rawData.data;
            that.refresh()
          })
        }
      }
  }
</script>
