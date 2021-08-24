import firebase from "firebase/app";
import "firebase/auth"; // to use firebase authentication
import "firebase/database"; // to use the realtime database
import "firebase/storage"; // to use firestore

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};


firebase.initializeApp(config);

export default firebase; // exports makes firebase

