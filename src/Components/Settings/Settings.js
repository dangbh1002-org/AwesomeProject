import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Color from '../ColorConfig';

let firebase = require('firebase');

const Settings = ({state, dispatch}) => (

  <View style={styles.container}>
    {
      state.user.data &&
      <View>
        <Text>Display name:
          <Text style={{fontWeight: 'bold'}}> {state.user.data.displayName}</Text>
        </Text>
        <Text>Email:
          <Text style={{fontWeight: 'bold'}}> {state.user.data.email}</Text>
        </Text>
        <Text>Uid: {state.user.data.uid}</Text>
        <TouchableOpacity onPress={_ => {
          firebase.auth().signOut().then(_ => dispatch({type: 'CLEAR_USER'}));

        }} style={styles.signInButton}>
          <Text style={{color: 'white', fontSize: 30}}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    }

  </View>

);

import { connect } from 'react-redux';
Settings = connect(
  state => {
    return { state }
  },
  dispatch => {
    return { dispatch }
  }
)(Settings);
export default Settings;

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
