'use strict';

var React = require('react-native');

var {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} = React;


var TITLE_REF = 'title';

var StoryItem = React.createClass({
  updateReadSate: function() {
    var nativeProps = {style: {color: '#777777'}};
    this.refs[TITLE_REF].setNativeProps(nativeProps);
    this.props.onSelect();
  },
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    // var image = null;
    // if (this.props.story.images && this.props.story.images[0]) {
    //   image = <Image
    //     source={{uri: this.props.story.images[0]}}
    //     style={styles.cellImage} />
    // }

    return (
      <View {...this.props}>
        <TouchableElement
          onPress={this.updateReadSate /*this.props.onSelect*/}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
              * omit a property or set it to undefined if it's inside a shape,
              * even if it isn't required */}
            <Text
              ref={TITLE_REF}
              style={this.props.story.read ? styles.storyTitleRead : styles.storyTitle}
              numberOfLines={3}>
                {this.props.story.project_name}
            </Text>
             <Text style={styles.storyDetail}>
            	{this.props.story.addr? this.props.story.addr : this.props.story.description}
            </Text>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  storyTitle: {
    flex: .7,
    fontSize: 16,
    color: '#333333',
  },
  storyTitleRead: {
    flex: .7,
    fontSize: 16,
    color: '#777777',
  },
  storyDetail:{
  	flex: .3,
  	fontSize: 12,
  	color: '#777777',
  },
  row: {
    flex: 1,
    flexDirection: 'column',
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
  cellImage: {
    backgroundColor: '#dddddd',
    height: 60,
    marginLeft: 10,
    width: 80,
  },
});

module.exports = StoryItem;