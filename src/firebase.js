import firebase from 'firebase';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyC5idhOrfqHy_6EB5MK3Xd4wKXysAIsc_U",
    authDomain: "bm-team-19514.firebaseapp.com",
    databaseURL: "https://bm-team-19514.firebaseio.com",
    projectId: "bm-team-19514",
    storageBucket: "bm-team-19514.appspot.com",
    messagingSenderId: "1097664173752",
    appId: "1:1097664173752:web:e071a8147ace2449edc64d",
    measurementId: "G-HVJHQ449SF"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;