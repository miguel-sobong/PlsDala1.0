import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';

@Injectable()
export class AuthenticationProvider {

  constructor() {}

  toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  registerUser(userData){
      return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password1).then(user=>{
        userData.lastname = this.toTitleCase(userData.lastname);
        userData.firstname = this.toTitleCase(userData.firstname);
        firebase.database().ref().child('users').child(user.uid).set({
          lastname: userData.lastname, 
          firstname: userData.firstname, 
          birthdate: userData.birthdate, 
          username: userData.username,
          email: user.email,
          id: user.uid,
          profileimage: "https://firebasestorage.googleapis.com/v0/b/plsdala-8609a.appspot.com/o/users%2Fdefault.jpg?alt=media&token=fce4cb44-fc6e-4b05-a1c3-29a18833b515",
          isVerified: false,
          isTerminated: false,
          isDeclined: false,
          rating: 0,
          totalrate: 0,
          isTrackable: false,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    });
}

  //login users
  loginUser(email, password){
     return firebase.auth().signInWithEmailAndPassword(email, password);
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

  checkUsernameAndEmail(username, email){
    return new Promise(resolve=>{
      firebase.database().ref('users').once("value", snapshot=>{
        if(snapshot.val())
        {
          snapshot.forEach(user=>{
            if(email == user.val().email){
              resolve("email-fail");
              return true;
            }
            else if(username == user.val().username){
              resolve("username-fail");
              return true;
            }
            resolve(true)
            return false;
          })
        }
        else
        {
          resolve(true);
        }
      });
    })
  }

  checkLoginUsername(data){
    return new Promise((resolve, reject)=>{
      firebase.database().ref('users').once("value", snapshot=>{
        if(snapshot.val()){
          snapshot.forEach(user=>{
            if(user.val().username == data){
              resolve(user.val().email);
              return true;
            }
            return false;
          })
          reject();
        }
      });
    });
  }
}