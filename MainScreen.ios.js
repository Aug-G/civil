'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} = React;

var Drawer = require('react-native-drawer');
//var StoriesList = require('./StoriesList');
var ThemesList = require('./ThemeList');
var DRAWER_REF = 'drawer';

var MainScreen = React.createClass({
  getInitialState: function() {
    return ({
      theme: null,
    });
  },
  onSelectTheme: function(theme) {
    this.refs[DRAWER_REF].close();
    this.setState({theme: theme});
  },
  onShow: function(){
    this.refs[DRAWER_REF].open();
  },
  onRefresh: function() {
    this.onSelectTheme(this.state.theme);
  },
  render: function() {
    var drawer = <ThemesList onSelectItem={this.onSelectTheme} />;
    return (
        <Drawer
          ref={DRAWER_REF}
          openDrawerOffset={100}
          panCloseMask={1}
          content={drawer} >
          <View style={styles.container}>
            <TouchableHighlight onPress={this.onShow}>
              <Image source={require('image!ic_menu_white')} style={styles.toolbar} />
            </TouchableHighlight>
          </View>

        </Drawer>
      );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },
  toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
  },
});


module.exports = MainScreen;
