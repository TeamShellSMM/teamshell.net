import $ from 'jquery';
import moment from 'moment/src/moment';

const backendURL = "/backend/";

let loadEndpoint = function({type='post',route='json',that,onLoad,data={},reloadOnError=true}){
  let url= backendURL + route;
  $.ajax({
    url,
    type,
    data:{
    token:that.$store.state[that.$route.params.team].token,
    url_slug:that.$route.params.team,
    ...data
    },
    success(_data){
      if(_data.status==="error"){
        if(_data.message==="Authentication error" || _data.message==="Token expired. Need to relogin" ){
          that.$store.commit(that.$route.params.team + '/setToken', {  });
          that.$store.commit(that.$route.params.team + '/setUserInfo', { });
          localStorage.setItem('member','');
        }
        if(that){
          that.$dialog.alert(_data.message).then(function() {
            $('.loader').hide();
            if(reloadOnError){
              that.$router.go()
            }
          });
        }
      } else {
        console.log(_data)
        that.$store.commit(that.$route.params.team + '/setTeamAdmin', _data.teamAdmin);
        that.$store.commit(that.$route.params.team + '/setRaceCreator', _data.raceCreator);
        if(_data.teamSettings){
          that.$store.commit(that.$route.params.team + '/setTeamSettings', _data.teamSettings);
          document.title=_data.teamSettings.TeamName || 'MakerTeams'
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href=`/assets/teams/${that.$route.params.team}/favicon.ico`;
        } else {
          document.title='MakerTeams'
        }

        if(_data.competitions){
          that.$store.commit(that.$route.params.team + '/setTeamCompetitions', _data.competitions);
          that.$store.commit(that.$route.params.team + '/setTeamLastCompWinner', _data);
        }
        onLoad(_data)
      }
    },
  })
}

/**
 * Create a clear database
 * @param {JQuery} $ for now we pass the $ here
 * @param {Table} dt the table obj
 * @param {object} that the 'this' of the vue component
 */
let makeClearDatatable=($,dt,that,hidden=[],rowLabel='players')=>{
  $(dt).DataTable({
    "language": {
    "emptyTable": "Data is loading.",
    "info":           `_TOTAL_ ${rowLabel}`,
    "infoEmpty":      "0 rows",
    "infoFiltered":   "/ _MAX_ rows",
    },
    paging:false,
    responsive:true,
    dom : "ti",
    columns:[
      {data:'no'},
      {data:'code'},
      {data:'level_name'},
      {data:'creator_name'},
      {data:'difficulty'},
      {data:'player'},
      {data:'completed'},
      {data:'is_shellder'},
      {data:'liked'},
      {data:'videos'},
      {data:'difficulty_vote'},
      {data:'created_at'},

    ],
    "columnDefs": [
      {
        visible: false,
        targets:hidden,
      },
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
      },{
        "render": function ( data, type, row ) {
          if(type!="display") return data
          return makeLevelName({row, that});
        },
        targets:2,
      },{
        "render": function ( data, type, row ) {
          if(type!="display") return data
          let medalsHtml=makeMedalsCreator(row.creator_id,that.competition_winners)
          return "<a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml;
        },
        targets: 3
      },
      {
        "render": function ( data, type,row ) {
          if(type!="display") return data
          let medalsHtml=makeMedalsCreator(row.player_id,that.competition_winners)
          return "<a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(data) + "' maker='" + data + "'>" + data + "</a>"+medalsHtml;
        },
        targets: 5
      },
      {
        "render": function ( data, type ) {
          if ( type !="display" ) {
              return data=="1"?"1":"0";
          } else {
              return (data=="1"?'<i title="Player has cleared this level." data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
          }
       },
        targets:6
      },
      {
        "render": function ( data, type ) {
          if ( type !="display" ) {
              return data=="1"?"1":"0";
          } else {
              return (data=="1"?'<i title="This is a Mod Clear" data-toggle="tooltip" class="fa fa-check text-success" aria-hidden="true"></i>': "");
          }
        },
        targets:7
      },{
        "render": function ( data, type ) {
          if ( type !="display" ) {
              return data=="1"?"1":"0";
          } else {
              return (data=="1"?'<i title="Player has liked this level" data-toggle="tooltip" class="fa fa-heart text-danger" aria-hidden="true"></i>': "");
          }
        },
        targets:8
      },
      {
        "render": function ( data ) {
          var videos="";
          if(data){
            var raw_vids=data.split(",")
            for(let j=0;j<raw_vids.length;j++){
              videos+="<a class='clear-vid-link' target='_blank' data-toggle='tooltip' title='Video clear' href='"+raw_vids[j].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+"'><i class='fas fa-video' aria-hidden='true'></i></a> "
            }
          }

          return videos;
        },
        targets:9
      },
      {
        "render": function ( data, type ) {
          if ( type !="display" ) {
              return data
          } else {
              return data?parseFloat(data).toFixed(1):""
          }
        },
        targets:10
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
        targets:11
      }
    ]
  });

}

/**
 * Generate the medals for levels
 * @param {number} code
 * @param {object[]} competition_winners
 */
let makeMedalsLevels=function(code,competition_winners=[]){
  let goldsHtml = "";
  let silversHtml = "";
  let bronzesHtml = "";
  let ironsHtml = "";
  let shellsHtml = "";

  for(const comp of competition_winners){
      if(code == comp.code){
      switch(comp.rank){
          case 1:
              goldsHtml += '<div class="medal" title="Gold medalist of ' + comp.details + '"><div class="coin coin-gold"></div></div>';
          break;
          case 2:
              silversHtml += '<div class="medal" title="Silver medalist of ' + comp.details + '"><div class="coin coin-silver"></div></div>';
          break;
          case 3:
              bronzesHtml += '<div class="medal" title="Bronze medalist of ' + comp.details + '"><div class="coin coin-bronze"></div></div>';
          break;
          case 4:
              ironsHtml += '<div class="medal" title="Runner-up of ' + comp.details + '"><div class="coin coin-iron"></div></div>';
          break;
          case 5:
              shellsHtml += '<div class="medal" title="Honorable Mention for ' + comp.details + '"><div class="coin coin-shell"></div></div>';
          break;
          }
      }
  }

  let medalsHtml = "";
  if(goldsHtml != ""){
  medalsHtml += '<div class="level-medals">' + goldsHtml + '</div>';
  }
  if(silversHtml != ""){
  medalsHtml += '<div class="level-medals">' + silversHtml + '</div>';
  }
  if(bronzesHtml != ""){
  medalsHtml += '<div class="level-medals">' + bronzesHtml + '</div>';
  }
  if(ironsHtml != ""){
  medalsHtml += '<div class="level-medals">' + ironsHtml + '</div>';
  }
  if(shellsHtml != ""){
  medalsHtml += '<div class="level-medals">' + shellsHtml + '</div>';
  }
  return medalsHtml
}


let makeMedalsCreator=function(creator,competition_winners=[]){
    let goldsHtml = "";
    let silversHtml = "";
    let bronzesHtml = "";
    let ironsHtml = "";
    let shellsHtml = "";

    for(const comp of competition_winners){
        if(creator == comp.creator){
        switch(comp.rank){
            case 1:
                goldsHtml += '<div class="medal" title="Gold medalist of ' + comp.details + '"><div class="coin coin-gold"></div></div>';
            break;
            case 2:
                silversHtml += '<div class="medal" title="Silver medalist of ' + comp.details + '"><div class="coin coin-silver"></div></div>';
            break;
            case 3:
                bronzesHtml += '<div class="medal" title="Bronze medalist of ' + comp.details + '"><div class="coin coin-bronze"></div></div>';
            break;
            case 4:
                ironsHtml += '<div class="medal" title="Runner-up of ' + comp.details + '"><div class="coin coin-iron"></div></div>';
            break;
            case 5:
                shellsHtml += '<div class="medal" title="Honorable Mention for ' + comp.details + '"><div class="coin coin-shell"></div></div>';
            break;
            }
        }
    }

    let medalsHtml = "";
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
    return medalsHtml
}
/**
 * Creates the clear/like buttons
 * @param {VueComponent} that
 * @param {DataTable} datatable
 */
let makeRowItems=function(that,datatable){
  $(document).off('click', 'span.tag');
  $(document).off('click', 'span.tag',function(){
  });

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
    const button = this;
    const datatableRow=datatable.row($(button).attr('rownum'))
    const code=$(button).attr('code')
    const level_name=$(button).attr('levelname')
    submitClear({
        that,
        datatableRow,
        message:`Are you sure you want to submit a clear for "${level_name}" (${code})?`,
        code,
        args:{
        completed:1,
        },
    })
    });

    $(document).off('click', 'i.dt-unclear-button');
    $(document).on('click', 'i.dt-unclear-button', function(e){
    e.stopPropagation();
    e.preventDefault();
    const button = this;
    const datatableRow=datatable.row($(button).attr('rownum'))
    const code=$(button).attr('code')
    const level_name=$(button).attr('levelname')
    submitClear({
        that,
        datatableRow,
        message:`Are you sure you want to remove your clear and like for "${level_name}" (${code})?`,
        code,
        args:{
        completed:0,
        liked:0,
        },
    })
    });

    $(document).off('click', 'i.dt-like-button');
    $(document).on('click', 'i.dt-like-button', function(e){
    e.stopPropagation();
    e.preventDefault();
    const button = this;
    const datatableRow=datatable.row($(button).attr('rownum'))
    const code=$(button).attr('code')
    const level_name=$(button).attr('levelname')
    let tempData = datatableRow.data();
    let message=`Are you sure you want to submit a clear and like for "${level_name}" (${code})?`;
    let args={
        completed:1,
        liked:1,
    }
    if(tempData.completed){
        message=`Are you sure you want to submit a like for "${level_name}" (${code})?`;
        args={
        liked:1,
        }
    }
    submitClear({
        that,
        datatableRow,
        message,
        code,
        args,
    })
    });

    $(document).off('click', 'i.dt-unlike-button');
    $(document).on('click', 'i.dt-unlike-button', function(e){

    e.stopPropagation();
    e.preventDefault();
    const button = this;
    const datatableRow=datatable.row($(button).attr('rownum'))
    const code=$(button).attr('code')
    const level_name=$(button).attr('levelname')
    submitClear({
        that,
        datatableRow,
        message:`Are you sure you want to remove your like for "${level_name}" (${code})?`,
        code,
        args:{
        liked:0,
        },
    })
    });
}

let submitClear=function({ that, datatableRow , message , code, args={} }){
  if(that.loggedIn){
    that.$dialog
    .confirm(message)
    .then(()=>{
      $('.loader').show();
      loadEndpoint({
        that,
        route:'clear',
        data:{
          code,
          ...args
        },
        onLoad(){
            $('.loader').hide();
            if(datatableRow){
                let tempData = datatableRow.data();
                for(let key in args){
                    tempData[key]=args[key];
                }
                datatableRow.data(tempData).draw();
            }
        },
      })
    })
    .catch(()=>{});
  }
}

let clear = function(urlSlug, data, onLoad){
  var url = backendURL + "clear";
  data["url_slug"] = urlSlug;
  $.post(url, data, function(result){
    onLoad(result);
  }, 'json');
}

let random = function(urlSlug, data, onLoad){
  var url = backendURL + "random";
  data["url_slug"] = urlSlug;
  $.post(url, data, function(response){
    onLoad(response.level);
  });
}

let putFeedback = function(urlSlug, data, onLoad){
  var url = backendURL + "feedback";
  data["url_slug"] = urlSlug;
  $.post(url, data, function(response){
    onLoad(response);
  });
}

let get_input = function(query_name){
  return localStorage.getItem(query_name)
};

let save_input = function(query_name, obj){
  localStorage.setItem(query_name, ($(obj).val()));
};

let store_input = function(query, query_name,obj){
  if(query[query_name]){
    localStorage.setItem(query_name,query[query_name])
    $(obj).val(query[query_name])
  } else if(localStorage.getItem(query_name)){
    $(obj).val(localStorage.getItem(query_name))
  } else {
    localStorage.setItem(query_name,$(obj).val())
  }
};

let setGetParam = function(key,value) {
  localStorage.setItem(key,value)
  if (history.pushState) {
    var params = new URLSearchParams(window.location.search);
    params.set(key, value);
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.pushState({path:newUrl},'',newUrl);
  }
}

let copyClipboard = function(str){
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};



let toggleTooltip= ($,that,old_title,new_title)=>{
  $(that).addClass("text-success")
  $(that).tooltip('hide')
    .attr('title', new_title)
    .attr('data-original-title', new_title)
    .tooltip('update')
    .tooltip('show')

  setTimeout(function(){
    $(that).removeClass("text-success")
    $(that).tooltip('hide')
      .attr('title', old_title)
      .attr('data-original-title', old_title)
      .tooltip('update')
      .tooltip('enable')
  },2000)
}

let makeLevelName=({ row,that })=>{
  var videos="";
  if(row.videos){
    var raw_vids=row.videos.split(",")
    for(let j=0;j<raw_vids.length;j++){
      videos+="<a class='clear-vid-link' target='_blank' data-toggle='tooltip' title='Video clear' href='"+raw_vids[j].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+"'><i class='fas fa-video' aria-hidden='true'></i></a> "
    }
  }
  var tags=row.tags
  tags=tags?tags.split(","):[]
  for(let i=0;i<tags.length;i++){
    let type2=that.tag_labels.find( t=> t.name==tags[i] )
    type2=type2 && type2.type?type2.type:'secondary'
    tags[i]=`<a class="tagLink" href="/${that.$route.params.team}/levels/tags/${tags[i]}"><span class="tag badge badge-pill badge-${type2}">${tags[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span></a>`
  }

  let votesHtml='';
  let statusStr='';
  if(that.$constants.PENDING_LEVELS.includes(row.status)){
    statusStr=`<span class="tag badge badge-pill badge-warning">Pending</span>`
    if(row.approves){
      votesHtml+=`<a class="dt-level-link" href="/${that.$route.params.team}/level/${encodeURI(row.code)}" code="${row.code}" title="Votes for approval"><span class="tag badge badge-pill badge-success">${row.approves}</span></a>`
    }
    if(row.want_fixes){
      votesHtml+=`<a class="dt-level-link" href="/${that.$route.params.team}/level/${encodeURI(row.code)}" code="${row.code}" title="Votes for approval"><span class="tag badge badge-pill badge-warning">${row.want_fixes}</span></a>`
    }
    if(row.rejects){
      votesHtml+=`<a class="dt-level-link" href="/${that.$route.params.team}/level/${encodeURI(row.code)}" code="${row.code}" title="Votes for approval"><span class="tag badge badge-pill badge-danger">${row.rejects}</span></a>`
    }
  }

  if(row.status===that.$constants.LEVEL_STATUS.NEED_FIX){
    statusStr=`<span class="tag badge badge-pill badge-warning">In Fix Status</span>`
  }

  tags=statusStr+tags.join("") + (row.needs_clear_verification ? `<span class="tag badge badge-pill badge-danger">Clear Verification Required</span>` : "");

  let medalsHtmlCreator=makeMedalsCreator(row.creator_id,that.competition_winners)
  let medalsHtml=makeMedalsLevels(row.id,that.competition_winners)

  let makerLink = `<div class='creator-name-div diff-text-mobile'><a class='dt-maker-link' href='/${that.$route.params.team}/maker/${encodeURI(row.creator || row.creator_name)}' maker='${row.creator || row.creator_name}'>${(row.creator || row.creator_name).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a>${medalsHtmlCreator}</div>`;

  return makerLink + "<div class='font-weight-bold level-name-div'>"+medalsHtml+row.level_name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +"<br/>"+ votesHtml+" "+videos + " " + tags + "</div>";
}

let makeLevelsDatatable=({ $, id, that, hidden=[], compMode = false, args})=>{
  const datatable=$(id).DataTable({
    "language": {
    "emptyTable": "Data is loading. ",
    "info":           "_START_ - _END_ of _TOTAL_ levels",
    "infoEmpty":      "0 levels",
    "infoFiltered":   "(_MAX_ total)",
    },
    columns:[
      {data:'no'},
      {data:'code'},
      {data:'creator'},
      {data:'level_name'},
      {data:'difficulty'},
      {data:'status'},
      {data:'new_code'},
      {data:'videos'},
      {data:'created_at'},
      {data:'tags'},
      {data:'clears'},
      {data:'votestr'},
      {data:'likes'},
      {data:'lcd'},
      {data:'completed'},
      {data:'difficulty_vote'},
      {data:'liked'},
    ],
    paging:!compMode,
    ordering:!compMode,
    pagingType: "simple",
    "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
    pageLength:that.pageLength,
    responsive: true,
    dom : "litp",
    "columnDefs": [
      {
        defaultContent:"",
        targets:[6,7,8,9,10,11,12,13,14,15,16]
      },{
        visible: false,
        targets:that.loggedIn?[5,6,7,8,9,...hidden]:[5,6,7,8,9,14,15,16,...hidden],
      },
      { responsivePriority: 1, targets: [0,1,3,4,14,16] },
      { responsivePriority: 2, targets: [14] },
      { responsivePriority: 4, targets: [2,5,6,7,8,9,10,11,12,15] },
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
        "render": function ( data, type, row) {
          if(type!="display") return data
          console.log(row, data);
          const medalsHtml=makeMedalsCreator(row.creator_id,that.data.competition_winners)
          return "<div class='creator-name-div'><a class='dt-maker-link' href='/" + that.$route.params.team + "/maker/" + encodeURI(data) + "' maker='" + data + "'>" + (!row.creator_is_member ? "🔰" : "") + data + "</a>"+ (compMode ? '' : medalsHtml) +"</div>";
        },
        targets: 2
      },{
        "render": function ( data, type, row ) {
          if(type!="display") return data
          return makeLevelName({row, that});
        },
        targets:3,
      },
      {
        "render": function ( data, type, row ) {
          var tags=row.tags
          tags=tags?tags.split(","):[]
          if(tags.indexOf("TeamConsistency")!=-1){
            return "N/A";
          } else {
            return Number(data).toFixed(1);
          }
        },
        targets:4,
      },{
        "render": function ( data, type ) {
          data=data?data.split(","):[0,0]
          if ( type !="display" ) {
            return data[0];
          } else {
            return data[0]+"<br/><span class='tag badge badge-secondary'>"+data[1]+" votes</span>";
          }
        },
        targets:11
      },
      {
        "render": function ( data, type, row, meta ) {
          if ( type !="display" ) {
            return data=="1"?"1":"0";
          } else {
            if(that.loggedIn && row.creator!==that.username){
                return (data=="1"?'<i title="You have cleared this level" data-toggle="tooltip" class="fa fa-check text-success dt-unclear-button" aria-hidden="true" code="' + row.code + '" levelname="' + row.level_name + '" rownum="' + meta.row + '"></i>': '<i title="You have not submitted a clear for this level yet" data-toggle="tooltip" class="fa fa-check fa-inactive dt-clear-button" aria-hidden="true" code="' + row.code + '" levelname="' + row.level_name + '" rownum="' + meta.row + '"></i>');
            } else {
              return '';
            }
          }
        },
        targets:14
      },
      {
        "render": function ( data,type,row ) {
          if(that.loggedIn && row.creator!==that.username){
            return isNaN(data)||data==0?"":Number(data).toFixed(1)
          } else {
            return '';
          }
        },
        targets:15
      },
      {
        "render": function ( data, type, row, meta ) {
          if ( type !="display" ) {
            return data=="1"?"1":"0";
          } else {
            if(that.loggedIn && row.creator!==that.username){
              return (data=="1"?'<i title="You liked this level" data-toggle="tooltip" class="fa fa-heart text-danger dt-unlike-button" aria-hidden="true" code="' + row.code + '" levelname="' + row.level_name + '" rownum="' + meta.row + '"></i>': '<i title="You have not submitted a like for this level yet" data-toggle="tooltip" class="fa fa-heart fa-inactive dt-like-button" aria-hidden="true" code="' + row.code + '" levelname="' + row.level_name + '" rownum="' + meta.row + '"></i>');
            } else {
              return '';
            }
          }
        },
        targets:16
      },
    ],
    ...args,
  });
  makeCodeButtons($,that)
  makeRowItems(that,datatable)
  return datatable;
}

let makeCodeButtons=($,that)=>{

  $(document).off('click', '.copy');
  $(document).on('click', '.copy', function(){
    let code=$(this).parent().text().substring(0,11);
    let new_title="Code copied."
    if(!that.$store.state[that.$route.params.team].token){
      let old_title="Copy clear code"
      toggleTooltip($,this,old_title,new_title)
      copyClipboard("!clear "+code)
    } else {
      let old_title="Copy level code"
      toggleTooltip($,this,old_title,new_title)
      copyClipboard(code)
    }
  })

  $(document).off('click', '.copyLike');
  $(document).on('click', '.copyLike', function(){
    if(!that.$store.state[that.$route.params.team].token){
      let code=$(this).parent().text().substring(0,11);
      let old_title="Copy clear code with like"
      let new_title="Code copied."
      toggleTooltip($,this,new_title,old_title)
      copyClipboard("!clear "+code+" like")
    } else {
      console.log("send like post");
    }
  });
}


let l = function(str){
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

let removeDups = function(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
    unique[i] = true;
    }
  });
  return Object.keys(unique);
}

let getMakerPoints = function(likes, clears, difficultyPoints){
  if(clears == 0){
  return 0;
  }
  return ((likes * 2 + clears)*difficultyPoints) * (likes/clears);
}

export {
  loadEndpoint, submitClear, makeRowItems, makeLevelsDatatable,  makeClearDatatable, makeMedalsCreator, makeMedalsLevels, get_input, save_input, store_input, setGetParam, toggleTooltip, makeCodeButtons, l, removeDups, getMakerPoints, clear, random, putFeedback
}