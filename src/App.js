import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import Color from './Components/ColorConfig';
import firebase from 'firebase';
import { firebaseApp } from './Components/FirebaseConfig.js';
import Tabs from './Components/RouterConfig';

import FCM from 'react-native-fcm';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      email: 'science.mbti@gmail.com',
      password: '88888888'
    }

    this._signIn = this._signIn.bind(this);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  _signIn(){

    let vm = this;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function (auth) {

    }).catch(function (error) {
      this.props.dispatch({ type: 'ERROR', data: error.message})
    });
  }

  render(){
    const { state, dispatch } = this.props;
    return(
      <View style={{flex: 1}}>
        {
          state.user.data &&
          <Tabs/>
        }
        {
          !state.user.isFetching && !state.user.data &&
          <View style={styles.container}>
            <View style={styles.signInForm}>
              <TextInput underlineColorAndroid='transparent'
                style={styles.signInInput}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
              />

              <TextInput underlineColorAndroid='transparent'
                style={styles.signInInput}
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => this.setState({password})}
              />

              <TouchableOpacity onPress={this._signIn} style={styles.signInButton}>
                <Text style={{color: 'white', fontSize: 30}}>
                  Sign in
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        }

      </View>

    );
  }

}

App = connect(
  state => {
    return { state }
  },
  dispatch => {
    return { dispatch }
  }
)(App)

import { getUser } from './Actions/App.actions.js';
import rootReducers from './Reducers/App.reducers.js';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import thunkMiddleware from 'redux-thunk';

import { createLogger } from 'redux-logger';
const loggerMiddleware = createLogger();

const store = createStore(
  rootReducers,
  // applyMiddleware(thunkMiddleware, loggerMiddleware)
  applyMiddleware(thunkMiddleware)
);

export default class AwesomeProject extends Component {

  componentDidMount(){
    this._getAuth();
  }

  _getAuth (vm = this) {
    var unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
      if(auth){

        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            console.log(token)
        });
        const topics = `/topics/${auth.uid}`
        FCM.subscribeToTopic(topics);

        store.dispatch(getUser(auth));
      } else {

        FCM.subscribeToTopic(topics);
        store.dispatch({ type: 'CLEAR_USER'});
      }
    });
  }

  render(){
    return(
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  signInForm: {
    backgroundColor: 'white',
    padding: 30,
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
    borderColor: Color.purple,
    padding: 5,
    borderRadius: 3
  },
  signInButton: {
    backgroundColor: Color.purple,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  }
});
