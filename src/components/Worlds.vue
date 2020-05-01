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
    </div>
    <table id="table" class="compact row-border stripe hover" style="width:100%">
    </table>
  </div>
</template>

<script>
  import { loadWorlds } from '../services/helper-service';

  export default {
      name: 'Worlds',
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
          'worlds': [],
          'membershipStatus': 1,
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
          "order": [[ 0, "asc" ]],
          "columns": [
            { "name": "id", data:"id", title: "ID"},
            { "name": "name", data:"name", title: "Name"},
            { "name": "maker_name", data:"maker_name", title: "Maker Name"},
            { "name": "world_name", data:"world_name", title: "World Name"},
            { "name": "world_world_count", data:"world_world_count", title: "World Count"},
            { "name": "world_level_count", data:"world_level_count", title: "Level Count"}
          ],
          "columnDefs": [
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
            targets: 1
          },
          {
            "render": function ( data, type, row ) {
              if(type!="display") return data;
              let badge=row.maker_id?"<br/><small>(ID:"+row.maker_id+")</small>":"";
              return data + badge
            },
            targets: 2
          }
          ]
        });
        this.getData();
      },
      methods: {
        refresh(){
          var datatable=$('#table').DataTable()
          datatable.clear();
          datatable.rows.add(this.worlds)

          datatable.draw();
          $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()

          $('.loader').hide();
        },
        getData(){
          $('.loader').show();

          var datatable=$('#table').DataTable()
          datatable.clear().draw();

          let that = this;

          loadWorlds({
            token: that.$store.state[that.$route.params.team].token,
            url_slug: that.$route.params.team,
            membershipStatus: that.membershipStatus
          }, function(_rawData){
            console.log(_rawData);
            that.worlds = _rawData.data;
            that.refresh()
          })
        }
      }
  }
</script>
