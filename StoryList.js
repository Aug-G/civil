'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Platform,
  Dimensions,
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React

var StoryItem = require('./StoryItem');
var ThemesList = require('./ThemesList');
var DataRepository = require('./DataRepository');

var DRAWER_WIDTH_LEFT = 56;

var repository = new DataRepository();

var dataCache = {
  dataForTheme: {},
  topDataForTheme: {},
  sectionsForTheme: {},
  lastPage: {},
};

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

var StoryList = React.createClass({

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    var headerDataSource = new ListView.DataSource({
      rowHasChanged: (p1, p2) => p1 !== p2,
    });

    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: dataSource,
      headerDataSource: headerDataSource,
    };
  },
  componentDidMount: function() {
    this.fetchStories(this.props.theme, true);
  },
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.fetchStories(nextProps.theme, true, nextProps.action);
  },
  fetchStories: function(theme, isRefresh, action?) {
  	var type = theme.key;
  	var action = action ? action: this.props.action;
    var dataBlob = (dataCache.dataForTheme[type] && !isRefresh) ? dataCache.dataForTheme[type] : [];
    var page = (dataCache.lastPage[type] && !isRefresh) ? dataCache.lastPage[type]: 1;

    this.setState({
      	isLoading: isRefresh,
      	isLoadingTail: !isRefresh,
      	dataSource: this.state.dataSource.cloneWithRows(dataBlob),
    });

    repository.getObjects(type, action, page, this.props.loginFault).then((result)=>{
      var newDataBlob; 
      if(!isRefresh){
        newDataBlob = dataBlob.concat(result); 
      }else{
        newDataBlob = result;
      }
		  this.setState({
      		isLoading: (isRefresh ? false : this.state.isLoading),
      		isLoadingTail: (isRefresh ? this.state.isLoadingTail : false) ,
      		dataSource: this.state.dataSource.cloneWithRows(newDataBlob),
    	});
      dataCache.dataForTheme[type] = newDataBlob;
      dataCache.lastPage[type] = page+1;
      isRefresh && this.props.onRefreshFinish && this.props.onRefreshFinish(); 
    }).catch((error) =>{
      isRefresh && this.props.onRefreshFinish && this.props.onRefreshFinish();
    });    
  },
  _renderPage: function(
    story: Object,
    pageID: number | string,) {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={() => {this.selectStory(story)}}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}
              numberOfLines={2}>
              {story.title}
            </Text>
          </View>
      </TouchableOpacity>
    )
  },
  _renderHeader: function() {
    if (this.props.theme) {
      var themeId = this.props.theme ? this.props.theme.id : 0;
      var topData = dataCache.topDataForTheme[themeId];
      if (!topData) {
        return null;
      }

      var editorsAvator = [];
      if (topData.editors) {
        topData.editors.forEach((editor) => {
          editorsAvator.push(<Image style={styles.editorAvatar} source={{uri: editor.avatar}} />)
        });
      }

      return (
        <View style={{flex: 1}}>
          {this._renderPage({image: topData.background, title: topData.description}, 0)}
          <View style={styles.editors}>
            <Text style={styles.editorsLable}>主编:</Text>
            {editorsAvator}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, height: 200}}>
         
        </View>
      );
    }
  },
  selectStory: function(story: Object) {
    story.read = true;
    // if (Platform.OS === 'ios') {
    //   this.props.navigator.push({
    //     title: story.title,
    //     component: StoryScreen,
    //     passProps: {story},
    //   });
    // } else {
      this.props.navigator.push({
        title: story.title,
        name: 'story',
        story: story,
        type: this.props.theme.key, 
      });
    // }
  },
  renderRow: function(
    story: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <StoryItem
        key={story.id}
        onSelect={() => this.selectStory(story)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        story={story}/>
    );
  },
  onEndReached: function() {
    console.log('onEndReached() ' + this.state.isLoadingTail);
    if (this.state.isLoadingTail) {
      return;
    }
    this.fetchStories(this.props.theme, false);
  },
  setTheme: function(theme) {
    // ToastAndroid.show('选择' + theme.name, ToastAndroid.SHORT);
    this.drawer.closeDrawer();
    this.setState({
      page:1,
      isLoading: this.state.isLoading,
      isLoadingTail: this.state.isLoadingTail,
      theme: theme,
      dataSource: this.state.dataSource,
    });
    this.fetchStories(theme, true);
  },
  onRefresh: function() {
    console.log(this.props.theme);
    this.onSelectTheme(this.props.theme);
  },
  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <View style={styles.centerEmpty}>
        <Text>{this.state.isLoading ? '正在加载...' : '没有数据'}</Text>
      </View> :
      <ListView
        ref="listview"
        style={styles.listview}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        renderSectionHeader={this.renderSectionHeader}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}/>;
    return content;
  }
});

var styles = StyleSheet.create({
  centerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },
  listview: {
    backgroundColor: '#FAFAFA',
  },
  toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
  },
  rator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 14,
    color: '#888888',
    margin: 10,
    marginLeft: 16,
  },
  headerPager: {
    height: 200,
  },
  headerItem: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
  },
  headerTitleContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 10,
  },
  editors: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editorsLable: {
    fontSize: 14,
    color: '#888888',
  },
  editorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    margin: 4,
  }
});

module.exports = StoryList;
