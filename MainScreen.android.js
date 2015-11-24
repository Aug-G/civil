'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
} = React;

var Drawer = require('react-native-drawer');
var ThemesList = require('./ThemesList');
var StoryList = require('./StoryList');
var SwipeRefreshLayoutAndroid = require('./SwipeRereshLayout');

var DRAWER_REF = 'drawer';
var DRAWER_WIDTH_LEFT = 56;
var toolbarActions = [
  {title: '管理', show: 'always',showWithText:true},
  {title: '夜间模式', show: 'never'},
  {title: '设置选项', show: 'never'},
];

var declareToolbar = [
  {title: 'declare', show: 'always', icon:require('image!ic_dashboard_white_24dp')},
  {title: 'add', show: 'always', icon:require('image!ic_add_circle_outline_white_24dp')},
];
  

var managementToolbar  =[
  {title: 'management', show: 'always',icon:require('image!ic_file_upload_white_24dp')},
];

var MainScreen = React.createClass({
  getInitialState: function() {
    return ({
      toolbarActions: declareToolbar,
      action: 'declare',
      theme: {'name':'底板', 'icon': 'image!home', 'key': 'floor'},
    });
  },
  onSelectTheme: function(theme) {
    this.refs[DRAWER_REF].closeDrawer();
    this.setState({theme: theme});
  },
  onActionSelected: function(position){
      console.log(position);
      switch(position){
        case 0:
          var isDeclare = this.state.action == 'declare';
          var toolbarActions =  !isDeclare ? declareToolbar: managementToolbar;
          this.setState({
            action: !isDeclare ? 'declare': 'management',
            toolbarActions: toolbarActions,
          })
          break;
        case 1:
          this.props.navigator.push({
            name: 'add_story',
            title: this.state.theme.name,
            type: this.state.theme.key,
          });
          break;
      }
  },
  _renderNavigationView: function() {
    return (
      <ThemesList
        onSelectItem={this.onSelectTheme}/>
    );
  },
  onRefresh: function() {
    this.onSelectTheme(this.state.theme);
  },
  onRefreshFinish: function() {
    this.swipeRefreshLayout && this.swipeRefreshLayout.finishRefresh();
  },
  render: function() {
    var action = this.state.action =='declare'? '申报': '管理';
    var title = this.state.theme ? this.state.theme.name + action : '首页';
    return (

      <DrawerLayoutAndroid
        ref={DRAWER_REF}
        drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this._renderNavigationView}>
        <View style={styles.container}>
          <ToolbarAndroid
            navIcon={require('image!ic_menu_white')}
            title={title}
            titleColor="white"
            style={styles.toolbar}
            actions={this.state.toolbarActions}
            onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
            onActionSelected={this.onActionSelected} />
          <SwipeRefreshLayoutAndroid
            ref={(swipeRefreshLayout) => { this.swipeRefreshLayout = swipeRefreshLayout; }}
            onRefresh={this.onRefresh}>
            <StoryList theme={this.state.theme} action={this.state.action} loginFault={this.props.loginFault} navigator={this.props.navigator}
              onRefreshFinish={this.onRefreshFinish}/>
          </SwipeRefreshLayoutAndroid>

        </View>
      </DrawerLayoutAndroid>

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
