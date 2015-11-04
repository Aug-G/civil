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

var ToolbarAndroid = require("ToolbarAndroid");
var MainScreen = require('./MainScreen');
var  Login = require('./Login'); 

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
      isLogin: false 
    };
  },
  RouteMapper: function(route, navigationOperations, onComponentRef) {
    _navigator = navigationOperations;
    if (route.name === 'home') {
      return (
        <View style={styles.container}>
            <MainScreen navigator={navigationOperations}/> 
        </View>
      );
    } else if (route.name === 'story') {
      return (
        <View style={styles.container}>
        /*
          <StoryScreen
            style={{flex: 1}}
            navigator={navigationOperations}
            story={route.story} />*/
        </View>
      );
    }
  },

  render: function() {
   var initialRoute = {name: 'home'};
    if(this.state.isLogin){
      return (
        <Navigator
          style={styles.container}
          initialRoute={initialRoute}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={this.RouteMapper}/>
      );
    }else{
      return (
        <Login />
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
