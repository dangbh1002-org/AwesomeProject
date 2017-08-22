
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
  Animated,
  Platform,
  Alert
} from 'react-native';
import Color from '../ColorConfig';
let firebase = require('firebase');
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

class Tasks extends Component {
  componentDidMount(vm = this){
    this.props.dispatch(getTasks(this.props.state.user.data.uid));

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          vm.props.navigation.navigate('TaskDetail_Screen', {item: { key: notif.key, name: notif.name}})
          //app is open/resumed because user clicked banner
        }
        // await someAsyncCall();

        if(Platform.OS ==='ios'){
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch(notif._notificationType){
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }
      });
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
          console.log(token)
          // fcm token may not be available on first load, catch it here
      });
  }

  componentWillUnmount() {
      // stop listening for events
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
  }

  render(){
    const {state, dispatch, navigation} = this.props;

    return(
      <View style={styles.container}>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={state.tasks.isFetching || state.user.isFetching}
              onRefresh={() => dispatch(getTasks(state.user.data.uid))}
            />
          }
          >
            { !state.tasks.isFetching && state.tasks.data.length === 0 &&
              <Text style={{marginTop: 10}}>
                You have no task!
              </Text>
            }


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
  }
}

import { connect } from 'react-redux';
import { getTasks } from './Tasks.actions.js';
Tasks = connect(
  state => {
    return { state }
  },
  dispatch => {
    return { dispatch }
  }
)(Tasks);
export default Tasks;


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
