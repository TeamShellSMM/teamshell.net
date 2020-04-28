import $ from 'jquery';

const backendURL = "/backend/";

let loadTeamshellApi = function(urlSlug, token,onLoad){
    let raw_data,noChange=false;
    let url= backendURL + "json";
    let data = {};
    if(token){
        data["token"] = token;
    }
    data["url_slug"] = urlSlug;
    $.post(url,data,function(_data){
        console.log(_data);
        raw_data=JSON.stringify(_data)
        onLoad(raw_data,noChange)
    })
}

let loadMembers = function(data,onLoad){
    let url= backendURL + "json/members";
    $.post(url,data,function(_data){
        onLoad(_data)
    })
}

let loadMakers = function(data,onLoad){
    let url= backendURL + "json/makers";
    $.post(url,data,function(_data){
        onLoad(_data)
    })
}

let login = function(urlSlug, otp, onLoad){
    var url = backendURL + "json/login";
    let data = {
        "url_slug": urlSlug,
        "otp": otp
    }
    $.post(url, data, function(result){
        onLoad(result);
    }, 'json');
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

let ObjectLength_Modern = function( object ) {
    if(!object) return 0
    return Object.keys(object).length;
}

let ObjectLength_Legacy = function( object ) {
    if(!object) return 0
    var length = 0;
    for( var key in object ) {
        if( Object.prototype.hasOwnProperty.call(object, key) ) {
            ++length;
        }
    }
    return length;
}

let ObjectLength = Object.keys ? ObjectLength_Modern : ObjectLength_Legacy;

let getMakerPoints = function(likes, clears, difficultyPoints){
    if(clears == 0){
    return 0;
    }
    return ((likes * 2 + clears)*difficultyPoints) * (likes/clears);
}

export {
    loadTeamshellApi, get_input, save_input, store_input, setGetParam, copyClipboard, removeDups, ObjectLength, getMakerPoints, login, clear, random, putFeedback, loadMembers, loadMakers
}