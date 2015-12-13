'use strict';

var React = require('react-native');

var {
	View,
	Image,
	StyleSheet
} = React;


var DetailToolbar = require('./DetailToolbar')
var Lightbox = require('react-native-lightbox');

var FullImage = React.createClass({


	render: function() {
		console.log(this.props.uri);
		var toolbar = <DetailToolbar navigator={this.props.navigator} style={styles.toolbar} />;
	
      return (
      <Lightbox navigator={this.props.navigator}>
        <Image
          source={{ uri: this.props.uri}}
        />
      </Lightbox>
    );

    return (

			<View style={{flex:1}}>

				{toolbar}
			<View style={styles.imageContainer}>
        		<Image style={styles.image} source={{uri: this.props.uri}} />
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
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
    top: 56

  },
  image: {
    flex: 1,
  }

});


module.exports = FullImage;