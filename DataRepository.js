'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

var RNNetworkingManager = require('react-native-networking');

var URL = "http://180.169.17.3:8081/civil";
// var URL = "http://192.168.2./gradlew assembleRelease.101:8080";
// var URL = "http://192.168.57.137:8080";
var API_URL = URL+"/api";
var API_LOGIN = API_URL + "/user/login";
var API_OBJECTS = API_URL+"/declare/";
var API_PROJECT = API_URL + "/declare/project";

var API_COVER_URL = "http://news-at.zhihu.com/api/4/start-image/1080*1776";
var API_LATEST_URL = 'http://news-at.zhihu.com/api/4/news/latest';
var API_HOME_URL = 'http://news.at.zhihu.com/api/4/news/before/';
var API_THEME_URL = 'http://news-at.zhihu.com/api/4/theme/';
var API_THEMES_URL = 'http://news-at.zhihu.com/api/4/themes';


var KEY_COVER = '@Cover';
var KEY_THEMES = '@Themes:';
var KEY_HOME_LIST = '@HomeList:';
var KEY_THEME_LIST = '@ThemeList:';
var KEY_THEME_TOPDATA = '@ThemeTop:';
var KEY_USER_INFO = '@UserInfo';

function parseDateFromYYYYMMdd(str) {
  if (!str) return new Date();
  return new Date(str.slice(0, 4),str.slice(4, 6) - 1,str.slice(6, 8));
}


Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

function DataRepository() { // Singleton pattern
  if (typeof DataRepository.instance === 'object') {
    return DataRepository.instance;
  }

  DataRepository.instance = this;
}


 DataRepository.prototype._safeStorage = function(key: string) {
   return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key, (error, result) => {
      var retData = JSON.parse(result);
      if (error) {
        console.error(error);
        resolve(null);
      } else {
        resolve(retData);
      }
    });
  });
};
DataRepository.prototype.URL = URL;

DataRepository.prototype._safeFetch = function(reqUrl: string, options?: Object) {
  console.log('reqUrl', reqUrl, options);
  return new Promise((resolve, reject) => {
    fetch(reqUrl, options)
      .then((response) => response.json())
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => {
        console.warn(error);
        resolve(null);
      });
  });
};


DataRepository.prototype.getUser = function(callback?: ?(error: ?Error, result: ?Object) => void){
    return this._safeStorage(KEY_USER_INFO);
};

DataRepository.prototype.login = function(username: string, password: string,
  callback?: ?(error: ?Error, result: ?Object) => void
  ){
    return this._safeFetch(API_LOGIN, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }).then((result) => {
        if(!result.errorMessage){
            AsyncStorage.setItem(KEY_USER_INFO, JSON.stringify(result));
        }
        return result;
    }).catch((error) =>{
        console.log(error);
    });

};


DataRepository.prototype._GET = function(url, callback?: ?(error: ?Error, result: ?Object) => void){
  return this._safeStorage(KEY_USER_INFO)
    .then((userInfo) => {
        return this._safeFetch(url, {
            headers:{
                'Accept': 'application/json',
                'Authorization': userInfo.token
            }
        }).then((result) => {
            if(result){
                return result;
            }else{
                callback && callback(new Error('登陆错误'), result);
            }
        }).catch((error) =>{
            console.log(error);
        });
    }).catch((error) =>{
        console.log(error);
    });
}

DataRepository.prototype._POST = function(url: string, data: Object, callback?: ?(error: ?Error, result: ?Object) => void){
  return this._safeFetch(url,{
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data)
  }).then((result)=>{
    return result;
  }).catch((error)=>{
    console.log(error);
  })
}



DataRepository.prototype.getObjects = function(type: string, action: string, page: int,
    callback?: ?(error: ?Error, result: ?Object) => void){
    return this._GET(API_OBJECTS+type+"/list/"+action+"?page="+page, callback);
}

DataRepository.prototype.getObject = function(type: string, id: int, callback?: ?(error: ?Error, result: ?Object) => void){
    return this._GET(API_OBJECTS+type+"/"+id, callback);
} 


DataRepository.prototype.getProjects = function(callback?: ?(error: ?Error, result: ?Object) => void){
  return this._GET(API_PROJECT, callback);
}

DataRepository.prototype.setObject = function(type: string, data: Object, callback?: ?(error: ?Error, result: ?Object) => void){
  return this._POST(API_OBJECTS+type+"/", data, callback);
}

DataRepository.prototype.auditObject = function(type: string, id: int, data: Object, callback?: ?(error: ?Error, result: ?Object) => void){
  return this._POST(API_OBJECTS+type+"/audit/"+id, data, callback);
}

DataRepository.prototype.getFiles = function(type: string, id: int, callback?: ?(error: ?Error, result: ?Object) => void){
  return this._GET(API_OBJECTS+type+"/"+id+"/files", callback);
} 

DataRepository.prototype.setObjectImage = function(type: string, id: int, uri: string, callback?: ?(error: ?Error, result: ?Object) => void){
  var options = {
    method: 'POST',
    uri: uri,
    fileName: uri.substring(uri.lastIndexOf('/')+1, uri.length),
    mimeType: 'image/jpg',
    headers: {
      'Accept': 'application/json'
    },
    data: {

    }
  };

  return new Promise((resolve, reject) =>{
    console.log(uri);
    RNNetworkingManager.requestFile(API_OBJECTS+type+"/upload/"+id, options, (err, res) => {
      console.log(err, res);
      if(err){
        resolve(null);
      }
      else{
        resolve(res);
      }
    });
  }).catch((error) => {
      console.warn(error);
      reject(err);
  });
}


DataRepository.prototype._mergeReadState = function(src, dst) {

  if (!src) {
    return dst;
  }

  if (!dst) {
    return src;
  }

  var reads = {};
  var story;
  for (var i = src.stories.length - 1; i >= 0 ; i--) {
    story = src.stories[i];
    reads[story.id] = story.read;
  }

  for (var i = dst.stories.length - 1; i >= 0 ; i--) {
    story = dst.stories[i];
    if (reads[story.id]) {
      story.read = true;
    }
  }

  return dst;
};

module.exports = DataRepository;
