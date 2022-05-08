import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);


export const createUser = functions.auth.user().onCreate(event => {
  	
	const user = event.data;
    
	var userObject = {
	  uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
	};
	admin.database().ref('users/' + user.uid).set(userObject);
});
