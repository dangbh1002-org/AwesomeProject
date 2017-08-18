// actions.js
let firebase = require('firebase');

// auth
const requestUser = () => {
  return { type: 'REQUEST_USER' }
}
const receiveUser = (data) => {
  return { type: 'RECEIVE_USER', data }
}
const getUser = (auth) => {
  return dispatch => {
    dispatch(requestUser());
    let userRef = firebase.database().ref().child('users/' + auth.uid);
    return userRef.once('value', function (snapshot) {
      let data = {...snapshot.val(), uid: auth.uid, displayName: auth.displayName}
      dispatch(receiveUser(data));
    });
  }

};

export {getUser};
