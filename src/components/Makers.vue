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
          'membershipStatus': 1,
          'seasons': []
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
            },
            {
            "render": function ( data, type, row ) {
              if(type!="display") return data
              let goldsHtml = "";
              let silversHtml = "";
              let bronzesHtml = "";
              let ironsHtml = "";
              let shellsHtml = "";
              if(row.wonComps){
                for(let comp of row.wonComps){
                  switch(comp.rank){
                    case "1":
                      goldsHtml += '<div class="medal" title="Gold medalist of ' + comp.name + '"><div class="coin coin-gold"></div></div>';
                    break;
                    case "2":
                      silversHtml += '<div class="medal" title="Silver medalist of ' + comp.name + '"><div class="coin coin-silver"></div></div>';
                    break;
                    case "3":
                      bronzesHtml += '<div class="medal" title="Bronze medalist of ' + comp.name + '"><div class="coin coin-bronze"></div></div>';
                    break;
                    case "4":
                      ironsHtml += '<div class="medal" title="Runner-up of ' + comp.name + '"><div class="coin coin-iron"></div></div>';
                    break;
                    case "5":
                      shellsHtml += '<div class="medal" title="Honorable Mention for ' + comp.name + '"><div class="coin coin-shell"></div></div>';
                    break;
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
            targets: 0
          }
          ]
        });
        this.getData();
      },
      methods: {
        refresh(){
          if(this.first_load){
            var selectNode = document.getElementById('currentSeason');
            while(selectNode.firstChild){
              selectNode.removeChild(selectNode.firstChild);
            }

            for(let i = 0; i < this.seasons.length; i++){
              var opt = document.createElement('option');
              opt.value = i + 1;
              opt.innerHTML = this.seasons[i][1];
              selectNode.appendChild(opt);

              if(this.first_load){
                this.current_season = i + 1;
                selectNode.value = this.current_season;
              }
            }

            this.first_load = false;
          }


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
            that.seasons = _rawData.seasons;
            that.refresh()
          })
        }
      }
  }
</script>
