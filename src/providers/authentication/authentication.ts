import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';

@Injectable()
export class AuthenticationProvider {

  constructor() {}

  registerUser(userData){
      return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password1).then(user=>{
        console.log(user);
        firebase.database().ref().child('users').child(user.uid).set({
          lastname: userData.lastname, 
          firstname: userData.firstname, 
          birthdate: userData.birthdate, 
          email: user.email,
          password: userData.password1,
          id: user.uid,
          profileimage: "https://firebasestorage.googleapis.com/v0/b/plsdala-8609a.appspot.com/o/users%2Fdefault.jpg?alt=media&token=fce4cb44-fc6e-4b05-a1c3-29a18833b515",
          isVerified: 0,
          isTerminated: 0,
          isDeclined: 0,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    });
}

  //login users
  loginUser(userData){
     return firebase.auth().signInWithEmailAndPassword(userData.email, userData.password);
          //query users table here using success.uid then check for if the users is verified
  }

  logoutUser(){
    return new Promise((resolve, reject)=>{
      firebase.auth().signOut().then(user=>{
        return resolve(user);
      }, error=>{
        return reject(error);
      })
    })
  }
}