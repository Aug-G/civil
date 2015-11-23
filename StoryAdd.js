'use strict';

var React = require('react-native');

var {
	View,
	TextInput,
	StyleSheet,
	PickerIOS,
	Text,
	TouchableHighlight,
	TouchableNativeFeedback,
	Platform
} = React;

var DetailToolbar = require('./DetailToolbar');

var StoryAdd = React.createClass({
	getInitialState: function() {
		return {
			addr: '',
			project:null,
		};
	},

	onSelectProject: function(project){
		this.setState({
			project: project
		});
	},

	onShowProject: function(){
		console.log(this.props.navigator);
		this.props.navigator.push({
			name: 'project',
			onSelectProject: this.onSelectProject,
		});
	},

	render: function(){
		
		var title = '添加'+this.props.title+'申报';
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} title={title}/>;
		var TouchableElement = TouchableHighlight;
    	if (Platform.OS === 'android') {
      		TouchableElement = TouchableNativeFeedback;
    	}
		return (
			<View style={styles.container}>
				{toolbar}
				<View style={styles.content}>
					<TouchableElement onPress={this.onShowProject}>	
						<View style={styles.select}>
							<Text style={styles.selectText}>{this.state.project ? this.state.project.name : '请选择项目'}</Text>
						</View>
					</TouchableElement>

					<TextInput 
					style={styles.input}  
					value={this.state.addr} 
					onChangeText={(addr) => this.setState({addr})} 
					placeholder="轴线位置"/>
				</View>		
				 
			</View>
		);
	},
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
  select:{
  	backgroundColor: '#00a2ed',
	marginTop: 10,
	marginBottom:10,
	padding:10,
  },
  selectText:{
	color: '#FFF',
	alignSelf: 'center',
	fontSize:16,
	fontWeight: "bold",
  },
  input:{
	fontSize:14,
	marginTop: 10,
	marginBottom: 10,	
  },
  content:{
  	top: 56,
  	flex: 1,
  	margin: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },

});


module.exports = StoryAdd;