import $ from 'jquery';

const backendURL = "/backend/";

let loadEndpoint = function({route='json',that,onLoad,data={}}){
  let url= backendURL + route;
  $.post(url,{
    token:that.$store.state[that.$route.params.team].token,
    url_slug:that.$route.params.team,
    ...data
    },
    function(_data){
        console.log(_data)
      if(_data.status==="error"){
        if(_data.message==="Authentication error"){
          that.$store.commit(that.$route.params.team + '/setToken', {  });
          that.$store.commit(that.$route.params.team + '/setUserInfo', { });
          localStorage.setItem('member','');
        }
        if(that){
          that.$dialog.alert(_data.message).then(function() {
            $('.loader').hide();
          });
        }
      } else {
        onLoad(_data)
      }
  })
}

let processLevelList=function(data){
    const tags_list=[];
    const levels=[];
    for(let i=0;i<data.levels.length;i++){ //main loop that processes all the stats for the levels
        let level=data.levels[i]
        //adding automatic tags
        let curr_tags=level.tags.split(",")
        if(level.status=="0"||level.status=="-10"){
        curr_tags.unshift("Pending")
        }
        level.tags=curr_tags.join(",")

        //get all the tags used from the data set
        for(let k=0;k<curr_tags.length;k++){
        if(curr_tags[k] && tags_list.indexOf(curr_tags[k])=="-1")
            tags_list.push(curr_tags[k])
        }
        levels.push(level)
    }
    return { tags_list, levels }
}

let makeMedalsLevels=function(wonComps){
  var medalsHtml = "";
  let goldsHtml = "";
  let silversHtml = "";
  let bronzesHtml = "";
  let ironsHtml = "";
  let shellsHtml = "";
  if(wonComps){
    for(let comp of wonComps){
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
  return medalsHtml;
}

let makeMedalsCreator=function(creator,competition_winners){
    //if(!competition_winners) return '';

    let goldsHtml = "";
    let silversHtml = "";
    let bronzesHtml = "";
    let ironsHtml = "";
    let shellsHtml = "";

    for(let i = 0; i < competition_winners.length; i++){
        if(creator == competition_winners[i][1]){
        switch(competition_winners[i][3]){
            case "1":
                goldsHtml += '<div class="medal" title="Gold medalist of ' + competition_winners[i][2] + '"><div class="coin coin-gold"></div></div>';
            break;
            case "2":
                silversHtml += '<div class="medal" title="Silver medalist of ' + competition_winners[i][2] + '"><div class="coin coin-silver"></div></div>';
            break;
            case "3":
                bronzesHtml += '<div class="medal" title="Bronze medalist of ' + competition_winners[i][2] + '"><div class="coin coin-bronze"></div></div>';
            break;
            case "4":
                ironsHtml += '<div class="medal" title="Runner-up of ' + competition_winners[i][2] + '"><div class="coin coin-iron"></div></div>';
            break;
            case "5":
                shellsHtml += '<div class="medal" title="Honorable Mention for ' + competition_winners[i][2] + '"><div class="coin coin-shell"></div></div>';
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

let makeRowItems=function(that,datatable){
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
  loadEndpoint, submitClear, makeRowItems, makeMedalsCreator, makeMedalsLevels, processLevelList, get_input, save_input, store_input, setGetParam, copyClipboard, removeDups, getMakerPoints, clear, random, putFeedback
}