import React from "react";
import firebase from "firebase";
import { FirebaseAuth } from "react-firebaseui";


export default function GoogleAuth() {
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        return true;
      }
    },
  };
  return (
      <div>
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
  );
}



