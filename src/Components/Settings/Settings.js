import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Color from '../ColorConfig';

let firebase = require('firebase');

export default class Settings extends Component {

  constructor(props){
    super(props)
    this.state = {
      auth: null,
      user: null,
    }

    this._getAuth = this._getAuth.bind(this);
    this._signOut = this._signOut.bind(this);
  }

  componentDidMount(){
    this._getAuth();
  }

  _getAuth () {
    let vm = this;
    var unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
      if(auth){
        vm.setState({auth: auth});
        var userRef = firebase.database().ref().child('users/' + auth.uid);
        userRef.on('value', function (snapshot) {
          vm.setState({user: snapshot.val()});
        });
      } else {
        unsubscribe();
      }

    });

  }

  _signOut() {
    let vm = this;
    vm.setState({user: null});
    firebase.auth().signOut();
  }

  render(){

    return(

      <View style={styles.container}>
        {
          this.state.user &&
          <View>
            <Text>Display name:
              <Text style={{fontWeight: 'bold'}}> {this.state.auth.displayName}</Text>
            </Text>
            <Text>Email:
              <Text style={{fontWeight: 'bold'}}> {this.state.user.email}</Text>
            </Text>
            <Text>Uid: {this.state.auth.uid}</Text>
            <TouchableOpacity onPress={this._signOut} style={styles.signInButton}>
              <Text style={{color: 'white', fontSize: 30}}>
                Sign out
              </Text>
            </TouchableOpacity>
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
  signInButton: {
    backgroundColor: Color.purple,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
});
