
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  RefreshControl,
  Animated
} from 'react-native';
import Color from '../ColorConfig';
let firebase = require('firebase');

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { Provider, connect } from 'react-redux';

import rootReducer from './Tasks.reducers.js';
import { getUser, getTasks } from './Tasks.actions.js';

const TasksList = ({state, dispatch, navigation}) => (
  <View style={styles.container}>
    <Text>{state.tasks.isFetching || state.user.isFetching?'Loading...':''}</Text>

    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={state.tasks.isFetching || state.user.isFetching}
          onRefresh={() => dispatch(getTasks(state.user.data.uid))}
        />
      }
      >

      <FlatList
        scrollEnabled={false}
        data={state.tasks.data}
        // extraData={this.state}
        renderItem={({item, index}) =>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('TaskDetail_Screen', {item: item})}
              style={styles.signInButton}>
              <Text style={{color: 'white', fontSize: 30}}>
                {item.name}
              </Text>
              <Text style={{color: 'white'}}>
                ({item.later === 'true'?'sau':'trước'} {item.actionTime.HH}:{item.actionTime.mm})
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

    </ScrollView>

  </View>
);

TasksList = connect(
  state => {
    return { state: state }
  },
  dispatch => {
    return { dispatch }
  }
)(TasksList);

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  // applyMiddleware(thunkMiddleware, loggerMiddleware)
  applyMiddleware(thunkMiddleware)
);

export default class Tasks extends Component {
  componentDidMount(){
    const unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
      if(auth){
        store.dispatch(getUser(auth)).then(() => {
          store.dispatch(getTasks(auth.uid));
        })
      } else {
        unsubscribe();
      }
    });
  }
  
  render(){
    const { navigation } = this.props;
    return(
      <Provider store={store}>
        <TasksList navigation={navigation}/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  signInForm: {
    backgroundColor: 'white',
    // padding: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  signInInput: {
    marginTop: 5,
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: Color.pink,
    padding: 5,
    borderRadius: 3
  },
  signInButton: {
    backgroundColor: Color.pink,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  }

});
