import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyAwawXQMphSaw7FP5dnmSZ691-HNOXTyDs",
  authDomain: "reactnative-d8273.firebaseapp.com",
  databaseURL: "https://reactnative-d8273.firebaseio.com",
  projectId: "reactnative-d8273",
  storageBucket: "reactnative-d8273.appspot.com",
  messagingSenderId: "871674816471"
};

export const firebaseApp = firebase.initializeApp(config);
