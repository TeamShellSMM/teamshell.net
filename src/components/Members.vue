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

      <div class="col-md-3 invisible">
        <label for="timePeriod">Level Time Period</label>
        <select name="timePeriod" id="timePeriod" class="form-control">
          <option value="1" selected>All-Time</option>
          <option value="2" >Monthly</option>
          <option value="3">Weekly</option>
          <option value="4">Daily</option>
        </select>
        <small class="form-text text-muted">Include only the levels submitted within the stated time period.</small>
      </div>

      <div class="col-md-3 invisible">
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

    </table>
  </div>
</template>

<script>
  import { loadEndpoint} from '../services/helper-service';

  export default {
      name: 'Members',
      data(){
        return {
          'members': [],
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
          that.$router.push("/" + that.$route.params.team + "/maker/" + this.getAttribute("maker"));
        });

        $("#membershipStatus").change(function(){
          that.membershipStatus = this.value;
          that.getData();
        });

        $("#timePeriod").change(function(){
          that.timePeriod = this.value;
          that.getData();
        });

        $("#timePeriod2").change(function(){
          that.timePeriod2 = this.value;
          that.getData();
        });

        $("#refresh").click(function(){
          that.getData();
        });

        $('#table').DataTable({
          "language": {
            "emptyTable": "Data is loading. ",
            "info":           "_TOTAL_ records",
            "infoEmpty":      "0 records",
            "infoFiltered":   "/ _MAX_ records",
          },
          //responsive:true,
          paging:false,
          dom : "iti",
          "order": [[ 4, "desc" ]],
          "columns": [
            { "name": "id", data:"id", title: "Id"},
            { "name": "name", data:"name", title: "Name"},
            { "name": "levels_created", data:"levels_created", title: "Levels Created"},
            { "name": "levels_cleared", data:"levels_cleared", title: "Levels Cleared"},
            { "name": "clear_score_sum", data:"clear_score_sum", title: "Points"},
          ],
          "columnDefs": [
            {
              "render": function ( data ) {
                if(data){
                  return "<div class='points'>"+data.toFixed(1)+"</div>"
                }
                return "<div class='points'>0.0</div>"
              },
              //"orderable": false,
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
            targets: 1
          },
          ],
        });
        this.getData();
      },
      methods: {
        refresh(){
          var datatable=$('#table').DataTable()
          datatable.clear();
          datatable.rows.add(this.members)

          datatable.draw();
          $('[data-toggle="tooltip"],.copy,#refresh,#submitButton,.medal').tooltip()

          $('.loader').hide();
        },
        getData(){
          $('.loader').show();

          var datatable=$('#table').DataTable()
          datatable.clear().draw();

          let that = this;

          loadEndpoint({
            that,
            route:'json/members',
            data:{
              membershipStatus: that.membershipStatus,
              timePeriod: that.timePeriod,
              timePeriod2: that.timePeriod2
            },
            onLoad(_rawData){
              that.members = _rawData;
              that.refresh()
            },
          });
        },
      }
  }
</script>