'use strict';

var React = require('react-native');

var {
	View,
	TextInput,
	NativeModules,
	StyleSheet,
	PickerIOS,
	Text,
	Image,
	TouchableHighlight,
	TouchableNativeFeedback,
	Platform
} = React;
var { UIImagePickerManager: ImagePickerManager } = NativeModules;
var DetailToolbar = require('./DetailToolbar');
var DetailToolbar = require('./DetailToolbar');
var DataRepository = require('./DataRepository')
var repository = new DataRepository();

var StoryAdd = React.createClass({
	getInitialState: function() {
		var show_addr = this.props.type != 'struct' && this.props.type != 'complet';
		return {
			addr: '',
			project:null,
			imageURI: null,
			errorMessage: '',
			show_addr: show_addr};
	},

	onSelectProject: function(project){
		this.setState({
			project: project
		});
	},

	_pickFromCamera: function() {
     ImagePickerManager.launchCamera({}, (cancelled, response) => {
       if (!cancelled) {
         this.setState({ imageURI: response.uri });
       }
     });
   },

    _pickFromImageLibrary: function() {
    ImagePickerManager.launchImageLibrary({}, (cancelled, response) => {
        if (!cancelled) {
        	this.setState({ imageURI: response.uri });
      	}
     });
	},
	onShowProject: function(){
		this.props.navigator.push({
			name: 'project',
			onSelectProject: this.onSelectProject,
		});
	},
	onAddObject: function(){
		if (!this.state.project) {
			this.setState({errorMessage: '请选择项目'});
			return
		};

		if(!this.state.addr && this.state.show_addr){
			this.setState({errorMessage: '请输入轴线位置'});
			return
		}

		repository.setObject(this.props.type, {'addr': this.state.addr, 'project_id': this.state.project.id}).then((result) =>{
			if(result){
				if (this.props.navigator) {
      				this.props.navigator.pop();
    			}
			}
		});

	},

	render: function(){
		
		var title = '添加'+this.props.title+'申报';
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} title={title}/>;
		var TouchableElement = TouchableHighlight;
    	if (Platform.OS === 'android') {
      		TouchableElement = TouchableNativeFeedback;
    	}

    	var error = null; 
		if (this.state.errorMessage){
			error = (<View style={styles.errors} >
						<Text style={styles.message}>{this.state.errorMessage}</Text>
					</View>);
		}
		var addr = null;
		if (this.state.show_addr) {
			addr = (<TextInput 
					style={styles.input}  
					value={this.state.addr} 
					onChangeText={(addr) => this.setState({addr})} 
					placeholder="轴线位置"/>);
		};
	

		return (
			<View style={styles.container}>
				{toolbar}
				<View style={styles.content}>
					{error}
					<TouchableElement onPress={this.onShowProject}>	
						<View style={styles.select}>
							<Text style={styles.selectText}>{this.state.project ? '已选择：'+this.state.project.name : '请选择项目'}</Text>
						</View>
					</TouchableElement>

					{addr}
					<TouchableElement onPress={this.onAddObject}>	
						<View style={styles.select}>
							<Text style={styles.selectText}>提 交</Text>
						</View>
					</TouchableElement>
					
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

  image:{
  	width:100,
  	height: 100,
  	marginTop:10,
  	marginBottom:10,
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
  errors:{
	backgroundColor: '#F06292',
	padding:10,
	marginTop: 10,
	marginBottom: 10,
  },
	
  message:{
	color: '#FFF',
	fontSize: 14,
  },
	

});


module.exports = StoryAdd;