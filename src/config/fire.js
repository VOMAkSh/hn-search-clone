import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAI02mdGQwSquQy0yfbSJGFtJjw4y3NGas",
  authDomain: "hn-search-clone.firebaseapp.com",
  databaseURL: "https://hn-search-clone.firebaseio.com",
  projectId: "hn-search-clone",
  storageBucket: "hn-search-clone.appspot.com",
  messagingSenderId: "994356255918"
};

export default firebase.initializeApp(config);