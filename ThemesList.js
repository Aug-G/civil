'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Platform,
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} = React

var themes =  [
  {'name':'底板', 'icon': 'image!home', 'key': 'floor'},
  {'name':'墙板', 'icon': 'image!home', 'key': 'wall'},
  {'name':'顶板', 'icon': 'image!home', 'key': 'roof'},
  {'name':'结构验收', 'icon': 'image!home', 'key': 'struct'},
  {'name':'竣工验收', 'icon': 'image!home', 'key': 'complet'},
];      

var DataRepository = require('./DataRepository');

var repository = new DataRepository();

var ThemesList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      isLoading: false,
      dataSource: dataSource,
      userInfo: null
    };
  },
  componentDidMount: function() {
    this.fetchThemes();
    repository.getUser().then((userInfo) => {
      if(userInfo.token){
        this.setState({
          userInfo: userInfo
        });
      }
    });
  },
  fetchThemes: function() {
   this.setState({
      isLoading: false,
      dataSource: this.state.dataSource.cloneWithRows(themes)
   }) 
  },
  renderHeader: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android')  {
      TouchableElement = TouchableNativeFeedback;
    }
    return(
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
              <Image
                source={require('image!comment_avatar')}
                style={{width: 40, height: 40, marginLeft: 8, marginRight: 8}} />
              <Text style={styles.menuText}>
                {this.state.userInfo ? this.state.userInfo.realname: ''}
              </Text>
            </View>
        </View>
      </View>
    );
  },
  renderRow: function(
    theme: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var icon = require("image!ic_menu_arrow");

    return (
      <View>
        <TouchableElement
          onPress={() => this.props.onSelectItem(theme)}
          onShowUnderlay={highlightRowFunc}
          onHideUnderlay={highlightRowFunc}>
          <View style={styles.themeItem}>
            <Text style={styles.themeName}>
              {theme.name}申报与管理
            </Text>

            <Image source={icon} style={styles.themeIndicate}/>
          </View>
        </TouchableElement>
      </View>
    );
  },
  render: function() {
    return (
      <View style={styles.container} {...this.props}>
        <ListView
          ref="themeslistview"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          renderHeader={this.renderHeader}
          style={{flex:1, backgroundColor: 'white'}}/>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flex: 1,
    flexDirection: 'column',
  },
  userInfo: {
    flex: 1,
    backgroundColor: '#00a2ed',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    fontSize: 14,
    color: 'white',
  },
  homeTheme: {
    fontSize: 16,
    marginLeft: 16,
    color: '#00a2ed'
  },
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    fontWeight:"bold"
  },
  themeIndicate: {
    marginRight: 16,
    width: 16,
    height: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = ThemesList;
