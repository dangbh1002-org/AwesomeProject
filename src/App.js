import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { createStore } from 'redux';

import Color from './Components/ColorConfig';
import firebase from 'firebase';
import { firebaseApp } from './Components/FirebaseConfig.js';
import Tabs from './Components/RouterConfig';

export default class AwesomeProject extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTab: 'tasksTab',
      notifCount: 0,
      presses: 0,

      email: 'science.mbti@gmail.com',
      password: '88888888',
      auth: null,
      user: null,
      isLoading: false
    }

    this._getAuth = this._getAuth.bind(this);
    this._signIn = this._signIn.bind(this);
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentDidMount(){
    this._getAuth();
  }

  _getAuth (vm = this) {

    vm.setState({isLoading: true})

    var unsubscribe = firebase.auth().onAuthStateChanged((auth) => {

      vm.setState({auth: auth, user: null, isLoading: false});
      if(auth){

        var userRef = firebase.database().ref().child('users/' + auth.uid);
        userRef.once('value', function (snapshot) {
          vm.setState({user: snapshot.val()});
        });

      }

    });
  }


  _signIn(){

    let vm = this;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function (auth) {

    }).catch(function (error) {
      vm.setState({loginError: true, loginMessage: error.message});
    });
  }

  render(){

    return(
      <View style={{flex: 1}}>

        {
          this.state.user &&
          <Tabs/>
        }

        {
          !this.state.isLoading && !this.state.auth &&
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
