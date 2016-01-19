'use strict';

var React = require('react-native');

var {
	View,
	Image,
	StyleSheet,
  Dimensions,
} = React;

var DetailToolbar = require('./DetailToolbar');
var GestureImage = require('./modules/GestureImage');
var PinchImage = require('./PinchImage');
var DEVICE_HEIGHT = Dimensions.get('window').height;
var DEVICE_WIDTH = Dimensions.get('window').width;
var FullImage = React.createClass({

	render: function() {
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} />;
    var {height, width} = Dimensions.get('window');

    return (
			<View style={{flex:1}}>
				{toolbar}
			  <View style={styles.imageContainer}>
          <PinchImage 
            style={{ height: height, width: width}}
            toStyle={(layout) => {
            return {
              top: layout.y,
              left: layout.x,
              width: layout.width,
              height: layout.height,
            }
          }}
          onError={console.error.bind(console)}
          uri={this.props.uri} />
        </View> 
      </View>	

		);
	}
});


var styles =  StyleSheet.create({
  toolbar:{
    backgroundColor: '#424242',
    height: 56,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  imageContainer: {
    marginTop: 56,
    backgroundColor:'#424242'
  },
  image: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  }

});


module.exports = FullImage;