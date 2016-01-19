  'use strict';

var React = require('react-native');

var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  ListView,
  Platform
} = React;

var DetailToolbar = require('./DetailToolbar')
var DataRepository = require('./DataRepository')
var repository = new DataRepository();

var StoryDetail = React.createClass({
	getInitialState: function() {
		return {
			story: this.props.story, 
		};
	},

	componentDidMount: function(){
		this.fetchObject();
	},

	fetchObject: function(){
		repository.getObject(this.props.type, this.state.story.id).then((result) =>{
			if(result){
				this.setState({story: result});
			}
		});
	},
	onAudit: function(){
		this.props.navigator.push({
			name: 'audit_story',
			title: '审核',
			story: this.state.story,
			type: this.props.type
		});
	},
  onShowImage: function(){
    this.props.navigator.push({
      name: 'resouce_list',
      title: '文件上传',
      story: this.state.story,
      type: this.props.type
    });
  },


	render: function () {
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} onAudit={this.onAudit} story={this.state.story}/>;
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
         TouchableElement = TouchableNativeFeedback;
    }
		return (
			<View style={styles.container}>
        <View style={styles.storyTitle}>
          <Text style={styles.textHeader}>{this.state.story.project_name}</Text>
        </View>
				<View style={styles.content}>

          <View style={styles.row}>
            <Image style={styles.icon} source={require('image!ic_access_time_black_48dp')}/>
            <Text style={styles.text}>时间：{this.state.story.createTime}</Text>
          </View>
          <View style={styles.row}>
            <Image style={styles.icon} source={require('image!ic_replay_black_48dp')}/>
            <Text style={styles.text}>状态：{this.state.story.statusStr}</Text>
          </View>
          <View style={styles.row}>
            <Image style={styles.icon} source={require('image!ic_my_location_black_48dp')}/>
            <Text style={styles.text}>位置：{this.state.story.addr}</Text>
          </View>
				
					<View style={styles.row}>
						 <Image style={styles.icon} source={require('image!ic_description_black_48dp')}/>
            <Text style={styles.text}>描述：{this.state.story.description}</Text>
					</View>

          <View style={styles.line}/>
          <TouchableElement onPress={this.onShowImage}>
            <View style={styles.row}>
              <Image style={styles.icon} source={require('image!ic_remove_red_eye_black_48dp')}/>
              <Text style={styles.text}>查看图片</Text>
            </View>
          </TouchableElement>
          
				</View>
        {toolbar}

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
  row:{
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    alignItems:'center',
  },

  icon:{
    width: 32,
    height: 32,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
  },

  text: {
    fontSize: 14,
  },

  content:{
    flex: 6,
  	margin: 10,
  },

  storyTitle:{
    flex: 1,
  	marginTop:56,
    backgroundColor: '#00a2ed'
  },
  textHeader:{
    marginLeft:16,
    color: '#FFF',
  	fontSize: 24,
  	fontWeight: 'bold',
  },
  storyInfo:{
  	top: 10,
  	bottom: 10
  },

  line:{
    marginTop: 2,
    marginBottom: 2,
    height: 0.5,
    backgroundColor: 'black'

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