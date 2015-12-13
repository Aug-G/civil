'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');

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

var {
	MKRadioButton,
} = MK;

var { UIImagePickerManager: ImagePickerManager } = NativeModules;
var DetailToolbar = require('./DetailToolbar');
var DataRepository = require('./DataRepository')
var repository = new DataRepository();


var StoryAudit = React.createClass({

	getInitialState: function() {
		var description = this.props.story.description;
		var radioGroup = new MKRadioButton.Group();

		return {
			errorMessage: '',
			radioGroup:radioGroup, 
			status : 2,
			description: description,
		};
	},


	onSelectProject: function(project){
		this.setState({
			project: project
		});
	},

	onAuditObject: function(){
		repository.auditObject(this.props.type, this.props.story.id, {'status': this.state.status, 'description': this.state.description}, null).then((result) =>{
			if(result){
				if (this.props.navigator) {
      				this.props.navigator.pop();
    			}
			}
		});

	},

	render: function(){
		
		var title = this.props.title;
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


		return (
			<View style={styles.container}>
				{toolbar}
				<View style={styles.content}>
					{error}
					<TextInput 
						style={styles.input}  
						value={this.state.description} 
						onChangeText={(description) => this.setState({description})} 
						placeholder="详细信息"/>

					<View style={{top:10,flexDirection: 'row'}}>
						<View style={styles.col}>
            				<MKRadioButton group={this.state.radioGroup} onCheckedChange={(rb) => {if(rb.checked){this.setState({status: this.props.story.status <= 1? 2: 3});}}} checked={true} />
            				<Text style={styles.legendLabel}>{this.props.story.status <= 1?'通过': '退回'}</Text>
          				</View>
          				<View style={styles.col}>
            				<MKRadioButton group={this.state.radioGroup}  onCheckedChange={(rb) => {if(rb.checked){this.setState({status: this.props.story.status <= 1? 1: 4 });}}}  />
            				<Text style={styles.legendLabel}>{this.props.story.status <= 1?'不通过': '归档:'}</Text>
          				</View>
					</View>
										
					<TouchableElement onPress={this.onAuditObject}>	
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
  col: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 7, marginRight: 7,
  },
  legendLabel: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 10, marginBottom: 20,
    fontSize: 12,
    fontWeight: '300',
  },

});


module.exports = StoryAudit;