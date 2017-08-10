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
import Tabs from './Components/RouterConfig'
import PushController from './PushController';

var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

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
    }

    this._getAuth = this._getAuth.bind(this);
    this._signIn = this._signIn.bind(this);
    // console.ignoredYellowBox = ['Setting a timer'];
  }

  componentDidMount(){
    this._getAuth();
  }

  _getAuth () {
    let vm = this;

    var unsubscribe = firebase.auth().onAuthStateChanged((auth) => {

      vm.setState({auth: auth, user: null});
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
          this.state.auth &&
          <PushController uid={this.state.auth.uid}/>
        }
        {
          this.state.user &&
          <Tabs/>
        }

        {
          !this.state.auth &&
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
