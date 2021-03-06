'use strict';

var React = require('react-native');

var {
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} = React
var DataRepository = require('./DataRepository');
var DetailToolbar = require('./DetailToolbar');
var repository = new DataRepository();

var ProjectList = React.createClass({
	getInitialState: function() {
		var dataSource = new ListView.DataSource({
      		rowHasChanged: (row1, row2) => row1 !== row2,
    	});
		return {
			dataSource: dataSource,
			isLoading: false	
		};
	},

	componentDidMount: function(){
		this.fetchProjects();
	},

	fetchProjects: function(){
		this.setState({
			isLoading: true
		});

		repository.getProjects(this.props.loginFault)
		.then((result) => {
			this.setState({
				isLoading:false,
				dataSource: this.state.dataSource.cloneWithRows(result),
			});
		});
	},
	onRowSelect: function(project){
		this.props.onSelectProject(project);
		if (this.props.navigator) {
      		this.props.navigator.pop();
    	}
	},

	renderRow: function(
		project: Object,
    	sectionID: number | string,
    	rowID: number | string,
    	highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,){

    	var TouchableElement = TouchableHighlight;
    	if (Platform.OS === 'android') {
      		TouchableElement = TouchableNativeFeedback;
    	}
      
		return (
      		<View>
        		<TouchableElement
          		onPress={() => this.onRowSelect(project)}
          		onShowUnderlay={highlightRowFunc}
          		onHideUnderlay={highlightRowFunc}>
          		<View style={styles.row}>
            		<Text style={styles.projectName}>
              			{project.name}
            		</Text>
          		</View>
        		</TouchableElement>
      		</View>
    );
	},
	render: function () {
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} title="请选择项目"/>;

		var content = this.state.dataSource.getRowCount() === 0 ?
      <View style={styles.centerEmpty}>
      	{toolbar}
        <Text>{this.state.isLoading ? '正在加载...' : '没有数据'}</Text>
      </View> :	
		<View style={{flex:1}}>
			{toolbar}
			<ListView
          		ref="projectlistview"
          		dataSource={this.state.dataSource}
          		renderRow={this.renderRow.bind(this)}
          		automaticallyAdjustContentInsets={false}
          		keyboardDismissMode="on-drag"
          		keyboardShouldPersistTaps={true}
          		showsVerticalScrollIndicator={false}
          		style={styles.list}/>
		</View>;

		return content;
	}
});

var styles =  StyleSheet.create({
  centerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar:{
    backgroundColor: '#00a2ed',
    height: 56,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },

  list:{
  	top: 56,
  	flex: 1,
  	backgroundColor: 'white',
  },
  
  projectItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  projectName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    fontWeight:"bold"
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  },

});
module.exports = ProjectList;