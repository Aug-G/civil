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
  Platform,
} = React;

var Lightbox = require('react-native-lightbox');
var ResponsiveImage = require('react-native-responsive-image');
var ImageResizer = require('react-native-image-resizer');

var DetailToolbar = require('./DetailToolbar');
var DataRepository = require('./DataRepository');
var repository = new DataRepository();
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

// var PinchImage = require('./PinchImage');

var image_options = {
  title: '选择图片', 
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '照相', 
  chooseFromLibraryButtonTitle: '从图库里选择',
  maxWidth: 768,
  maxHeight: 1280,
  quality: 0.5,
  allowsEditing: false, // Built in iOS functionality to resize/reposition the image
  noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};



var ResourceList = React.createClass({

	getInitialState: function() {
		var dataSource = new ListView.DataSource({
      		rowHasChanged: (row1, row2) => row1 !== row2,
    	});

		return {
			dataSource: dataSource,
			isLoading: false,
			imageURI: '',
		};
	},
	componentDidMount: function(){
		this.fetchFiles();
	},

	fetchFiles: function(){
		this.setState({isLoading: true});

		repository.getFiles(this.props.type, this.props.story.id).then((result) =>{
      result.map(function(item){
        item.url = repository.URL+item.url;
      });
			this.setState({
				isLoading: false,
				dataSource: this.state.dataSource.cloneWithRows(result),
			})
		});

	},

	renderHeader: function(){
		var TouchableElement = TouchableHighlight;
    	if (Platform.OS === 'android')  {
      		TouchableElement = TouchableNativeFeedback;
    	}

    	return (
    		<View></View>
    	)
	},
	_showImage: function(uri){
		this.props.navigator.push({
			name: 'show_image',
			uri: uri,
		});

	},
	
    _pickImage: function() {
    UIImagePickerManager.showImagePicker(image_options, (cancelled, response) => {
        if (!cancelled) {
          this.setState({isLoading: true});

          repository.setObjectImage(this.props.type, this.props.story.id, response.uri).then((result) => {
                this.fetchFiles(); 
          }).done();
          
      	}
     });
	},

	renderRow: function(image: Object,
		sectionID: number | string,
    	rowID: number | string,
    	highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void){

		var TouchableElement = TouchableHighlight;
    	if (Platform.OS === 'android') {
      		TouchableElement = TouchableNativeFeedback;
    	}

 
                // <Lightbox.Image
                //   swipeToDismiss={false}
                //   underlayColor="white"
                //   lightboxResizeMode="cover"
                //   navigator={this.props.navigator}
                //   style={styles.cellImage}
                //   activeProps={{ resizeMode: 'contain', style: { flex: 1 }}}
                //   source={{uri: image.url}} />
           

		return(
      <TouchableElement onPress={this._showImage.bind(this, image.url)}>
          		<View style={styles.row}>
                 <Image source={{uri:image.url}} style={styles.cellImage} />
             		 <View style={styles.column}>
            			 <Text style={styles.cellText}>{image.name}</Text>
            			 <Text style={styles.cellDesc}>时间：{image.uploadTime}</Text>
          			 </View>
          		</View>
      </TouchableElement>
		);

	},
	render: function(){
		
	    var TouchableElement = TouchableHighlight;
	    if (Platform.OS === 'android') {
	         TouchableElement = TouchableNativeFeedback;
	    }

	    var buttons = [{action: this._pickImage, image:require('image!ic_add_circle_outline_white_24dp')}]; 

	    var toolbar = <DetailToolbar navigator={this.props.navigator} title={this.props.title} style={styles.toolbar} action_buttons={buttons}/>;

	    var content = this.state.dataSource.getRowCount() === 0 ?
      		<View style={styles.centerEmpty}>
      			{toolbar}
        		<Text>{this.state.isLoading ? '正在加载...' : '没有数据'}</Text>
      		</View> :	
			<View style={styles.container}>
				{toolbar}
				<ListView
          		ref="resourcelistview"
          		dataSource={this.state.dataSource}
          		renderRow={this.renderRow}
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
	container:{
		flex:1,
	},
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
  	marginTop: 56,
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
    flexDirection: 'row',
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

  column:{
  	flex: .7,
  	flexDirection: 'column',	
  	marginLeft: 10,
  	marginRight: 10,
  },


  cellImage: {
  	flex: .3,
    backgroundColor: '#dddddd',
    height:80,
    width: 100,
  },

  cellText:{
  	flex: 1,
  	fontSize: 18,
  	fontWeight: "bold",
  },

  cellDesc: {
  	flex: 1,
  },

  actionItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
  },



});
module.exports = ResourceList;