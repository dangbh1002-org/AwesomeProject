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
import Ionicons from 'react-native-vector-icons/Ionicons';

class TaskDetail extends Component {

  constructor(props){
    super(props)
    this.state = {
      note: null,
    }
    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    this.props.navigation.setParams({handleSave: this._submit});
  }

  _submit(){
    if(this.props.state.taskDetail.isLoading){
      return;
    }
    this.props.dispatch(
      _submit(
        this.props.state.taskDetail.imageArray,
        this.state.note,
        this.props.navigation.state.params.item.key,
        this.props.state.user.data.uid
      )
    ).then(_ => this.props.navigation.goBack())
  }

  render(){
    const { state, dispatch } = this.props;
    return(
      <View style={styles.container}>

        { state.taskDetail.isLoading &&
            <ActivityIndicator />
        }
        <View style={styles.resultGroup}>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList style={{flex: 1}}
              data={state.taskDetail.imageArray}
              // extraData={this.state}
              renderItem={({item, index}) =>
                <View style={styles.imageGroup}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => dispatch({type: 'REMOVE_IMAGE', index })}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Image source={{uri: item.uri}} style={{flex: 1, height: 300, borderRadius: 15, margin: 10}}  />
                </View>
              }
            />
          </View>

          <View style={{flexDirection: 'row', }}>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => dispatch(_pickImageFromCamera())} style={styles.cameraButton}>
                <Ionicons name='ios-camera' size={45} color='white' />
                <Text style={{color: 'white', fontSize: 18}}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => dispatch(_pickImageFromLibrary())} style={styles.cameraButton}>
                <Ionicons name='md-photos' size={45} color='white' />
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

import { _pickImageFromCamera, _pickImageFromLibrary, _submit } from './TaskDetail.actions.js'
import { connect } from 'react-redux';

TaskDetail = connect(
  state => {
    return { state }
  },
  dispatch => {
    return { dispatch }
  }
)(TaskDetail);
export default TaskDetail;

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
