import firebase from 'firebase/app';
import 'firebase/auth';


var firebaseConfig = {
    apiKey: "AIzaSyBiwesg4n__VNwxMQ_TxsZgiF6kPq0waAM",
    authDomain: "videogame-blog.firebaseapp.com",
    projectId: "videogame-blog",
    storageBucket: "videogame-blog.appspot.com",
    messagingSenderId: "540135547131",
    appId: "1:540135547131:web:323db06a0d74366877505e"
  };

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

function login() {
    auth.signInWithPopup(provider);
};


function logout() {
    auth.signOut();
};

export {
    auth,
    login,
    logout,
};