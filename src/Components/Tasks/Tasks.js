
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

import TaskDetail from './TaskDetail';

let firebase = require('firebase');

export default class Tasks extends Component {

  constructor(props){

    super(props)
    this.state = {

      imageArray: [],
      imageObject: {},

      auth: null,
      user: null,
      loginError: false,
      loginMessage: '',

      todayTasks: [],
      refreshing: false
    }

    this._getAuth = this._getAuth.bind(this);
    this._checkUserTask = this._checkUserTask.bind(this);

  }

  componentDidMount(){
    this._getAuth();
  }

  _getAuth () {
    let vm = this;

    var unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
      // console.log(auth);
      if(auth){
        vm.setState({auth: auth});
        vm._checkUserTask(auth.uid);
        var userRef = firebase.database().ref().child('users/' + auth.uid);
        userRef.on('value', function (snapshot) {
          vm.setState({user: snapshot.val()});
        });

      } else {
        unsubscribe();
      }

    });

  }

  _checkUserTask(userId){
    this.setState({refreshing: true});

    // Hôm nay user có task nào
    let vm = this;
    let ref = firebase.database().ref();
    let todayTasks = [];

    ref.child(`userTasks/${userId}`).once('value', snapTasks => {

      snapTasks.forEach(snapTask => {
        let taskId = snapTask.key;

        ref.child(`tasks/${taskId}`).once('value', snapTask => {

          let taskVal = {
            ...snapTask.val(),
            key: snapTask.key
          };
          /**
           * CHECK RULES OF TASK
           */
          // check time range in month

          let now = new Date().getTime();
          let startDate = new Date(taskVal.startDate.time).getTime();
          let endDate = new Date(taskVal.endDate.time);
          endDatePlus = endDate.setDate(endDate.getDate() + 1)
          if( now < startDate  || now > endDatePlus){
            return;
          }

          let today = new Date().getDay().toString();

          if(taskVal.repeats.indexOf(today) === -1){
            return
          }

          todayTasks.push(taskVal);
          vm.setState({todayTasks: todayTasks, refreshing: false})

        })

      })
    })

  }

  render() {

    return (
      <View style={styles.container}>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._checkUserTask(this.state.auth.uid)}
            />
          }
          >
          {
            this.state.todayTasks &&

            <FlatList
              scrollEnabled={false}
              data={this.state.todayTasks}
              extraData={this.state}
              renderItem={({item, index}) =>
                <View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('TaskDetail_Screen', {item: item})}
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

          }
        </ScrollView>

      </View>
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
