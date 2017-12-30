import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/Rx';
// import * as firebase from 'firebase';

@Injectable()
export class AuthenticationProvider {

	RegUser: AngularFireList<any>;
  user: any;
  baseUrl = 'https://plsdala-8609a.firebaseio.com/';

  constructor(public afd: AngularFireDatabase, public http: Http) {
    this.RegUser = this.afd.list('users');
    console.log('Hello AuthenticationProvider Provider');
  }


  //get users from database
  getUsers():any{
    return new Promise((resolve, reject)=>{
    this.http.get(this.baseUrl + 'users.json').map(res => res.json()).subscribe(data => {
      //if no registered user
        if(data==null){
          console.log('null');
          resolve(data);
          return;
        }
      //if there is registerd users
        else{
          console.log('!null');
          resolve(data);
          return;
        }
      }, data => { //if no internet
        reject('Cannot connect to the database')
        return;
      });
    })
  }

  //login users
  loginUser(email, password):any{
    return new Promise((resolve, reject)=>{
      this.getUsers().then(data=>{
      if(data){
        for(var i in data){
          if(data[i].email == email && data[i].password == password){
            localStorage.setItem('name', data[i].firstname + ' ' + data[i].lastname);
            resolve(true);
            return;
          }
        }
          resolve(false);
          return;
      }
      else{
        console.log(data);
        reject('User does not exist. Please register first before logging in');
        return;
      }
    }, reason => {
        reject(reason);
        console.log(reason);
      })
  });
  }

  //register users
  registerUser(lastname, firstname, birthdate, email, password): any{
    var isTaken = false;
    return new Promise((resolve, reject)=>{
      this.getUsers().then(data=>{
        console.log('function');
        console.log(data);
        if(data){
        for(var i in data){
          if(data[i].email == email){
            console.log('taken');
            reject('Email address already taken');
            isTaken = true;
            return;
          }
        }
        if(!isTaken){
          console.log('not is taken');
           //make new user by pushing then setting his credentials
                const newUser = this.RegUser.push({});
                newUser.set({
                 lastname: lastname, 
                 firstname: firstname, 
                 birthdate: birthdate, 
                 email: email, 
                 password: password,
                 id: newUser.key
                }).then( 
                newUser => { 
                  resolve(true);
                  return;
                }, error => {
                  reject('Cannot connect to the database');
                  return;
                });
        }
      }
      // if no user is register
      else{
              //make new user by pushing then setting his credentials
                const newUser = this.RegUser.push({});
                newUser.set({
                 lastname: lastname, 
                 firstname: firstname, 
                 birthdate: birthdate, 
                 email: email, 
                 password: password,
                 id: newUser.key
                }).then( 
                newUser => { 
                  resolve(true);
                  return;
                }, error => {
                  reject('Cannot connect to the database');
                  return;
                });
          }
      }, reason => {
        reject(reason);
        console.log(reason);
      })
  	});
  }

}