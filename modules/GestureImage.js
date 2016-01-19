var { requireNativeComponent, PropTypes, View } = require('react-native');


var iface = {
  name: 'GestureImage',
  propTypes: {
  	...View.propTypes,
    uri: PropTypes.string,
  },
};

module.exports = requireNativeComponent('GestureImageView', iface, );