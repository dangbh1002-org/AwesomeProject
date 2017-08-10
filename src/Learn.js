import React, { Component }  from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Notifications} from 'expo';
import PushController from './PushController';

const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
const messages = [
  {
    to: "ExponentPushToken[HcvdjFJLYBxxYguBxvvc6w]",
    sound: 'default',
    body: "You've got mail",
    data: { taskId: 'Fucking sweet' }
  },
  {
    to: "ExponentPushToken[PkgQWtKnZo4jLnoX6DIgaU]",
    sound: 'default',
    title: 'Title here..',
    body: "You've got mail",
    data: { taskId: 'Fucking sweet' }
  }
]


export default class App extends Component {
  constructor(props){
    super(props)
    this.state= {
      notification: {}
    }
    this._handleNotification = this._handleNotification.bind(this);
  }

  componentDidMount(){
    this._pushNotification();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _pushNotification(){
    return fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accept-encoding': 'gzip, deflate'
      },
      body: JSON.stringify(messages)
    })
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson);
    });
  }

  _handleNotification(notification){
    console.log(notification);
    this.setState({notification: notification})
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Choose your notifycation time in seconds.
        </Text>

        <Text>Origin: {this.state.notification.origin}</Text>
        <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
        <PushController/>

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
  },
  picker: {
    width: 100
  }
})
