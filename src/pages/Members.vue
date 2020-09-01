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

      <div class="col-md-3" v-if="rankedTags.length > 0">
        <label for="selectedTag">Category</label>
        <select v-model="selectedTag" v-on:change="getData()" class="form-control">
            <option :value="null" selected>Default</option>
            <option v-for="tag in rankedTags" :key="tag.id" :value="tag.id">{{tag.name}}</option>
        </select>
        <small class="form-text text-muted">Include only the clears of levels with the selected tag.</small>
      </div>
    </div>

    <table id="table" class="compact row-border stripe hover" style="width:100%">

    </table>
  </div>
</template>

<script>
  import { loadEndpoint, makeMedalsCreator} from '../services/helper-service';

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
          'membershipStatus': '1',
          'selectedTag': null,
          'rankedTags': []
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

        $("#selectedTag").change(function(){
          console.log("should refresh");
          that.selectedTag = this.value;
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
              const medalsHtml=makeMedalsCreator(row.member_id,that.data.competition_winners)
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
              timePeriod2: that.timePeriod2,
              selectedTagId: that.selectedTag
            },
            onLoad(_rawData){
              that.members = _rawData.data;
              that.data=_rawData;
              that.rankedTags = _rawData.rankedTags;
              that.refresh()
            },
          });
        },
      }
  }
</script>