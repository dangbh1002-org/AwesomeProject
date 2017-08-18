import ImagePicker from 'react-native-image-picker';
var options = {
  title: 'Select Images',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const _pickImageFromCamera = () => {
  return dispatch => {
    return ImagePicker.launchCamera(options, (response) => {
      if (!response.didCancel && !response.error && !response.customButton) {
        let uri = response.uri;
        let name = response.fileName;
        let key = name.split('.')[0];
        let mime = 'image/'+name.split('.')[1];
        let item = {key: key, name: name, uri: uri, mime: mime, base64: response.data  };
        dispatch({ type: 'ADD_IMAGE', data: item})
      }
    });
  }
};
const _pickImageFromLibrary = () => {
  return dispatch => {
    return ImagePicker.launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error && !response.customButton) {
        let uri = response.uri;
        let name = response.fileName;
        let key = name.split('.')[0];
        let mime = 'image/'+name.split('.')[1];
        let item = {key: key, name: name, uri: uri, mime: mime, base64: response.data  };
        dispatch({ type: 'ADD_IMAGE', data: item})
      }
    });
  }
};


let firebase = require('firebase');
import base64 from 'base64-js';
const _uploadSingle = (dispatch, arrayData, timeStamp, index) => {

  return new Promise((resolve, reject) => {
    let item = arrayData[index-1];
    let contentType = item.mime;
    let name = item.name;
    let imageRef = firebase.storage().ref().child('/productImages/' + timeStamp + '/' + name);

    let blob = base64.toByteArray(item.base64);
    let uploadTask =  imageRef.put(blob, {contentType: contentType});
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              dispatch({type: 'UPDATE_PROGRESS', data: progress})
            }, error => {
              console.log(error.code);
            }, () => {
              uploadedImage.push(
                {
                  fullPath: uploadTask.snapshot.metadata.fullPath,
                  url: uploadTask.snapshot.downloadURL
                }
              );
              if(index == 1){
                resolve(uploadedImage);
              } else {
                resolve(_uploadSingle(dispatch, arrayData, timeStamp, index - 1));
              }
          });
  });

}

const uploadedImage = [];
const _submit = (arrayData, note, taskKey, uid) => {
  return dispatch => {
    if(!note || !arrayData.length){
      return;
    }

    uploadedImage = [];
    let timeStamp = new Date().getTime() + (Math.floor(Math.random() * 8999) + 1000).toString();

    dispatch({type: 'START_UPLOAD'});
    return _uploadSingle(dispatch, arrayData, timeStamp, arrayData.length).then(imagesArray=>{

      let Root = firebase.database().ref();
      let updateObject = {};
      updateObject['/reports/' + timeStamp] = {
        note: note,
        startedAt: firebase.database.ServerValue.TIMESTAMP,
        images: imagesArray
      };
      updateObject[`taskUserReports/${taskKey}/${uid}/${timeStamp}`] = true;
      return Root.update(updateObject).then(_ => {
        uploadedImage = [];
        dispatch({ type: 'UPLOAD_DONE'});
      });

    })
  }

}

export { _pickImageFromCamera, _pickImageFromLibrary, _submit };
