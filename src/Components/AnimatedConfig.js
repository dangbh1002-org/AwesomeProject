import React, {Component} from 'react';

import {Animated, Easing} from 'react-native';

export class FadeInView extends Component {
  constructor(props){
    super(props)
    this.state = {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(100),
    }
  }
  componentDidMount(){
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000
    }).start();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: 1000,
      easing: Easing.bezier(.5,0,.5,1), //easyInOut
    }).start();
  }
  render(){
    return(
      <Animated.View style={{...this.props.style,
        opacity: this.state.opacity,
        transform: [{
          translateY: this.state.translateY
        }]
      }}>
        {this.props.children}
      </Animated.View>
    );
  }
}
