'use strict';

var React = require('react-native');

var {
	StyleSheet,
	Platform,
	View,
	Image,
	Text,
	TextInput,
	TouchableNativeFeedback,
  	TouchableHighlight,
} = React;



var Login = React.createClass({
	getInitialState: function() {
		return {
			username: '',
			password: '', 
			message: '',
		};
	},

	onLogin : function(){

	},

	render: function() {
		var TouchableElement = TouchableHighlight;
		if (Platform.OS === 'android'){
			TouchableElement = TouchableNativeFeedback;
		}

		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text style={styles.logo}>请输入</Text>
					</View>

					<View style={styles.errors} >
						<Text style={styles.message}>错误提醒</Text>
					</View>


					<TextInput 
						style={styles.input}  
						placeholder="用户名"
						value = {this.state.username}
						onChangeText = {(username) => this.setState({username})}  />


					<TextInput 
						password={true}
						style={styles.input}
						placeholder="密码" 
						value = {this.state.password}
						onChangeText = {(password) => this.setState({password})}  />

					<TouchableElement >
					 	<View style={styles.login}>
					 		<Text style={styles.loginText}>登录</Text>
					 	</View>
					</TouchableElement>
				</View>
			</View>	
		);
	}
});

var styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: '#FFF',
	},
	content:{
		marginLeft:30,
		marginRight:30
	},
	header:{
		alignSelf:'center',
		marginTop: 50,
	},

	logo:{
		fontSize:36,
		color: '#00a2ed',		
		fontWeight: "bold",
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
	
	input:{
		fontSize:14,
		marginTop: 10,
		marginBottom: 10,
	},

	login:{
		backgroundColor: '#00a2ed',
		marginTop: 10,
		marginBottom:10,
		padding:10,
	},
	loginText:{
		color: '#FFF',
		alignSelf: 'center',
		fontSize:20,
		fontWeight: "bold",
	},
});

module.exports = Login;