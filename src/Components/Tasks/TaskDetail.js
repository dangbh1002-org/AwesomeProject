import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import Color from '../ColorConfig';

import ImagePicker from 'react-native-image-picker';
var options = {
  title: 'Select Images',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

// import {Ionicons} from '@expo/vector-icons';

let firebase = require('firebase');
// import { ImagePicker } from 'expo';
import base64 from 'base64-js';

export default class TaskDetail extends Component {

  constructor(props){
    super(props)
    this.state = {
      auth: null,
      user: null,
      imageArray: [],
      imageObject: {},

      uploadedImage: [],
      progress: null,
      note: null,
    }

    this._getAuth = this._getAuth.bind(this);
    this._pickImageFromCamera = this._pickImageFromCamera.bind(this);
    this._pickImageFromLibrary = this._pickImageFromLibrary.bind(this);
    this._uploadSingle = this._uploadSingle.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    this._getAuth();
    this.props.navigation.setParams({handleSave: this._submit});
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

  _removeImage(index, key){
    this.state.imageArray.splice(index, 1);
    delete this.state.imageObject[index];
    delete this.state.imageObject[key];
    this.setState({imageArray: this.state.imageArray, imageObject: this.state.imageObject });
  }

  _pickImageFromCamera = async () => {

    ImagePicker.launchCamera(options, (response) => {

      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
      else {
        let uri = response.uri;
        let name = response.fileName;
        let key = name.split('.')[0];
        let mime = 'image/'+name.split('.')[1];

        let item = {key: key, name: name, uri: uri, mime: mime, base64: response.data  };

        if(!this.state.imageObject[key]){
          this.state.imageObject[key] = item;
          this.state.imageArray.push(item);
          this.setState({imageArray: this.state.imageArray, imageObject: this.state.imageObject });
        }

      }
    });

  };

  _pickImageFromLibrary = async () => {

    ImagePicker.launchImageLibrary(options, (response) => {

      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
      else {
        let uri = response.uri;
        let name = response.fileName;
        let key = name.split('.')[0];
        let mime = 'image/'+name.split('.')[1];

        let item = {key: key, name: name, uri: uri, mime: mime, base64: response.data  };

        if(!this.state.imageObject[key]){
          this.state.imageObject[key] = item;
          this.state.imageArray.push(item);
          this.setState({imageArray: this.state.imageArray, imageObject: this.state.imageObject });
        }

      }
    });
  };

  _removeImage(index, key){
    this.state.imageArray.splice(index, 1);
    delete this.state.imageObject[index];
    delete this.state.imageObject[key];
    this.setState({imageArray: this.state.imageArray, imageObject: this.state.imageObject });
  }

  _submit(){
    if(!this.state.note || !this.state.imageArray.length){
      return;
    }

    let vm = this;
    let timeStamp = new Date().getTime() + (Math.floor(Math.random() * 8999) + 1000).toString();
    this.setState({uploadedImage: [], isLoading: true});

    this._uploadSingle(this.state.imageArray, timeStamp, this.state.imageArray.length).then(imagesArray=>{

      let Root = firebase.database().ref();

      let updateObject = {};
      updateObject['/reports/' + timeStamp] = {
        note: vm.state.note,
        startedAt: firebase.database.ServerValue.TIMESTAMP,
        images: imagesArray
      };
      updateObject[`taskUserReports/${vm.props.navigation.state.params.item.key}/${vm.state.auth.uid}/${timeStamp}`] = true;
      Root.update(updateObject).then(_ => {
        vm.setState({uploadedImage: [], isLoading: false});
        vm.props.navigation.goBack();

      })

    })
  }

  _uploadSingle(arrayData, timeStamp, index){

    let vm = this;

    return new Promise((resolve, reject) => {
      let item = arrayData[index-1];
      let contentType = item.mime;
      let name = item.name;
      let imageRef = firebase.storage().ref().child('/productImages/' + timeStamp + '/' + name);

      let blob = base64.toByteArray(item.base64);
      let uploadTask =  imageRef.put(blob, {contentType: contentType});
      return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                vm.setState({progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100});
              }, error => {
                console.log(error.code);
              }, () => {
                vm.state.uploadedImage.push(
                  {
                    fullPath: uploadTask.snapshot.metadata.fullPath,
                    url: uploadTask.snapshot.downloadURL
                  }
                );
                if(index == 1){
                  console.log(1);
                  resolve(vm.state.uploadedImage);
                } else {
                  console.log(2);
                  resolve(this._uploadSingle(arrayData, timeStamp, index - 1));
                }

            });

    });

  }

  render(){

    return(

      <View style={styles.container}>

        { this.state.isLoading &&
            <ActivityIndicator />
        }
        <View style={styles.resultGroup}>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList style={{flex: 1}}
              data={this.state.imageArray}
              extraData={this.state}
              renderItem={({item, index}) =>
                <View style={styles.imageGroup}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => this._removeImage(index, item.key)}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Image source={{uri: item.uri}} style={{flex: 1, height: 300, backgroundColor: 'red', borderRadius: 15, margin: 10}}  />
                </View>
              }
            />
          </View>

          <View style={{flexDirection: 'row', }}>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={this._pickImageFromCamera} style={styles.cameraButton}>
                {/* <Ionicons name='ios-camera' size={45} color='white' /> */}
                <Text style={{color: 'white', fontSize: 18}}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity onPress={this._pickImageFromLibrary} style={styles.cameraButton}>
                {/* <Ionicons name='md-photos' size={45} color='white' /> */}
                <Text style={{color: 'white', fontSize: 18}}>
                  Photo Library
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>


        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
          <TextInput underlineColorAndroid='transparent'
              placeholder="Note here..."
              style={styles.textInput}
              onChangeText={(text) => this.setState({note: text})}
          />
        </KeyboardAvoidingView>

      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 44,
    paddingHorizontal: 10,
    margin: 10
  },
  resultGroup: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10
  },
  imageGroup: {
    flex: 1,
    position: 'relative'
  },
  cameraButton: {
    backgroundColor: Color.pink,
    padding: 10,
    margin: 10,
    borderRadius: 3,
    alignItems: 'center'
  },
  closeButton: {
    margin: 15,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 999,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'grey'
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    backgroundColor: 'transparent'
  }
});
