'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  ToastAndroid,
} = React;

var SwitchAndroid = require('SwitchAndroid');
var ToolbarAndroid = require('ToolbarAndroid');
var statusBarSize = Platform.OS == 'ios' ? 10 : 0;

var DetailToolbar = React.createClass({
  getInitialState: function() {
    return({
      isLoading: true,
      extra: null,
    });
  },
  componentDidMount: function() {
  },
  _onPressBackButton: function() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  _onPressShareButton: function() {
    // TODO:
    ToastAndroid.show('分享', ToastAndroid.SHORT);
  },
  _onPressCollectButton: function() {
    // TODO:
    ToastAndroid.show('收藏', ToastAndroid.SHORT);
  },
  _onPressCommentButton: function() {
    // TODO:
    ToastAndroid.show('评论', ToastAndroid.SHORT);
  },
  _onPressPriseButton: function() {
    // TODO:
    ToastAndroid.show('赞', ToastAndroid.SHORT);
  },
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    var buttons = [];
    if(this.props.action_buttons){
      var num = this.props.action_buttons.length;
      for(var i = 0; i < num; i++){
        var button = this.props.action_buttons[i];
        buttons.push(
          <TouchableElement onPress={button.action}>
            <View style={styles.actionItem}>
              <Image
                style={styles.actionIcon}
                source={button.image}
                resizeMode='contain' />
            </View>
          </TouchableElement>);
      }
    }
    var detail = null;
    if(this.props.onAudit){
      var detail = (
        <TouchableElement onPress={this.props.onAudit}>
            <View style={styles.actionItem}>
              <Image
                style={styles.actionIcon}
                source={require('image!ic_audit')}
                resizeMode='contain' />
            </View>
        </TouchableElement>
      );
    }


    return(
      <View {...this.props}>
        <View style={styles.actionsContainer}>
          <TouchableElement onPress={this._onPressBackButton}>
            <View style={styles.actionItem}>
              <Image
                style={styles.backIcon}
                source={require('image!ic_back_white')}
                resizeMode='contain' />
            </View>
          </TouchableElement>

          <View style={styles.actionItem}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
          <View style={{flex: 1}} />

          {detail}
          {buttons}

        </View>

      </View>
      // <ToolbarAndroid
      //   navIcon={require('image!ic_back_white')}
      //   onIconClicked={this.props.navigator.pop}
      //   titleColor="white"
      //   actions={[]} >
      // </ToolbarAndroid>
    );
  },

});

var styles = StyleSheet.create({
  actionsContainer: {
    height: 56,
    paddingTop: statusBarSize,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 32,
    height: 32,
    marginLeft: 8,
    marginRight: 8,
  },
  actionItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
  },
  title:{
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFF'
  },
  actionIconWithCount: {
    width: 32,
    height: 32,
    marginLeft: 5,
  },
  count: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
});

module.exports = DetailToolbar;
