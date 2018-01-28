import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';;
import { ToastController } from 'ionic-angular'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
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
  user: any;

  constructor(public toastCtrl: ToastController, public afd: AngularFireDatabase, public http: Http) {
    this.travelList = this.afd.list('travels');
    firebase.database().ref('users/')
    .child(firebase.auth().currentUser.uid)
    .once('value', user => {
      this.user = user;
    });
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
      firstname: this.user.val().firstname,
      lastname: this.user.val().lastname,
      email: this.user.val().email,
      userId: this.user.key
    })
    .then(
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

  getUserList(){
    return this.afd.list('users');
  }

  checkUsers(users){
      console.log('run');
      return new Promise((resolve, reject)=>{
      var clUserCount = Object.keys(users).length;
      var dbUserCount = 0;
      var finalCheck = 0;
      var threadId: string;
      const checkUsersInDb = firebase.database().ref('thread_users');
      checkUsersInDb.on('value', snapshot=>{

        //for adding when no thread is present
        if(!snapshot.val()){
          resolve(null);
        }
        snapshot.forEach(snap=>{
          snap.forEach(snap2=>{
            for(let user in users){
              if(threadId){
                break;
              }
              if(snap2.key == users[user]){
                finalCheck++;
                console.log(finalCheck);
                if(finalCheck == clUserCount){
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
          const newThread = this.afd.list('thread_users').push({});
          newThread.set({
            [users.user1]: true,
            [users.user2]: true
          });
          this.newThreadKey = newThread.key;
          resolve(newThread.key);
        }
        return;
      });
    })
  }

  addMessage(details, users){
    this.checkUsers(users).then(data=>{
      console.log(this.user.key);
      console.log(users);
      if(data){
        const newMessage = this.afd.list('messages/' + data).push({});
        newMessage.set({
          content: details.content,
          senderFirstname: this.user.val().firstname,
          senderLastname: this.user.val().lastname,
          senderId: this.user.key,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        firebase.database().ref().child('threads/' + this.user.key + '/' + data).update({
          title: details.receiverFirstname + ' ' + details.receiverLastname,
          lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
          seen: true,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        firebase.database().ref().child('threads/' + users.receiverId + '/' + data).update({
          title: this.user.val().firstname + ' ' + this.user.val().lastname,
          lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
          seen: false,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });
  }

  getChatList(){
    return this.afd.list('threads/' + this.user.key);
  }

  getUserInChatList(threadId){
    return new Promise(resolve=>{
      const checkUsersInDb = firebase.database().ref('thread_users/' + threadId);
      checkUsersInDb.once('value', snapshot=>{
        resolve(snapshot.val());
        console.log(snapshot, snapshot.val());
      });
    });
  }

  editProfile(uid, data){
    return new Promise(resolve=>{
      firebase.database().ref('users').child(uid).update(data);
      return resolve(true);
    });
  }

  uploadProfilePhoto(imageData){
    const photoRef = firebase.storage().ref('users').child(this.user.uid);
    photoRef.putString(imageData, 'base64', { contentType: 'image/png'})
    .then(savedPhoto=>{
      this.toastCtrl.create({
         message: 'Photo uploaded!',
         duration: 3000
       }).present();
      firebase.database().ref('users').child(this.user.uid).update({
        profileimage: savedPhoto.downloadURL
      });
    });
  }

  saveUserImage(uid, photo){
    firebase.database().ref('users').child(uid).update({
      profileImage: photo
    });
  }

  addItem(data, item){
    return new Promise(resolve=>{
      const newItem = this.afd.list('travel_items/' + item.key).push({});
      newItem.set({
       itemName: data.name,
       sender: this.user.key,
       receiverName: data.receiverName,
       receiverId: data.receiverId
      }).then(_=>{
        if(data.description){
          firebase.database().ref('travel_items/' + item.key).child(newItem.key).update({
            itemDescription: data.description,
          });
        }
      });
      return resolve(newItem.key);
    });
  }

  uploadItemPhoto(picdata, index, itemkey, dbkey){
    var image = [];
    firebase.storage().ref('items').child(firebase.auth().currentUser.uid)
    .child(this.photoId().concat('png'))
    .putString(picdata, 'base64', {contentType: 'image/png'})
    .then(savedPhoto=>{
      firebase.database().ref('travel_items/' + itemkey).child(dbkey).child('images').update({
        [index]: savedPhoto.downloadURL
      })
    });
  }

  photoId(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  addItemMessage(users, keydata){   
    this.checkUsers(users).then(data=>{
      if(data){
        const newMessage = this.afd.list('messages/' + data).push({});
        newMessage.set({
          isItem: true,
          senderFirstname: this.user.val().firstname,
          senderLastname: this.user.val().lastname,
          senderId: this.user.key,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          item: keydata
        });

        // firebase.database().ref().child('threads/' + this.user.key + '/' + data).update({
        //   title: details.receiverFirstname + ' ' + details.receiverLastname,
        //   lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
        //   seen: true,
        //   timestamp: firebase.database.ServerValue.TIMESTAMP
        // });

        // firebase.database().ref().child('threads/' + users.receiverId + '/' + data).update({
        //   title: this.user.val().firstname + ' ' + this.user.val().lastname,
        //   lastMessage: this.user.val().firstname + ' ' + this.user.val().lastname + ': ' + details.content,
        //   seen: false,
        //   timestamp: firebase.database.ServerValue.TIMESTAMP
        // });
      }
    });
  }

  getItemsAtTravel(travelKey){
    console.log(travelKey);
    return this.afd.list('travel_items/' + travelKey);
  }
}
