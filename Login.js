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
			password:'' 
		};
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
						<Text style={styles.logo}>登录</Text>
					</View>
					<TextInput style={styles.input}  placeholder="用户名"  placeholderTextColor="#FFF"/>	
					<TextInput style={styles.input}  placeholder="密码"  placeholderTextColor="#FFF"/>

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
		backgroundColor: '#00a2ed',
	},
	content:{
		marginLeft:30,
		marginRight:30
	},
	header:{
		alignSelf:'center',
		marginTop: 100,
	},
	logo:{
		fontSize:36,
		color: '#FAFAFA'		
	},

	input:{
		color: '#FFF',
		fontSize:14,
		borderColor: '#FFF',
		borderWidth:1,
		marginTop: 10,
		marginBottom: 10,
	},

	login:{
		backgroundColor: '#0D47A1',
		marginTop: 10,
		marginBottom:10,
		padding:10,
	},
	loginText:{
		color: '#FFF',
		alignSelf: 'center',
		fontSize:20
	},
});

module.exports = Login;