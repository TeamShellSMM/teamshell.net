import $ from 'jquery';

let loadTeamshellApi = function(onLoad){
    var lastLoaded='',raw_data,_data,noChange=false;
    //raw_data=localStorage.getItem("cachedData")
    if(raw_data){
        _data=JSON.parse(raw_data)
        lastLoaded=_data.lastUpdated
    }
    var url="https://teamshell.net/backend/json?callback=?"
    $.getJSON(url).done(function(_data){
        if(_data=="No Updated Needed"){
            noChange=true;
        } else {
            raw_data=JSON.stringify(_data)
            //ocalStorage.setItem("cachedData",raw_data)
        }
        onLoad(raw_data,noChange)
    })
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

let dev = function(id){
    if(id){
        localStorage.setItem("devid",id)
        console.log('%c This site will now use the sheet with id '+id, 'background: #000; color: #f88501');
    } else {
        localStorage.removeItem("devid")
        console.log('%c This site will now use the main sheet', 'background: #000; color: ##01a09e;');
    }
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
    loadTeamshellApi, get_input, save_input, store_input, setGetParam, copyClipboard, dev, removeDups, ObjectLength, getMakerPoints
}