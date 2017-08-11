import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { createStore } from 'redux';

const createStore = (reducer) => {

  let state;
  let listener = () => {};

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listener();
  };

  const subscribe = (callBack) => {
    listener = callBack;
  }

  dispatch({});
  return { dispatch, getState, subscribe };
}

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      counter: 0
    }

    this.store = null;

    this._onPress = this._onPress.bind(this);
  }

  counter(state = 0, action){
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state
    }
  }

  componentDidMount(){

    this.store = createStore(this.counter);
    this.store.subscribe(() => {
      this.setState({counter: this.store.getState()});
    });
  }

  _onPress(param){
    this.store.dispatch({type: param});
  }


  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this._onPress('INCREMENT')}>
          <Text>INCREMENT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onPress('DECREMENT')}>
          <Text>DECREMENT</Text>
        </TouchableOpacity>

        <Text style={styles.welcome}>
          Hello world from the Mars: {this.state.counter}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
