'use strict';

var React = require('react-native');

var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} = React;

var DetailToolbar = require('./DetailToolbar')

var StoryDetail = React.createClass({

	onAudit: function(){
		this.props.navigator.push({
			name: 'audit_story',
			title: '审核',
			story: this.props.story
		});
	},

	render: function () {
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} onAudit={this.onAudit} story={this.props.story}/>;
		return (
			<View style={styles.container}>
				{toolbar}
				<View style={styles.content}>
					<View style={styles.storyTitle}>
						<Text style={styles.textHeader}>{this.props.story.project_name}</Text>
					</View>
					<View style={styles.cell}>
						<Text>时间:{this.props.story.createTime}  状态:{this.props.story.statusStr}</Text>
					</View>			
					<View style={styles.cell}>
						<Text>位置:{this.props.story.addr}</Text>
					</View>
					<View style={styles.cell}>
						<Text>{this.props.story.description}</Text>
					</View>
				</View>

			</View>
			
		);	
	}

});

var styles =  StyleSheet.create({
  toolbar:{
    backgroundColor: '#00a2ed',
    height: 56,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  cell:{
  	height: 56,
  	top: 10,	
  },
  content:{
  	flex: 1,
  	margin: 10,
  },
  storyTitle:{
  	top:56,
  	height: 100 
  },
  textHeader:{
  	fontSize: 24,
  	fontWeight: 'bold',
  },
  storyInfo:{
  	top: 10,
  	bottom: 10
  },
  stroyDescription:{
  	flex:2,
  },
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

});

module.exports = StoryDetail;