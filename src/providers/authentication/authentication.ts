import { Injectable } from '@angular/core';
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
          email: user.email.toLowerCase(),
          id: user.uid,
          password: userData.password1,
          profileimage: "https://firebasestorage.googleapis.com/v0/b/plsdala-8609a.appspot.com/o/users%2Fdefaultpp.png?alt=media&token=c8c72368-a5f7-4371-9ccb-ea043fcadfa6",
          isVerified: false,
          isTerminated: false,
          isDeclined: false,
          emailVerified: false,
          rating: 0,
          totalrate: 0,
          totaltransaction: 0,
          isTrackable: false,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    });
}

  //login users
  loginUser(email, password){
     return firebase.auth().signInWithEmailAndPassword(email, password).then(user=>{
       firebase.database().ref('users').child(user.uid).update({password: password});
     })
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

  checkUsernameAndEmail(username, email, fname, lname, bday){
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
            else if(this.toTitleCase(fname) == user.val().firstname && this.toTitleCase(lname) == user.val().lastname && bday == user.val().birthdate)
            {
              resolve('repeating-values');
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