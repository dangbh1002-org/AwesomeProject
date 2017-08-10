import React, {Component} from 'react';

import {Permissions, Notifications} from 'expo';
import firebase from 'firebase';

export default class PushController extends Component {
  componentDidMount(){
    this.registerForPushNotificationsAsync();
  }

  registerForPushNotificationsAsync = async () => {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if(existingStatus !== 'granted'){
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if(finalStatus !== 'granted'){
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    firebase.database().ref('users/' + this.props.uid).update({token: token});

  }


  render(){
    return null;
  }
}
