import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import firebase from 'firebase';

@Injectable()
export class PlsdalaProvider {


  db = firebase.database().ref();
  travelList: AngularFireList<any>;
  baseUrl = 'https://plsdala-8609a.firebaseio.com/';
  chatId;
  threadId;
  newThreadKey;
  users: any;

  constructor(public afd: AngularFireDatabase, public http: Http) {
    this.travelList = this.afd.list('travels');
    console.log('Hello PlsdalaProvider Provider');
  }

  addTravel(to, from, toDate, fromDate){
    return new Promise((resolve, reject)=>{
    const newTravel = this.travelList.push({});
    newTravel.set({
      fromX: from.x,
      fromY: from.y,
      fromAddress: from.address,
      fromDate: fromDate,
      toX: to.x,
      toY: to.y,
      toAddress: to.address,
      toDate: toDate,
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      userId: localStorage.getItem('id')
    }).then(
    newTravel => {
      resolve(true);
      return;
    }, error => {
      reject('Cannot connect to the database');
      return;
    })
  });
  }

  getTravelList(){
    return this.afd.list('travels');
  }

  checkUsers(users){
      console.log('run');
      return new Promise((resolve, reject)=>{
      var clUserCount = Object.keys(users).length;
      var dbUserCount = 0;
      var finalCheck = 0;
      var threadId: string;
      const checkUsersInDb = firebase.database().ref('threads');
      checkUsersInDb.on('value', snapshot=>{

        //for adding when no thread is present
        if(!snapshot.val()){
          resolve(null);
        }
        snapshot.forEach(snap=>{
          snap.child('users').forEach(snap2=>{
            for(let user in users){
              if(threadId){
                break;
              }
              if(snap2.key == users[user]){
                finalCheck++;
                console.log(finalCheck);
                if(finalCheck == clUserCount){
                  console.log('here');
                  threadId = snap.key;
                  resolve(threadId);
                  return true;
                }
                break;
              }
            }
            dbUserCount++;
            return false;
          })
          finalCheck=0;
          return false;
        })
        resolve(null);
        return;
      })
    });
  }

  getMessages(users):any{
    return new Promise(resolve=>{
      this.checkUsers(users).then(data=>{
        if(data){
          resolve(data);
          return;
        }
        else{
          const newThread = this.afd.list('threads').push({});
          newThread.set({
            users:{
              [users.user1]: true,
              [users.user2]: true
            }
          });
          this.newThreadKey = newThread.key;
          resolve(newThread.key);
        }
      });
    })
  }

  addMessage(details, users){
    this.checkUsers(users).then(data=>{
      console.log(data);
      if(data){
      const newMessage = this.afd.list('messages/' + data).push({});
      newMessage.set({
        content: details.content,
        userId: details.sentBy,
        name: details.name
      })
      }
      else{
        const newMessage = this.afd.list('messages/' + this.newThreadKey).push({});
        newMessage.set({
          content: details.content,
          userId: details.sentBy,
          name: details.name
        })
      }
    });
  }

  postData(credentials, type){
    return new Promise((resolve, reject) =>{
        let headers = new Headers();
        this.http.post("http://localhost/PHP-Slim-Restful/api/"+type, JSON.stringify(credentials), {headers: headers}).
        subscribe(res =>{
          resolve(res.json());
        }, (err) =>{
        reject(err);
      });
    });
  }

  uploadPhoto(picdata, uploadData){
    for (let i in picdata)
      this.upload(picdata[i],i, uploadData);
  }

  upload(x ,y, uploadData){
    var picurl = [];      
    firebase.storage().ref('items').child('user-'+localStorage.getItem('id')).child(uploadData.imageName.concat('.png'))
    //add child for transaction id

    .putString(x,'base64',{contentType:'image/png'})
    .then(savepic=>{
      picurl[y]=savepic.downloadURL;              // DOWNLOAD URL FOR EACH PIC. MUST BE STORED 
    })}
}
