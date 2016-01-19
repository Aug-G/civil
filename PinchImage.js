var React = require('react-native');

var {
  View,
  Image,
  Text,
  PropTypes
} = React;

var {
  events,
  draggable,
  drag,
  pinch,
  GestureView,

} = require('react-native-gestures');


var PinchImage = React.createClass({

  mixins: [events(['onLayout']), draggable()],

  propTypes: {
    gestures: PropTypes.array.isRequired,
    onError: PropTypes.func.isRequired,
    toStyle: PropTypes.func.isRequired,
    style: PropTypes.any,
    children: PropTypes.array,
    uri: PropTypes.string,
  },

  getDefaultProps: function(){
    return {
      gestures: [drag, pinch],
      
    };
  },
  componentWillMount (){
    console.log(this.layoutStream);
  },

  componentDidMount () {

    this.layoutStream.subscribe(
      (layout) => this.container.setNativeProps({
        style: this.props.toStyle(layout)
      }),
      (err) => this.props.onError(err)
    )

  },

  render: function () {
    let props = {
      ref: (container) => this.container = container,
      style: this.props.style,
      onLayout: ({nativeEvent}) => {
        this.onLayout.onNext(nativeEvent)
      },
      ...this.gestureResponder.panHandlers,
    }
    console.log(props);

    return (
      <View {...props}> 
        <Image resizeMode={'contain'} source={{uri: this.props.uri, scale: 3}} style={{flex:1}}/>
      </View>
    );
  }
});

 module.exports =  PinchImage;
