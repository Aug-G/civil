/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  Navigator,
  Text,
  View,
  StyleSheet,
  ToolbarAndroid,
  ToastAndroid,
} = React;

var Lightbox = require('react-native-lightbox');


var ToolbarAndroid = require("ToolbarAndroid");
var MainScreen = require('./MainScreen');
var Login = require('./Login');
var DataRepository = require('./DataRepository');
var repository = DataRepository();
var StoryDetail = require('./StoryDetail');
var StoryAdd = require('./StoryAdd');
var StoryAudit = require('./StoryAudit');
var ProjectList = require('./ProjectList');
var ResourceList = require('./ResourceList.js');
var FullImage = require('./FullImage');

var PinchImage = require('./PinchImage');


var _navigator;
BackAndroid.addEventListener('hardwareBackPress', function() {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


var civil = React.createClass({
  getInitialState: function() {
    return {
      isLogin: false,
    };
  },
  loginSuccess: function(){
    console.log(this.state.isLogin);
    this.setState({
      isLogin: true,
    });
  },
  loginFault: function(error, result){
    console.log(error, result);
    this.setState({
      isLogin: false,
    })
  },

  componentWillMount: function(){
    repository.getUser().then((userInfo) => {
       if(userInfo.token){
         this.loginSuccess();
       } 
    });
   },

  RouteMapper: function(route, navigationOperations, onComponentRef) {
    _navigator = navigationOperations;
    if (route.name === 'home') {
      return (
        <View style={styles.container}>
            <MainScreen loginFault={this.loginFault} navigator={navigationOperations}/> 
        </View>
      );
    } else if (route.name === 'story') {
      return (
        <View style={styles.container}>
          <StoryDetail
            style={{flex: 1}}
            type={route.type}
            navigator={navigationOperations}
            story={route.story} />
        </View>
      );
    } else if(route.name === 'add_story'){
      return (
        <View style={styles.container}>
          <StoryAdd style={{flex:1}} navigator={navigationOperations} title={route.title} type={route.type}/>
        </View>
      );
    }else if(route.name === 'audit_story'){
      return (
        <View style={styles.container}>
          <StoryAudit style={{flex:1}} navigator={navigationOperations} story={route.story} title={route.title} type={route.type}/>
        </View>
      );
    }else if(route.name === 'project'){
      return (
        <View style={styles.container}>
          <ProjectList 
          loginFault={this.loginFault}  
          style={{flex:1}} 
          navigator={navigationOperations} 
          onSelectProject={route.onSelectProject}/>
        </View>
      );
    }else if(route.name === 'resouce_list'){
      return (
        <View style={styles.container}>
          <ResourceList 
          type={route.type}
          title={route.title}
          story={route.story} 
          loginFault={this.loginFault}  
          navigator={navigationOperations} /> 
        </View>
      );
    }else if(route.name === 'show_image'){
      return (
        <View style={styles.container}>
          <FullImage 
          navigator={navigationOperations} 
          uri={route.uri}/> 
        </View>
      );
    }
  },

  render: function() {
   var initialRoute = {name: 'home'};
    if(this.state.isLogin){
      return (
        <Lightbox.Navigator
          ref="navigator"
          style={styles.container}
          initialRoute={initialRoute}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={this.RouteMapper}/>
      );
    }else{
      return (
        <Login loginSuccess={this.loginSuccess}/>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


AppRegistry.registerComponent('civil', () => civil);
