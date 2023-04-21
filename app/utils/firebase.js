import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyDyeV8928JyvuO6V-ShM7LbPktC2Zrc_bA",
    authDomain: "utm210104ti.firebaseapp.com",
    projectId: "utm210104ti",
    storageBucket: "utm210104ti.appspot.com",
    messagingSenderId: "687844623031",
    appId: "1:687844623031:web:7cfea744965f8d5e810332"
  };
  

  //Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);